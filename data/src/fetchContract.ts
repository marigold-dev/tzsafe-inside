import { TEMP_FOLDER_PATH, TZKT_API, VERSIONS } from './context/config';
import { fetchWithRetry } from './util';
import * as fs from 'fs';
import * as path from 'path';

const allVersion = () => Object.keys(VERSIONS).join(",");
const tempFolderPath = path.join(TEMP_FOLDER_PATH, 'contracts');

const fetchContracts = async () => {
    if (!fs.existsSync(tempFolderPath)) {
        fs.mkdirSync(tempFolderPath, { recursive: true });
    }

    let offset = 0;
    let shouldContinue = false;
    const limit = 100;

    do {
        const query = `${TZKT_API}/contracts?codeHash.in=${allVersion()}&limit=${limit}&offset=${offset}&sort.desc=lastActivity&includeStorage=true`;
        const result = await fetchWithRetry(query);

        if (result && result.length > 0) {
            const filePath = path.join(tempFolderPath, `contracts_${offset}.json`);
            fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
            console.log(`Data written to ${filePath}`);

            shouldContinue = result.length === limit;
            offset += 1;
        } else {
            shouldContinue = false;
        }
    } while (shouldContinue);
};

fetchContracts().catch(console.error);
console.log('Finish fetching all contracts');

