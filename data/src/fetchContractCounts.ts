import { TZKT_API, VERSIONS, OUTPUT_PATH, OVERWRITE } from './context/config';
import * as fs from 'fs';
import * as path from 'path';
import { fetchWithRetry } from './util';


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchContractCounts = async (hashes: Record<string, string>, query: string | undefined = undefined, maxRetries: number = 3): Promise<Record<string, number>> => {
    const counts: Record<string, number> = {};

    query = query === undefined ? "" : `&${query}`;

    for (const [hash, version] of Object.entries(hashes)) {
        let attempts = 0;

        const count = await fetchWithRetry(`${TZKT_API}/contracts/count?codeHash=${hash}${query}`);
        counts[version] = Number(count);
    }

    return counts;
};

function sortObjectByKey(obj: { [key: string]: number }): { [key: string]: number } {
    const sortedEntries = Object.entries(obj).sort((a, b) => {
        // Assuming the keys are semver-like strings, we split them by dots and compare each segment
        const aParts = a[0].split('.');
        const bParts = b[0].split('.');

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aVal = parseInt(aParts[i], 10) || 0;
            const bVal = parseInt(bParts[i], 10) || 0;

            if (aVal !== bVal) return aVal - bVal;

            // Handling alphanumeric parts (like '11b')
            if (aParts[i] !== bParts[i]) {
                return aParts[i] > bParts[i] ? 1 : -1;
            }
        }

        return 0;
    });

    return Object.fromEntries(sortedEntries);
}

const allContractCountFile = path.join(OUTPUT_PATH, "allContractCount.json");
const monthlyContractCountFile = path.join(OUTPUT_PATH, "monthlyContractCount.json");
const tenXTZContractCountFile = path.join(OUTPUT_PATH, "10XTZContractCount.json");
const monthlyActivityContractCountFile = path.join(OUTPUT_PATH, "monthlyActivityContractCount.json");

if (OVERWRITE || !fs.existsSync(allContractCountFile)) {
    fetchContractCounts(VERSIONS).then(counts => {
        fs.writeFileSync(allContractCountFile, JSON.stringify(sortObjectByKey(counts), null, 2));
        console.log('Data written to allContractCount.json');
    }).catch(error => {
        console.error('An error occurred:', error);
    });
    console.log(`The ${allContractCountFile} file  written to file.`);
} else {
    console.log(`The ${allContractCountFile} file already exists.`);
}


function oneMonthAgo(): string {
    const now = new Date();
    now.setMonth(now.getMonth() - 1); // Subtract one month

    // Format the date in ISO 8601 format
    return now.toISOString();
}

if (OVERWRITE || !fs.existsSync(monthlyContractCountFile)) {
    fetchContractCounts(VERSIONS, `firstActivityTime.gt=${oneMonthAgo()}`).then(counts => {
        fs.writeFileSync(monthlyContractCountFile, JSON.stringify(sortObjectByKey(counts), null, 2));
        console.log('Data written to monthlyContractCount.json');
    }).catch(error => {
        console.error('An error occurred:', error);
    });
    console.log(`The ${monthlyContractCountFile} file  written to file.`);
} else {
    console.log(`The ${monthlyContractCountFile} file already exists.`);
}


if (OVERWRITE || !fs.existsSync(tenXTZContractCountFile)) {
    fetchContractCounts(VERSIONS, `balance.gt=10000000`).then(counts => {
        fs.writeFileSync(tenXTZContractCountFile, JSON.stringify(sortObjectByKey(counts), null, 2));
        console.log('Data written to 10XTZContractCount.json');
    }).catch(error => {
        console.error('An error occurred:', error);
    });
    console.log(`The ${tenXTZContractCountFile} file  written to file.`);
} else {
    console.log(`The ${tenXTZContractCountFile} file already exists.`);
}

if (OVERWRITE || !fs.existsSync(monthlyActivityContractCountFile)) {
    fetchContractCounts(VERSIONS, `lastActivityTime.gt=${oneMonthAgo()}`).then(counts => {
        fs.writeFileSync(monthlyActivityContractCountFile, JSON.stringify(sortObjectByKey(counts), null, 2));
        console.log('Data written to monthlyActivityContractCount.json');
    }).catch(error => {
        console.error('An error occurred:', error);
    });
    console.log(`The ${monthlyActivityContractCountFile} file  written to file.`);
} else {
    console.log(`The ${monthlyActivityContractCountFile} file already exists.`);
}