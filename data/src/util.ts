export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithTimeout = (url: string, timeout: number = 60000): Promise<any> => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
    ]);
};

export const fetchWithRetry = async (url: string, retries: number = 5): Promise<any> => {
    console.log("URL", url)
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetchWithTimeout(url);
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
