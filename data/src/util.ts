export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithRetry = async (url: string, retries: number = 5): Promise<any> => {
    console.log("URL", url)
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.log(`Attempt ${i + 1} failed; retrying in 5 seconds...`);
            await sleep(5000);
        }
    }
    throw new Error('Max retries reached.');
};