import { BacktestDashboard } from "@/components/backtest/BacktestDashboard";
import { PreBacktestedStrategies } from "@/components/backtest/PreBacktestedStrategies";
import { RealMarketService } from "@/lib/services/realMarketService";
import { Candle } from "@/lib/services/marketService";

// Helper to convert MarketHistoryItem to our internal Candle format
// RealMarketService.getHistory returns { time: string, price: number }[] usually for line charts
// We might need to fetch OHLC data specifically if getHistory doesn't provide it.
// For this demo, we might need a mocking strategy if RealMarketService doesn't support full OHLC yet.
// Looking at RealMarketService... let's check it first.

// Correction: I'll assume for now we need a robust set of OHLC data. 
// I'll create a mock generator here or check if RealMarketService has OHLC.
// Let's stick to generating realistic mock OHLC data for the "Engine" demo to ensure it works beautifully without API limits.

// function generateMockData(days: number): Candle[] {
//     // ... Removed mock logic ...
//     return [];
// }

export default async function BacktestPage() {
    // Fetch 6 months of BTC data by default
    // We use "CRYPTO" type and "ALL" or "1Y" to get a good chunk of daily history
    // For Backtesting, granularity matters. 
    // If RealMarketService.getHistory("BTC", "CRYPTO", "3M") returns 3 months of hourly (if supported) or daily.
    // CoinGecko "90" days returns hourlyish data.
    const marketData = await RealMarketService.getHistory("BTC", "CRYPTO", "3M");

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col gap-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Strategy Backtester</h1>
                <p className="text-muted-foreground">
                    Design, simulate, and validate trading strategies using historical data.
                    Switch between manual configuration or use our AI assistant to build complex logic.
                </p>
            </div>

            <BacktestDashboard marketData={marketData} />

            <div className="mt-8 border-t border-border/40 pt-12">
                <PreBacktestedStrategies />
            </div>
        </div>
    );
}
