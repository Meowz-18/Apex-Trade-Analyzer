// lib/providers/yahooProvider.ts

import { MarketQuote, Candle } from "@/lib/services/marketService"; // We'll need to update marketService types later or define shared types

// Define standardized types locally for now if they aren't fully compatible yet, 
// or assuming we update marketService.ts in the next phase. 
// For now, let's use the layout from the plan.

export interface YahooQuote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketTime: number;
}

export class YahooProvider {
    private static BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

    /**
     * Fetch current price quote for a stock/index
     */
    static async getQuote(symbol: string): Promise<MarketQuote | null> {
        try {
            // Yahoo's chart endpoint includes meta data with the current price
            const response = await fetch(`${this.BASE_URL}/${symbol}?interval=1d&range=1d`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });
            if (!response.ok) throw new Error(`Yahoo API error: ${response.status} ${response.statusText}`);

            const data = await response.json();
            const meta = data.chart?.result?.[0]?.meta;

            if (!meta) return null;

            return {
                symbol: meta.symbol,
                price: meta.regularMarketPrice,
                change: meta.regularMarketPrice - meta.chartPreviousClose, // Calculate change manually if needed or use meta.regularMarketPrice - meta.previousClose
                changePercent: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
                timestamp: meta.regularMarketTime * 1000,
            };
        } catch (error) {
            console.error(`YahooProvider Error (${symbol}):`, error);
            return null;
        }
    }

    /**
     * Fetch OHLC history
     */
    static async getHistory(symbol: string, range: string = "1mo", interval: string = "1d"): Promise<Candle[]> {
        try {
            const response = await fetch(`${this.BASE_URL}/${symbol}?interval=${interval}&range=${range}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });
            if (!response.ok) throw new Error(`Yahoo API error: ${response.statusText}`);

            const data = await response.json();
            const result = data.chart?.result?.[0];

            if (!result) return [];

            const timestamps = result.timestamp || [];
            const quotes = result.indicators.quote[0];

            const candles: Candle[] = timestamps.map((ts: number, i: number) => ({
                // Fix: Include time for unique keys in intraday charts
                date: new Date(ts * 1000).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                time: ts, // Unix timestamp in seconds
                price: quotes.close[i] || 0, // Fallback for nulls
                open: quotes.open[i] || 0,
                high: quotes.high[i] || 0,
                low: quotes.low[i] || 0,
                close: quotes.close[i] || 0,
                volume: quotes.volume ? (quotes.volume[i] || 0) : 0,
            })).filter((c: Candle) => c.price !== null && c.price !== 0); // Filter incomplete data

            return candles;
        } catch (error) {
            console.error(`YahooProvider History Error (${symbol}):`, error);
            return [];
        }
    }
}
