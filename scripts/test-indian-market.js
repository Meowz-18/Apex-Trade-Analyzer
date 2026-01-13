// scripts/test-indian-market.js
async function testIndianMarket() {
    // Yahoo Finance uses .NS for NSE and .BO for BSE
    const symbols = ["RELIANCE.NS", "^NSEI", "TCS.NS"];

    for (const symbol of symbols) {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        console.log(`Fetching ${symbol}...`);

        try {
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });

            if (!res.ok) {
                console.error(`Failed: ${res.status} ${res.statusText}`);
                continue;
            }

            const data = await res.json();
            const meta = data.chart?.result?.[0]?.meta;

            if (meta) {
                console.log(`Success: ${meta.symbol} | Price: ${meta.regularMarketPrice} ${meta.currency}`);
            } else {
                console.error("No metadata found.");
            }

        } catch (e) {
            console.error("Fetch failed:", e.message);
        }
    }
}

testIndianMarket();
