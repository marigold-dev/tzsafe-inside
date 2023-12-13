import * as fs from 'fs';
import * as path from 'path';
import { TEMP_FOLDER_PATH, OUTPUT_PATH } from './context/config';

interface Storage {
    proposal_counter: string;
    effective_period: string;
    threshold: string;
}

interface ContractData {
    address: string;
    tzsafe_version: string;
    firstActivityTime: string;
    lastActivityTime: string;
    balance: number;
    token_count: number;
    owner_count: number;
    threshold_percentage: number;
    storage: Storage
}

const tempFolderPath = path.join(TEMP_FOLDER_PATH, 'contracts');

function writeToFile(record: Record<string, any>, filename: string) {
    const filepath = path.join(OUTPUT_PATH, filename);
    fs.writeFileSync(filepath, JSON.stringify(record, null, 2));
    console.log('Written to:', filepath);
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

fs.readdir(tempFolderPath, (err, files) => {
    if (err) {
        console.error('Error reading files from temp folder:', err);
        return;
    }

    const statisticsOwnerCount : Record<number, number> = {}
    const statisticsThresholdPercentage : Record<number, number> = {}
    const statisticsThresholdPercentageSans1Of1: Record<number, number> = {}
    const statisticsThresholdPercentageWith1OfM: Record<number, number> = {}
    const statisticsTokensCount: Record<number, number> = {}
    const statisticsXTZCount: Record<number, number> = {}

    const combinedData: Record<string, number| string>[] = [];


    for (const file of files) {
        const filePath = path.join(tempFolderPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        try {
            const data: ContractData[] = JSON.parse(fileContent);
            data.forEach(item => {
                let threshold_percentage = Math.round(item.threshold_percentage * 10000) / 100;
                const balance = Math.round(item.balance/10000)/100
                const secondsPerDay = 86400;
                const effective_period = Math.round(Number(item.storage.effective_period) / secondsPerDay);
                const proposal_counter = Number(item.storage.proposal_counter);
                const threshold = Number(item.storage.threshold)
                combinedData.push(
                {
                        address: item.address,
                        tzsafe_version: item.tzsafe_version,
                        lastActivityTime: formatDate(item.lastActivityTime),
                        firstActivityTime: formatDate(item.firstActivityTime),
                        balance: balance,
                        owner_count: item.owner_count,
                        token_count: item.token_count,
                        threshold: threshold,
                        threshold_percentage: threshold_percentage,
                        effective_period: effective_period,
                        proposal_counter: proposal_counter,
                })

                if (statisticsOwnerCount[item.owner_count])
                    statisticsOwnerCount[item.owner_count] += 1;
                else
                    statisticsOwnerCount[item.owner_count] = 1;
                
                threshold_percentage = Math.round(threshold_percentage);

                if (statisticsThresholdPercentage[threshold_percentage])
                   statisticsThresholdPercentage[threshold_percentage] += 1;
                else
                    statisticsThresholdPercentage[threshold_percentage] = 1;

                if (!(item.owner_count === 1 && item.storage.threshold === "1")) {
                    if (statisticsThresholdPercentageSans1Of1[threshold_percentage])
                        statisticsThresholdPercentageSans1Of1[threshold_percentage] += 1;
                    else
                        statisticsThresholdPercentageSans1Of1[threshold_percentage] = 1;
                }

                if (item.storage.threshold === "1") {
                    if (statisticsThresholdPercentageWith1OfM[threshold_percentage])
                        statisticsThresholdPercentageWith1OfM[threshold_percentage] += 1;
                    else
                        statisticsThresholdPercentageWith1OfM[threshold_percentage] = 1;
                }

                if (statisticsTokensCount[item.token_count])
                    statisticsTokensCount[item.token_count] += 1;
                else
                    statisticsTokensCount[item.token_count] = 1;

                const xtz = Math.round(balance);
                if (statisticsXTZCount[xtz])
                    statisticsXTZCount[xtz] += 1;
                else
                    statisticsXTZCount[xtz] = 1;
            });
        } catch (jsonErr) {
            console.error(`Error parsing JSON in file ${file}:`, jsonErr);
        }
    }


    writeToFile(combinedData, 'allData.json');
    writeToFile(statisticsOwnerCount, 'statisticsOwnerCount.json');
    writeToFile(statisticsThresholdPercentage, 'statisticsThresholdPercentage.json');
    writeToFile(statisticsThresholdPercentageSans1Of1, 'statisticsThresholdPercentageSans1Of1.json');
    writeToFile(statisticsThresholdPercentageWith1OfM, 'statisticsThresholdPercentageWith1OfM.json');
    writeToFile(statisticsTokensCount, 'statisticsTokenCount.json');
    writeToFile(statisticsXTZCount, 'statisticsXTZCount.json');
});