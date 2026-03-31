// lib/providers/coingeckoProvider.ts

import { MarketQuote, Candle } from "@/lib/services/marketService";

const COIN_MAP: Record<string, string> = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "DOGE": "dogecoin",
    "XRP": "ripple",
    "BNB": "binancecoin",
    "ADA": "cardano",
    "AVAX": "avalanche-2",
    "DOT": "polkadot",
    "LINK": "chainlink",
    "UNI": "uniswap",
    "SHIB": "shiba-inu"
};

export class CoinGeckoProvider {
    private static BASE_URL = "https://api.coingecko.com/api/v3";

    private static getCoinId(symbol: string): string | null {
        // Strip USDT if present (e.g., BTCUSDT -> BTC)
        const cleanSymbol = symbol.toUpperCase().replace("USDT", "");
        return COIN_MAP[cleanSymbol] || null;
    }

    /**
     * Fetch current price
     */
    static async getQuote(symbol: string): Promise<MarketQuote | null> {
        const id = this.getCoinId(symbol);
        if (!id) return null;

        try {
            const response = await fetch(`${this.BASE_URL}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });

            if (!response.ok) {
                console.warn(`CoinGecko API rate-limited or error for ${symbol}: ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            const coinData = data[id];

            if (!coinData) return null;

            return {
                symbol: symbol.toUpperCase(),
                price: coinData.usd,
                change: coinData.usd * (coinData.usd_24h_change / 100), // Approx change value
                changePercent: coinData.usd_24h_change,
                timestamp: Date.now()
            };
        } catch (error) {
            console.warn(`CoinGeckoProvider Warning (${symbol}):`, error instanceof Error ? error.message : error);
            return null;
        }
    }

    /**
     * Fetch OHLC History
     * CoinGecko returns [timestamp, price] for 'market_chart'
     * For true candles we need /ohlc endpoint but that has limited granularity on free tier (1-7 days).
     * 'market_chart' gives prices, we can approximate candles or just map price-to-close for line chart.
     * Recharts LineChart uses 'price' field so simple mapping works nicely.
     */
    static async getHistory(symbol: string, days: number = 30): Promise<Candle[]> {
        const id = this.getCoinId(symbol);
        if (!id) return [];

        try {
            const response = await fetch(`${this.BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });

            if (!response.ok) {
                console.warn(`CoinGecko API Error ${response.status}: ${await response.text()}`);
                return [];
            }

            const data = await response.json();
            const prices = data.prices; // [ [timestamp, price], ... ]
            const volumes = data.total_volumes; // [ [timestamp, volume], ... ]

            if (!prices || !Array.isArray(prices)) {
                console.warn(`CoinGecko returned no price data for ${symbol} (id: ${id})`);
                return [];
            }

            // Map to Candle format (using price for all O/H/L/C since we only have line data)
            return prices.map((p: [number, number], i: number) => ({
                date: new Date(p[0]).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
                time: Math.floor(p[0] / 1000), // Unix timestamp in seconds
                price: p[1],
                open: p[1],
                high: p[1],
                low: p[1],
                close: p[1],
                volume: volumes && volumes[i] ? volumes[i][1] : 0
            }));
        } catch (error) {
            console.error(`CoinGeckoProvider History Error (${symbol}):`, error);
            return [];
        }
    }
}
