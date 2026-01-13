
import { Candle } from "@/lib/services/marketService";

// Removed local Candle interface to use shared one

export interface IndicatorConfig {
    type: "SMA" | "EMA" | "RSI" | "PRICE";
    period?: number;
    value?: number; // For constant comparisons like 'RSI < 30'
}

export interface Rule {
    indicatorA: IndicatorConfig;
    comparator: ">" | "<" | ">=" | "<=" | "CROSS_ABOVE" | "CROSS_BELOW";
    indicatorB: IndicatorConfig;
}

export interface StrategyConfig {
    entryRules: Rule[];
    exitRules: Rule[];
    stopLossPercent?: number;
    takeProfitPercent?: number;
}

export interface Trade {
    entryTime: number;
    exitTime: number;
    entryPrice: number;
    exitPrice: number;
    type: "LONG" | "SHORT";
    pnl: number;
    pnlPercent: number;
    status: "WIN" | "LOSS";
}

export interface BacktestResult {
    totalTrades: number;
    winRate: number;
    totalPnLPercent: number;
    maxDrawdown: number;
    monthlyBreakdown: Record<string, { trades: number; wins: number; pnl: number }>;
    equityCurve: { time: number; equity: number }[];
    trades: Trade[];
}

export class BacktestService {

    // --- Indicator Calculations ---

    static calculateSMA(data: number[], period: number): number[] {
        const sma = new Array(data.length).fill(NaN);
        for (let i = period - 1; i < data.length; i++) {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            sma[i] = sum / period;
        }
        return sma;
    }

    static calculateEMA(data: number[], period: number): number[] {
        const ema = new Array(data.length).fill(NaN);
        const k = 2 / (period + 1);

        // Start with SMA for first value
        // Simple approximation: use first price as seed to avoid waiting period constraints for this demo
        let prevEma = data[0];
        ema[0] = prevEma;

        for (let i = 1; i < data.length; i++) {
            const val = (data[i] * k) + (prevEma * (1 - k));
            ema[i] = val;
            prevEma = val;
        }
        return ema;
    }

