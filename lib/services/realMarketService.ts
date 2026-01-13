// lib/services/realMarketService.ts

import { YahooProvider } from "@/lib/providers/yahooProvider";
import { CoinGeckoProvider } from "@/lib/providers/coingeckoProvider";
import { MemoryCache } from "@/lib/cache/memoryCache";
import { MarketQuote, Candle } from "@/lib/services/marketService"; // Keep shared types

export type AssetType = "STOCK" | "CRYPTO" | "INDEX";

export class RealMarketService {
    // Cache TTLs
    private static TTL_QUOTE = 30; // 30 seconds
    private static TTL_HISTORY = 300; // 5 minutes

    /**
     * Determine asset type based on known simulation list or primitive regex.
     */
    private static getAssetType(symbol: string): AssetType {
        const s = symbol.toUpperCase();
        // Check for common crypto tickers or explicit USDT pairs
        if (["BTC", "ETH", "SOL", "DOGE", "XRP", "BNB", "ADA", "DOT", "LINK", "AVAX"].includes(s) || s.endsWith("USDT")) return "CRYPTO";
        if (s.startsWith("^") || ["SPY", "QQQ"].includes(s)) return "INDEX";
        return "STOCK";
    }

    /**
     * Get live quote with caching
     */
    static async getQuote(symbol: string, type?: AssetType): Promise<MarketQuote | null> {
        const cacheKey = `quote:${symbol.toUpperCase()}`;
        const cached = MemoryCache.get<MarketQuote>(cacheKey);
        if (cached) return cached;

        const assetType = type || this.getAssetType(symbol);
        let quote: MarketQuote | null = null;

        if (assetType === "CRYPTO") {
            try {
                quote = await CoinGeckoProvider.getQuote(symbol);
            } catch (e) {
                console.warn(`CoinGecko quote failed for ${symbol}, trying Yahoo fallback...`);
            }

            // Fallback to Yahoo if CoinGecko returns null or fails
            // Yahoo usually uses "BTC-USD" format
            if (!quote) {
                const yahooSymbol = `${symbol.toUpperCase()}-USD`;
                quote = await YahooProvider.getQuote(yahooSymbol);
                // Patch the symbol back to original simple name if successful
                if (quote) quote.symbol = symbol.toUpperCase();
            }
        } else {
            // Yahoo handles Stocks and Indices
            quote = await YahooProvider.getQuote(symbol);
        }

        if (quote) {
            MemoryCache.set(cacheKey, quote, this.TTL_QUOTE);
        } else {
            console.warn(`All real-time providers failed for ${symbol}. Falling back to simulation.`);
            try {
                // Import mock service dynamically or ensure it is imported
                const { MarketService } = await import("./marketService"); // Avoid circular dep if possible, or just import at top if safe
                quote = MarketService.getQuote(symbol);
            } catch (mockErr) {
                console.error("Even mock simulation failed", mockErr);
            }
        }

        return quote;
    }

    /**
     * Get History with caching
     */
    static async getHistory(symbol: string, type?: AssetType, range: string = "1M"): Promise<Candle[]> {
        const cacheKey = `history:${symbol.toUpperCase()}:${range}`;
        const cached = MemoryCache.get<Candle[]>(cacheKey);
        if (cached) return cached;

        const assetType = type || this.getAssetType(symbol);
        let history: Candle[] = [];

        if (assetType === "CRYPTO") {
            // Map range to days for CoinGecko
            const daysMap: Record<string, number> = {
                "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, "ALL": 3650
            };
            history = await CoinGeckoProvider.getHistory(symbol, daysMap[range] || 30);
        } else {
            // Yahoo map: range -> [range, interval]
            // 1D -> 1d, 5m
            // 1W -> 5d, 15m
            // 1M -> 1mo, 1d
            // 3M -> 3mo, 1d
            // 1Y -> 1y, 1wk
            // ALL -> max, 1mo
            const yahooMap: Record<string, [string, string]> = {
                "1D": ["1d", "5m"],
                "1W": ["5d", "15m"],
                "1M": ["1mo", "1d"],
                "3M": ["3mo", "1d"],
                "1Y": ["1y", "1wk"], // Corrected from 1wd
                "ALL": ["max", "1mo"]
            };
            const [yRange, yInterval] = yahooMap[range] || ["1mo", "1d"];
            history = await YahooProvider.getHistory(symbol, yRange, yInterval);
        }

        if (history.length > 0) {
            MemoryCache.set(cacheKey, history, this.TTL_HISTORY);
        }

        return history;
    }
}
