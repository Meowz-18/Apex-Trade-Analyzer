// lib/services/marketService.ts

// Simulated "Base" data to ensure consistency
const MARKET_BASE: Record<string, { basePrice: number, volatility: number, name: string }> = {
    "NVDA": { basePrice: 925.00, volatility: 0.02, name: "NVIDIA Corp" },
    "BTC": { basePrice: 98500.00, volatility: 0.05, name: "Bitcoin" },
    "TSLA": { basePrice: 175.50, volatility: 0.03, name: "Tesla Inc" },
    "AAPL": { basePrice: 173.00, volatility: 0.015, name: "Apple Inc" },
    "ETH": { basePrice: 3500.00, volatility: 0.045, name: "Ethereum" },
    "SPY": { basePrice: 510.00, volatility: 0.01, name: "S&P 500 ETF" },
};

export interface MarketQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    timestamp: number;
}

export interface Candle {
    date: string;
    time: number; // Unix timestamp in seconds (for backtesting logic)
    price: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export class MarketService {
    /**
     * Generates a "Live" quote based on simulated GBM (Geometric Brownian Motion)
     * To make it deterministic-ish but "alive", we use time buckets.
     */
    static getQuote(symbol: string): MarketQuote {
        let asset = MARKET_BASE[symbol.toUpperCase()];
        if (!asset) {
            // Generate generic fallback data if symbol not found
            // derive a "stable" but random-looking price from the symbol string hash
            const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const basePrice = (hash % 1000) + 50; // Random price between 50 and 1050
            asset = { basePrice, volatility: 0.03, name: symbol };
        }

        // Simulate price drift based on time (so it changes every second)
        const timeFactor = Date.now() / 10000; // slowly moving trend
        const noise = (Math.sin(timeFactor) + Math.cos(timeFactor * 2.5)) * asset.volatility * 10;

        // Fast noise for "jitters"
        const jitter = (Math.random() - 0.5) * asset.volatility * 5;

        const currentPrice = asset.basePrice + noise + jitter;
        const change = currentPrice - asset.basePrice;
        const changePercent = (change / asset.basePrice) * 100;

        return {
            symbol: symbol.toUpperCase(),
            price: Number(currentPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            timestamp: Date.now()
        };
    }

    /**
     * Generates historical chart data ending at the current price
     */
    static getHistory(symbol: string, days: number = 30): Candle[] {
        let asset = MARKET_BASE[symbol.toUpperCase()];
        if (!asset) {
            const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const basePrice = (hash % 1000) + 50;
            asset = { basePrice, volatility: 0.03, name: symbol };
        }

        const history: Candle[] = [];
        const now = new Date();
        // Start from 30 days ago
        let currentPrice = asset.basePrice * 0.95; // Start slightly lower to show trend usually

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Random walk step
            const drift = (Math.random() - 0.45) * asset.volatility * asset.basePrice; // Slight upward bias
            currentPrice += drift;

            history.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                time: Math.floor(date.getTime() / 1000), // Unix timestamp in seconds
                price: Number(currentPrice.toFixed(2)),
                open: Number(currentPrice.toFixed(2)),
                high: Number((currentPrice * 1.01).toFixed(2)),
                low: Number((currentPrice * 0.99).toFixed(2)),
                close: Number(currentPrice.toFixed(2)),
                volume: Math.floor(Math.random() * 10000)
            });
        }

        return history;
    }
}