    static calculateRSI(data: number[], period: number = 14): number[] {
        const rsi = new Array(data.length).fill(NaN);
        if (data.length <= period) return rsi;

        let gains = 0;
        let losses = 0;

        for (let i = 1; i <= period; i++) {
            const diff = data[i] - data[i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        // Initial RSI
        let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi[period] = 100 - (100 / (1 + rs));

        for (let i = period + 1; i < data.length; i++) {
            const diff = data[i] - data[i - 1];
            const gain = diff > 0 ? diff : 0;
            const loss = diff < 0 ? -diff : 0;

            avgGain = ((avgGain * (period - 1)) + gain) / period;
            avgLoss = ((avgLoss * (period - 1)) + loss) / period;

            rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            rsi[i] = 100 - (100 / (1 + rs));
        }

        return rsi;
    }

    // --- Helper to get value of an indicator at index i ---
    private static getIndicatorValue(config: IndicatorConfig, index: number, derivedData: any, rawData: Candle[]): number {
        if (config.value !== undefined) return config.value; // Constant value like '30' - Check this FIRST
        if (config.type === "PRICE") return rawData[index].close;

        // Retrieve pre-calculated array based on type + period
        const key = `${config.type}_${config.period}`;
        const series = derivedData[key];
        return series ? series[index] : NaN;
    }

    // --- Main Backtest Engine ---
    static runBacktest(candles: Candle[], strategy: StrategyConfig): BacktestResult {
        const closes = candles.map(c => c.close);
        const derivedData: Record<string, number[]> = {};

        // 1. Pre-calculate necessary indicators found in rules
        const allRules = [...strategy.entryRules, ...strategy.exitRules];
        const configs = new Set<string>();

        for (const rule of allRules) {
            [rule.indicatorA, rule.indicatorB].forEach(ind => {
                if (ind.type !== "PRICE" && ind.value === undefined && ind.period) {
                    configs.add(JSON.stringify(ind));
                }
            });
        }

        configs.forEach(json => {
            const cfg = JSON.parse(json) as IndicatorConfig;
            const key = `${cfg.type}_${cfg.period}`;
            if (cfg.type === "SMA") derivedData[key] = this.calculateSMA(closes, cfg.period!);
            if (cfg.type === "EMA") derivedData[key] = this.calculateEMA(closes, cfg.period!);
            if (cfg.type === "RSI") derivedData[key] = this.calculateRSI(closes, cfg.period!);
        });

        const trades: Trade[] = [];
        let activeTrade: Partial<Trade> | null = null;
        let equity = 10000; // Start with $10,000 simulations
        const equityCurve = [{ time: candles[0].time, equity }];

        // 2. Iterate through candles
        // Start loop with buffer for indicators
        const startIdx = 50;

        for (let i = startIdx; i < candles.length; i++) {
            const candle = candles[i];

            // Check Exit Logic if in trade
            if (activeTrade) {
                let shouldExit = false;
                let exitPrice = candle.close;
                let exitReason = "SIGNAL";

                // SL / TP Check (Intrabar simulation)
                if (strategy.stopLossPercent) {
                    const slPrice = activeTrade.entryPrice! * (1 - strategy.stopLossPercent / 100);
                    if (candle.low <= slPrice) { shouldExit = true; exitPrice = slPrice; exitReason = "SL"; }
                }
                if (strategy.takeProfitPercent && !shouldExit) {
                    const tpPrice = activeTrade.entryPrice! * (1 + strategy.takeProfitPercent / 100);
                    if (candle.high >= tpPrice) { shouldExit = true; exitPrice = tpPrice; exitReason = "TP"; }
                }

                // Rule-based Exit
                if (!shouldExit && strategy.exitRules.length > 0) {
                    // Check if ALL exit rules are met (strict) or ANY (loose)? Let's assume ALL for now.
                    const allExitMet = strategy.exitRules.every(rule => this.evaluateRule(rule, i, derivedData, candles));
                    if (allExitMet) { shouldExit = true; }
                }

                if (shouldExit) {
                    const pnlPercent = ((exitPrice - activeTrade.entryPrice!) / activeTrade.entryPrice!) * 100;
                    const pnl = (equity * pnlPercent) / 100; // Compounding roughly
                    equity += pnl;

                    trades.push({
                        entryTime: activeTrade.entryTime!,
                        exitTime: candle.time,
                        entryPrice: activeTrade.entryPrice!,
                        exitPrice,
                        type: "LONG",
                        pnl,
                        pnlPercent,
                        status: pnl > 0 ? "WIN" : "LOSS"
                    });

                    activeTrade = null;
                    equityCurve.push({ time: candle.time, equity });
                    continue; // Trade closed, can't enter same candle
                }
            }

            // Check Entry Logic if NOT in trade
            if (!activeTrade) {
                const allEntryMet = strategy.entryRules.every(rule => this.evaluateRule(rule, i, derivedData, candles));
                if (allEntryMet) {
                    activeTrade = {
                        entryTime: candle.time,
                        entryPrice: candle.close,
                        type: "LONG"
                    };
                }
            }

            // Log equity even if holding
            if (activeTrade) {
                // Mark-to-market equity
                const currentVal = (candle.close - activeTrade.entryPrice!) / activeTrade.entryPrice! * equity;
                equityCurve.push({ time: candle.time, equity: equity + currentVal });
            } else {
                equityCurve.push({ time: candle.time, equity });
            }
        }

        // 3. Aggregate Results
        const winTrades = trades.filter(t => t.status === "WIN");
        const lossTrades = trades.filter(t => t.status === "LOSS");
        const winRate = trades.length > 0 ? (winTrades.length / trades.length) * 100 : 0;
        const totalPnLPercent = ((equity - 10000) / 10000) * 100;

        // Calculate Max Drawdown
        let maxPeak = -Infinity;
        let maxDrawdown = 0;
        for (const pt of equityCurve) {
            if (pt.equity > maxPeak) maxPeak = pt.equity;
            const dd = (maxPeak - pt.equity) / maxPeak * 100;
            if (dd > maxDrawdown) maxDrawdown = dd;
        }

        // Monthly Breakdown
        const monthlyBreakdown: Record<string, { trades: number; wins: number; pnl: number }> = {};
        for (const t of trades) {
            const date = new Date(t.exitTime * 1000); // Expecting unix timestamp seconds needed? Candle time usually ms in JS but lets assume ms
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!monthlyBreakdown[key]) monthlyBreakdown[key] = { trades: 0, wins: 0, pnl: 0 };
            monthlyBreakdown[key].trades++;
            if (t.status === "WIN") monthlyBreakdown[key].wins++;
            monthlyBreakdown[key].pnl += t.pnlPercent;
        }

        return {
            totalTrades: trades.length,
            winRate,
            totalPnLPercent,
            maxDrawdown,
            monthlyBreakdown,
            equityCurve,
            trades
        };
    }

    private static evaluateRule(rule: Rule, index: number, derivedData: any, candles: Candle[]): boolean {
        const valA = this.getIndicatorValue(rule.indicatorA, index, derivedData, candles);
        const valB = this.getIndicatorValue(rule.indicatorB, index, derivedData, candles);

        if (isNaN(valA) || isNaN(valB)) return false;

        switch (rule.comparator) {
            case ">": return valA > valB;
            case "<": return valA < valB;
            case ">=": return valA >= valB;
            case "<=": return valA <= valB;
            case "CROSS_ABOVE": {
                const prevA = this.getIndicatorValue(rule.indicatorA, index - 1, derivedData, candles);
                const prevB = this.getIndicatorValue(rule.indicatorB, index - 1, derivedData, candles);
                return prevA <= prevB && valA > valB;
            }
            case "CROSS_BELOW": {
                const prevA = this.getIndicatorValue(rule.indicatorA, index - 1, derivedData, candles);
                const prevB = this.getIndicatorValue(rule.indicatorB, index - 1, derivedData, candles);
                return prevA >= prevB && valA < valB;
            }
            default: return false;
        }
    }
}
