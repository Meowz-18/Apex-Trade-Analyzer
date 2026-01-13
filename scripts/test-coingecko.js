// scripts/test-coingecko.js
async function testCoinGecko() {
    // CoinGecko uses IDs, so BTC = bitcoin
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true";

    console.log(`Fetching ${url}...`);
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });
        console.log(`Status: ${res.status} ${res.statusText}`);
        if (!res.ok) {
            console.error(await res.text());
            return;
        }
        const data = await res.json();
        console.log("Data:", data);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testCoinGecko();
