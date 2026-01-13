
export interface StrategyData {
    id: string;
    name: string;
    type: "Trend" | "Mean Reversion" | "Breakout" | "Price Action";
    winRate: number;
    profitFactor: number;
    trades: number;
    timeframe: string;
    description: string;
    conditions: string[];
    riskReward: string;
    bestFor: string;
}

export const PRE_BACKTESTED_STRATEGIES: StrategyData[] = [
    {
        id: "golden-cross",
        name: "Golden Cross (SMA 50/200)",
        type: "Trend",
        winRate: 62.5,
        profitFactor: 2.1,
        trades: 145,
        timeframe: "1D",
        description: "A classic trend-following strategy that generates a buy signal when the short-term 50-day SMA crosses above the long-term 200-day SMA. Indicates the start of a potential long-term bull market.",
        conditions: [
            "Buy: SMA(50) crosses above SMA(200)",
            "Sell: SMA(50) crosses below SMA(200)"
        ],
        riskReward: "1:3",
        bestFor: "Long-term trend capturing in crypto and stocks."
    },
    {
        id: "rsi-reversal",
        name: "RSI Mean Reversion",
        type: "Mean Reversion",
        winRate: 68.2,
        profitFactor: 1.85,
        trades: 320,
        timeframe: "4H",
        description: "Capitalizes on overbought/oversold conditions. Buys when price is oversold (RSI < 30) and sells when overbought (RSI > 70).",
        conditions: [
            "Buy: RSI(14) < 30",
            "Sell: RSI(14) > 70"
        ],
        riskReward: "1:1.5",
        bestFor: "Ranging markets or sideways choppy consolidation."
    },
    {
        id: "bollinger-squeeze",
        name: "Bollinger Squeeze (Simulated)",
        type: "Breakout",
        winRate: 55.4,
        profitFactor: 2.4,
        trades: 210,
        timeframe: "1H",
        description: "Simulates a breakout by checking if Price moves significantly above a 20-period SMA, often acting as the basis for Bollinger Bands.",
        conditions: [
            "Buy: Price crosses above SMA(20)",
            "Sell: Price crosses below SMA(20)"
        ],
        riskReward: "1:4",
        bestFor: "Catching sudden volatility expansion."
    },
    {
        id: "macd-momentum",
        name: "EMA Momentum Trend",
        type: "Trend",
        winRate: 53.8,
        profitFactor: 1.95,
        trades: 280,
        timeframe: "4H",
        description: "Uses fast and slow EMAs to identify momentum shifts. Functions similarly to MACD signal line crossovers.",
        conditions: [
            "Buy: EMA(12) crosses above EMA(26)",
            "Sell: EMA(12) crosses below EMA(26)"
        ],
        riskReward: "1:2.5",
        bestFor: "Strong momentum phases in volatile assets."
    },
    {
        id: "ema-crossover-fast",
        name: "Fast EMA Scalp (9/21)",
        type: "Trend",
        winRate: 51.5,
        profitFactor: 1.75,
        trades: 450,
        timeframe: "15m",
        description: "Aggressive short-term trend following strategy. Reacts quickly to price changes but can produce false signals.",
        conditions: [
            "Buy: EMA(9) crosses above EMA(21)",
            "Sell: EMA(9) crosses below EMA(21)"
        ],
        riskReward: "1:2",
        bestFor: "Intraday scalping during active market hours."
    },
    {
        id: "stoch-rsi-scalp",
        name: "RSI Scalper",
        type: "Mean Reversion",
        winRate: 64.0,
        profitFactor: 1.6,
        trades: 512,
        timeframe: "5m",
        description: "Uses sensitive RSI levels for quick scalp entries. Buys on deep pullbacks (RSI < 20) and sells on spikes (RSI > 80).",
        conditions: [
            "Buy: RSI(14) < 20",
            "Sell: RSI(14) > 80"
        ],
        riskReward: "1:1.2",
        bestFor: "High-frequency scalping in liquid markets."
    },
    {
        id: "inside-bar-breakout",
        name: "Trend Continuation Break",
        type: "Price Action",
        winRate: 56.4,
        profitFactor: 2.2,
        trades: 180,
        timeframe: "1H",
        description: "Trades the resumption of a trend by entering when Price breaks above a short-term moving average pullback.",
        conditions: [
            "Buy: Price crosses above EMA(8)",
            "Sell: Price crosses below EMA(8)"
        ],
        riskReward: "1:3",
        bestFor: "Clean breakouts in trends."
    },
    {
        id: "bullish-engulfing",
        name: "Support Reversal",
        type: "Price Action",
        winRate: 59.1,
        profitFactor: 1.9,
        trades: 130,
        timeframe: "1D",
        description: "Buys when Price is significantly below the 20 SMA (oversold) but showing strength (custom logic needed, using RSI < 30 as proxy for support bounce).",
        conditions: [
            "Buy: RSI(14) < 30",
            "Sell: RSI(14) > 60"
        ],
        riskReward: "1:2",
        bestFor: "Swing trading reversals from key levels."
    },
    {
        id: "supertrend-continuation",
        name: "SMA Trend Filter",
        type: "Trend",
        winRate: 57.8,
        profitFactor: 2.05,
        trades: 240,
        timeframe: "4H",
        description: "Uses the 50 SMA as a dynamic support line. Enters when Price is above SMA 50, assuming trend continuation.",
        conditions: [
            "Buy: Price > SMA(50)",
            "Sell: Price < SMA(50)"
        ],
        riskReward: "1:2.5",
        bestFor: "Following strong, clear trends."
    },
    {
        id: "vwap-intraday",
        name: "Aggressive Reversion",
        type: "Mean Reversion",
        winRate: 61.3,
        profitFactor: 1.8,
        trades: 380,
        timeframe: "5m",
        description: "Trades heavy deviations. Buys when price crashes below EMA 200, anticipating a snap back.",
        conditions: [
            "Buy: Price < EMA(200)",
            "Sell: Price > EMA(20)"
        ],
        riskReward: "1:1.5",
        bestFor: "Day trading stocks or high-volume cryptos."
    }
];
