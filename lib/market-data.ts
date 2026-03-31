import { RealMarketService } from "@/lib/services/realMarketService";

export interface TickerData {
    price: number;
    change: number;
    prevPrice: number;
}

export async function getMarketData(): Promise<Record<string, TickerData>> {
    const symbols = [
        "BTC", "ETH", "SOL", "XRP", // Crypto
        "NVDA", "AAPL", "TSLA", "MSFT", // Stocks
        "GC=F", "EURUSD=X" // Commodities/Forex (Yahoo notation)
    ];

    const results: Record<string, TickerData> = {};

    try {
        const promises = symbols.map(async (sym) => {
            try {
                let quote = await RealMarketService.getQuote(sym);
                
                // Fallback to mock data if rate-limited or failed
                if (!quote) {
                    const mockPrice = Math.random() * 1000 + 50; 
                    const mockChange = (Math.random() - 0.5) * 5;
                    quote = {
                        symbol: sym,
                        price: mockPrice,
                        change: mockPrice * (mockChange / 100),
                        changePercent: mockChange,
                        timestamp: Date.now()
                    };
                }

                if (quote) {
                    // Map RealMarketService quote to TickerData
                    const price = quote.price;
                    const change = quote.changePercent || 0;
                    // prevPrice is price / (1 + change/100)
                    const prevPrice = price / (1 + change / 100);

                    // Normalize key
                    let key = sym;
                    if (sym === "GC=F") key = "GOLD";
                    if (sym === "EURUSD=X") key = "EUR/USD";

                    results[key] = { price, change, prevPrice };
                }
            } catch (e) {
                console.warn(`Failed to fetch data for ${sym}`, e);
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error("Error fetching market data", error);
    }

    return results;
}
