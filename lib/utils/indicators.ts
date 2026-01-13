import { Candle } from "@/lib/services/marketService";

/**
 * Calculate Average True Range (ATR)
 * Standard measure of volatility.
 * @param candles Array of candles (must be at least period + 1 length for accurate calc)
 * @param period Default 14
 */
export const calculateATR = (candles: Candle[], period: number = 14): number => {
    if (!candles || candles.length < period) return 0;

    // Calculate True Range (TR) for each candle
    // TR = Max(High-Low, |High-PrevClose|, |Low-PrevClose|)
    const trs: number[] = [];

    for (let i = 0; i < candles.length; i++) {
        const current = candles[i];
        const prev = i > 0 ? candles[i - 1] : null;

        if (!current) continue;

        // Fallback to 'price' if OHLC is missing (e.g. from mock data)
        const high = current.high ?? current.price;
        const low = current.low ?? current.price;

        let tr = high - low;
        if (prev) {
            const prevClose = prev.close ?? prev.price;
            tr = Math.max(
                tr,
                Math.abs(high - prevClose),
                Math.abs(low - prevClose)
            );
        }
        trs.push(tr);
    }

    // Wilder's Smoothing for ATR
    // First value is simple average of first 'period' TRs
    let atr = trs.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period;

    // Remaining values: ATR = (Prior ATR * (period - 1) + Current TR) / period
    for (let i = period; i < trs.length; i++) {
        atr = (atr * (period - 1) + trs[i]) / period;
    }

    // Normalize ATR as a percentage of price if needed? 
    // The user formula used raw ATR in the snippet, but for confidence score across different assets (stocks vs crypto),
    // raw dollar ATR is inconsistent. 
    // Example: BTC ATR maybe $1000, Stock ATR maybe $2.
    // We should return ATR Percentage relative to current price to make it normalized (0-100 scale friendly).
    const lastCandle = candles[candles.length - 1];
    const currentPrice = lastCandle ? (lastCandle.close ?? lastCandle.price) : 0;

    if (currentPrice === 0) return 0;

    const atrPercentage = (atr / currentPrice) * 100;

    return parseFloat(atrPercentage.toFixed(4));
};
