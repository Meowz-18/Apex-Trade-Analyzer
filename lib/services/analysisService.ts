// lib/services/analysisService.ts

import { RealMarketService, AssetType } from "./realMarketService";
import { MarketQuote } from "./marketService";
import { calculateATR } from "@/lib/utils/indicators";
import { formatSymbolName } from "@/lib/utils/formatters";

// --- Shared News Templates ---
const NEWS_TEMPLATES = {
    POSITIVE: [
        "Analysts upgrade {name} following strong earnings guidance.",
        "Institutional accumulation detected in {symbol} dark pools.",
        "{name} announces breakthrough in AI infrastructure expansion.",
        "Market sentiment shifts bullish for {symbol} as sector rallies.",
    ],
    NEGATIVE: [
        "{name} faces regulatory scrutiny over new policy changes.",
        "Supply chain headwinds coincide with {symbol} price rejection.",
        "Insider selling volume spikes for {name} amidst volatility.",
        "{symbol} breaks below critical support levels on high volume.",
    ],
    NEUTRAL: [
        "{name} consolidates as market awaits Fed decision.",
        "Mixed signals for {symbol} as trading volume stabilizes.",
        "{name} announces strategic partnership discussions.",
        "Sector rotation leaves {symbol} trading sideways.",
    ]
};

// --- Model A: Technical Analyst (Technical/Deep Dive) ---
const REASONING_TECHNICAL = {
    BUY: [
        `Status: Bullish Continuation Detected
1. Macro Context: Global liquidity conditions are favoring risk-on assets. Yield spreads are narrowing, providing a tailwind for {symbol}.
2. Technical Deep Dive: Price has reclaimed the 50-day EMA with a high-volume breakout candle. RSI is curling up from neutral territory (55).
3. Verdict: Probability of upside continuation is High.`,
        `Status: Momentum Breakout
1. Structure: Validated "Inverse Head & Shoulders" pattern on the 4H chart.
2. Indicators: MACD line has crossed the signal line bullishly. ADX is rising above 25.
3. Verdict: Strong Buy. The path of least resistance is higher.`,
    ],
    SELL: [
        `Status: Bearish Rejection
1. Structure: Failed to break above the key supply zone. Rejected with a long upper wick.
2. Momentum: Bearish divergence observed on the RSI.
3. Verdict: Sell/Short. Expect a retest of lower demand zones.`,
        `Status: Distribution Phase
1. Structure: "Double Top" formation visible on the daily timeframe.
2. Indicators: Trading below the 200-day Moving Average. Death Cross confirmed.
3. Verdict: Risk Off. Capital preservation is recommended.`,
    ],
    HOLD: [
        `Status: Consolidation
1. Structure: Price is range-bound between well-defined support and resistance levels.
2. Momentum: RSI is flat at 50. MACD histogram is printing near zero.
3. Verdict: Hold. No clear edge at current prices.`,
    ]
};

// --- Model B: Sentiment Analyst (Sentiment/Social/On-Chain) ---
const REASONING_SENTIMENT = {
    BUY: [
        `Status: Arbitrage Opportunity
1. Social Sentiment: Mentions on X (Crypto Twitter) have spiked 400% in the last hour with positive sentiment.
2. On-Chain Data: Whale wallet inflows detected. 3 dormant addresses just moved heavily into {symbol}.
3. The Play: Front-run the retail FOMO wave.`,
        `Status: Viral Narrative
1. Narrative Check: The "{symbol} to the moon" meme is trending globally. Retail engagement is at an ATH.
2. Contrarian View: Funding rates are still neutral, suggesting the pump has legs before meaningful liquidation risk.
3. The Play: Aggressive Long targeting local highs.`,
    ],
    SELL: [
        `Status: Retail Capitulation Incoming
1. Social Sentiment: "HODL" hashtags are trending, usually a sign of bagholder denial.
2. On-Chain Data: Exchange inflows are massive. Miners/Insiders are dumping into this liquidity.
3. The Play: Fade the rally. Setup short positions.`,
        `Status: Narrative Exhaustion
1. Trend Check: Social engagement has dropped off a cliff (-60% DoD). The hype cycle is broken.
2. Metrics: NVT Ratio (Network Value to Transactions) signals overvaluation.
3. The Play: Exit positions immediately.`,
    ],
    HOLD: [
        `Status: Noise filtering
1. Sentiment: Social volume is high but sentiment is extremely polarized (50/50).
2. Analysis: Too much noise, not enough signal. Let the whales fight it out.
3. The Play: Sit on hands. Preserve capital.`,
    ]
};

export interface SingleModelResult {
    modelName: string;
    signal: "BUY" | "SELL" | "HOLD";
    confidence: string;
    reasoning: string;
}

export interface ComparisonResult {
    symbol: string;
    marketData: MarketQuote | null;
    news: { title: string; sentiment: "Positive" | "Negative" | "Neutral"; source: string; url?: string }[];
    modelA: SingleModelResult; // Technical
    modelB: SingleModelResult; // Sentiment
}

