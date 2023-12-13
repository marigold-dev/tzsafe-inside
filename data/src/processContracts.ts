import { TEMP_FOLDER_PATH, TZKT_API, VERSIONS } from './context/config';

import * as fs from 'fs';
import * as path from 'path';
import { fetchWithRetry, sleep } from './util';

const tempFolderPath = path.join(TEMP_FOLDER_PATH, 'contracts');

fs.readdir(tempFolderPath, (err, files) => {
    if (err) {
        console.error('Error reading files from tmp folder:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(tempFolderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let data;

        try {
            data = JSON.parse(fileContent);
        } catch (jsonErr) {
            console.error(`Error parsing JSON in file ${file}:`, jsonErr);
            return;
        }

        data.forEach((item: any) => {
            if (typeof item.codeHash === 'number') {
                const strCodeHash :string = item.codeHash.toString();
                item["tzsafe_version"] = VERSIONS[strCodeHash];
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    });

    console.log('All files processed for version.');
});

fs.readdir(tempFolderPath, async (err, files) => {
    if (err) {
        console.error('Error reading files from tmp folder:', err);
        return;
    }

    for (const file of files) {
        const filePath = path.join(tempFolderPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        try {
            const data = JSON.parse(content);
            for (const item of data) {
                // fetch token
                const tokensData = await fetchWithRetry(`${TZKT_API}/tokens/balances?account=${item.address}&limit=1000`);
                item.tokens = tokensData;
                item.token_count = tokensData.length;

                // count owners
                item.owner_count = item.storage.owners.length

                // threshold in percentage
                item.threshold_percentage = parseInt(item.storage.threshold) / item.owner_count
            }

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (jsonErr) {
            console.error(`Error processing file ${file}:`, jsonErr);
        }
        await sleep(3000);
    }

    console.log('All files processed for tokens.');
});