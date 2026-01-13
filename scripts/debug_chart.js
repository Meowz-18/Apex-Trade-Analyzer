// Debug Script for Chart Data Logic

// Mock browser-like fetch in Node
// global.fetch = fetch; // Node 18+ has fetch built-in

// Mock MemoryCache since it uses simple Map
const MemoryCache = {
    get: () => null,
    set: () => { }
};
// We need to mock the import of MemoryCache in the services if we were running them directly
// But we are running a script that imports them.
// Since the files use TS imports, we can't easily run them with 'node' without compilation or ts-node.
// Instead, I will rewrite the logic in this script to mimic the providers exactly.

const YahooProvider = {
    async getHistory(symbol, range, interval) {
        console.log(`[Yahoo] Fetching ${symbol} range=${range} interval=${interval}`);
        try {
            const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`);
            const data = await res.json();
            const result = data.chart?.result?.[0];
            if (!result) return "No Result";
            const timestamps = result.timestamp || [];
            console.log(`[Yahoo] Got ${timestamps.length} points.`);
            // Check first few dates
            const firstDate = new Date(timestamps[0] * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const secondDate = new Date(timestamps[1] * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            console.log(`[Yahoo] Sample Dates formatted: ${firstDate}, ${secondDate}`);
            return timestamps.length;
        } catch (e) { console.error(e.message); }
    }
};

const CoinGeckoProvider = {
    async getHistory(symbol, days) {
        console.log(`[CoinGecko] Fetching ${symbol} days=${days}`);
        const idMap = { "XRP": "ripple", "BTC": "bitcoin" };
        const id = idMap[symbol] || "bitcoin";
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
            if (!res.ok) {
                console.log(`[CoinGecko] Error ${res.status}: ${await res.text()}`);
                return;
            }
            const data = await res.json();
            const prices = data.prices || [];
            console.log(`[CoinGecko] Got ${prices.length} points.`);
            // Check first few dates
            if (prices.length > 1) {
                const firstDate = new Date(prices[0][0]).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const secondDate = new Date(prices[1][0]).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                console.log(`[CoinGecko] Sample Dates formatted: ${firstDate}, ${secondDate}`);
            }
            return prices.length;
        } catch (e) { console.error(e.message); }
    }
};

async function run() {
    console.log("--- Testing TSLA 1D (Yahoo) ---");
    await YahooProvider.getHistory("TSLA", "1d", "5m");

    console.log("\n--- Testing XRP 1D (CoinGecko) ---");
    await CoinGeckoProvider.getHistory("XRP", 1);

    console.log("\n--- Testing XRP 1Y (CoinGecko) ---");
    await CoinGeckoProvider.getHistory("XRP", 365);
}

run();