export class AnalysisService {
    static async analyze(symbol: string, type?: AssetType): Promise<ComparisonResult> {
        let quote: MarketQuote | null = null;
        try {
            quote = await RealMarketService.getQuote(symbol, type);
        } catch (error) {
            console.error(`Failed to fetch quote for ${symbol}`, error);
            // Fallback object or rethrow depending on desired behavior.
            // For now, let's allow it to throw if critical, or use prior logic
        }

        if (!quote) throw new Error(`Real-time market data unavailable for ${symbol}`);

        // --- Volatility Calculation (ATR) ---
        // Fetch 30 days history to calculate 14-period ATR
        let atr = 0;
        try {
            const history = await RealMarketService.getHistory(symbol, type, "1M");
            atr = calculateATR(history, 14);
        } catch (e) {
            console.warn("Failed to fetch history for ATR calculation, defaulting to 0 volatility", e);
        }

        // --- Shared News Generation ---
        const news = this.generateNews(symbol, quote.changePercent);

        // --- Model A: Technical Logic ---
        const resultA = this.simulateModelAnalysis(symbol, quote.changePercent, atr, "Technical Analyst", REASONING_TECHNICAL, 0);

        // --- Model B: Sentiment Logic (Wildcard) ---
        const resultB = this.simulateModelAnalysis(symbol, quote.changePercent, atr, "Sentiment Analyst", REASONING_SENTIMENT, 5);

        return {
            symbol,
            marketData: quote,
            news,
            modelA: resultA,
            modelB: resultB
        };
    }

    private static simulateModelAnalysis(
        symbol: string,
        changePercent: number,
        atr: number,
        modelName: string,
        templatesObj: typeof REASONING_TECHNICAL,
        confidenceOffset: number
    ): SingleModelResult {
        let signal: "BUY" | "SELL" | "HOLD" = "HOLD";

        // Logic (Deterministic)
        if (changePercent > 1.2) signal = "BUY";
        else if (changePercent < -1.2) signal = "SELL";
        else {
            if (changePercent > 0.3) signal = "BUY";
            else if (changePercent < -0.3) signal = "SELL";
            else signal = "HOLD";
        }

        const templates = templatesObj[signal];
        // Deterministic selection of template
        const templateIndex = (symbol.length + Math.floor(Math.abs(changePercent) * 10)) % templates.length;
        let reasoning = templates[templateIndex];
        const displaySymbol = formatSymbolName(symbol);
        reasoning = reasoning.replace(/{symbol}/g, displaySymbol).replace(/{name}/g, displaySymbol);

        // Deterministic Confidence Calculation (Volatility Based)
        // Base confidence starts at 60% (Neutral)
        let calculatedConfidence = 60;

        // 1. Volatility Impact (ATR)
        // Higher volatility = Higher conviction (validating the move)
        // Cap usage at 35%
        const volatilityFactor = Math.min(35, atr * 5);
        calculatedConfidence += volatilityFactor;

        // 2. Model Specific Bias
        calculatedConfidence += confidenceOffset;

        // Clamp between 55% and 99%
        const finalConfidence = Math.min(99.9, Math.max(55, calculatedConfidence));

        // Format to 1 decimal place
        const confidence = finalConfidence.toFixed(1) + "%";

        return { modelName, signal, confidence, reasoning };
    }

    public static generateNews(symbol: string, changePercent: number) {
        return Array.from({ length: 3 }).map((_, i) => {
            let sentiment: "Positive" | "Negative" | "Neutral" = "Neutral";

            // Deterministic sentiment based on change + index
            const isBullish = changePercent > 0.5;
            const isBearish = changePercent < -0.5;

            // i=0 follows trend, i=1 follows trend, i=2 is mixed/contrarian sometimes?
            // Let's keep it simple: strict correlation to price
            if (isBullish) sentiment = (i === 2 && changePercent < 2) ? "Neutral" : "Positive";
            else if (isBearish) sentiment = (i === 2 && changePercent > -2) ? "Neutral" : "Negative";
            else sentiment = "Neutral";

            const templates = NEWS_TEMPLATES[sentiment.toUpperCase() as keyof typeof NEWS_TEMPLATES];
            // Deterministic template selection
            const templateIndex = (symbol.length + i + Math.floor(Math.abs(changePercent) * 100)) % templates.length;
            const template = templates[templateIndex];
            const displaySymbol = formatSymbolName(symbol);
            const title = template.replace(/{name}/g, displaySymbol).replace(/{symbol}/g, displaySymbol);

            const sources = ["Bloomberg", "Reuters", "CoinDesk", "The Block", "WSJ"];
            const sourceIndex = (symbol.length + i) % sources.length;
            const source = sources[sourceIndex];

            let url = "#";
            // Generate realistic search URLs based on source
            switch (source) {
                case "Bloomberg": url = `https://www.bloomberg.com/search?query=${encodeURIComponent(symbol)}`; break;
                case "Reuters": url = `https://www.reuters.com/site-search/?query=${encodeURIComponent(symbol)}`; break;
                case "CoinDesk": url = `https://www.coindesk.com/search?s=${encodeURIComponent(symbol)}`; break;
                case "The Block": url = `https://www.theblock.co/search?q=${encodeURIComponent(symbol)}`; break;
                case "WSJ": url = `https://www.wsj.com/search?query=${encodeURIComponent(symbol)}`; break;
                default: url = `https://www.google.com/search?q=${encodeURIComponent(symbol + " news")}`;
            }



            return {
                title,
                sentiment,
                source,
                url
            };
        });
    }
}
