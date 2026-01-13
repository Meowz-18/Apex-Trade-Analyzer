// scripts/test-binance.js
async function testBinance() {
    const symbol = "BTCUSDT";
    const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;

    console.log(`Fetching ${url}...`);
    try {
        const res = await fetch(url);
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

testBinance();
