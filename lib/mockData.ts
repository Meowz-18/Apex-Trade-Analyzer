export const MOCK_DATA = {
    NVDA: {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        price: 924.50,
        change: +3.25,
        marketCap: "2.2T",
        peRatio: "74.5",
        revenue: "+12% QoQ",
        signal: "BUY",
        confidence: "87%",
        reasoning: "AI infrastructure demand remains unprecedented. Technicals show a breakout above key resistance levels with strong volume.",
        news: [
            { title: "NVIDIA Announces New Blackwell GPU Architecture", sentiment: "Positive", source: "TechCrunch", url: "https://techcrunch.com/search/nvidia" },
            { title: "Analysts Raise Price Target to $1100", sentiment: "Positive", source: "Bloomberg", url: "https://www.bloomberg.com/search?query=nvidia" },
            { title: "Supply Chain Constraints Easing in Q3", sentiment: "Neutral", source: "Reuters", url: "https://www.reuters.com/site-search/?query=nvidia" }
        ],
        chartData: [
            { date: "Jan", price: 500 },
            { date: "Feb", price: 650 },
            { date: "Mar", price: 800 },
            { date: "Apr", price: 780 },
            { date: "May", price: 924.50 }
        ]
    },
    BTC: {
        symbol: "BTC",
        name: "Bitcoin",
        price: 98432.10,
        change: +2.4,
        marketCap: "1.9T",
        peRatio: "N/A",
        revenue: "N/A",
        signal: "STRONG BUY",
        confidence: "92%",
        reasoning: "Institutional accumulation is accelerating. Supply squeeze imminent post-halving dynamics. On-chain metrics bullish.",
        news: [
            { title: "ETF Inflows Hit Record Highs", sentiment: "Positive", source: "CoinDesk", url: "https://www.coindesk.com/search?s=bitcoin+etf" },
            { title: "Sovereign Wealth Fund Allocates to Crypto", sentiment: "Positive", source: "WSJ", url: "https://www.wsj.com/search?query=bitcoin" },
            { title: "Regulatory Clarity Improving in EU", sentiment: "Neutral", source: "Decrypt", url: "https://decrypt.co/search?q=eu+regulation" }
        ],
        chartData: [
            { date: "Mon", price: 92000 },
            { date: "Tue", price: 94000 },
            { date: "Wed", price: 93500 },
            { date: "Thu", price: 96000 },
            { date: "Fri", price: 98432 }
        ]
    },
    TSLA: {
        symbol: "TSLA",
        name: "Tesla, Inc.",
        price: 175.30,
        change: -1.2,
        marketCap: "550B",
        peRatio: "40.2",
        revenue: "-5% YoY",
        signal: "HOLD",
        confidence: "60%",
        reasoning: "Competition in EV space intensifying. Margins under pressure despite strong delivery numbers. Wait for clarity on FSD rollout.",
        news: [
            { title: "Tesla Cuts Prices in China Again", sentiment: "Negative", source: "CNBC", url: "https://www.cnbc.com/search/?query=tesla%20china%20price%20cuts" },
            { title: "Cybertruck Production Ramping Up", sentiment: "Positive", source: "The Verge", url: "https://www.theverge.com/search?q=cybertruck" },
            { title: "FSD Beta v12 Rolling Out", sentiment: "Neutral", source: "Electrek", url: "https://electrek.co/guides/fsd-beta/" }
        ],
        chartData: [
            { date: "Jan", price: 240 },
            { date: "Feb", price: 200 },
            { date: "Mar", price: 180 },
            { date: "Apr", price: 170 },
            { date: "May", price: 175.30 }
        ]
    }
};
