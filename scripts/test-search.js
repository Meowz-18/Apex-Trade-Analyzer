// scripts/test-search.js
async function testSearch(query) {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;
    console.log(`Searching for: ${query}...`);

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!res.ok) {
            console.error(`Failed: ${res.status} ${res.statusText}`);
            return;
        }

        const data = await res.json();
        if (data.quotes && data.quotes.length > 0) {
            data.quotes.forEach(q => {
                console.log(`[${q.symbol}] ${q.shortname || q.longname} (${q.quoteType}) - Exch: ${q.exchange}`);
            });
        } else {
            console.log("No results found.");
        }

    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

testSearch("ADA");
testSearch("RELIANCE");
