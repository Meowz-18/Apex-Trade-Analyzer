import { NextResponse } from "next/server";

export async function GET() {
    const targetSymbols = [
        "BTCUSDT", "ETHUSDT", "SOLUSDT",
        "DOGEUSDT", "PEPEUSDT", "BNBUSDT",
        "XRPUSDT", "ADAUSDT"
    ];

    // ... existing code ...

    interface BinanceTicker {
        symbol: string;
        lastPrice: string;
        priceChangePercent: string;
        prevClosePrice: string;
    }

    // 1. Try Binance First (Real-time, accurate)
    try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr", {
            next: { revalidate: 10 },
            signal: AbortSignal.timeout(3000) // 3s timeout
        });

        if (response.ok) {
            const data = await response.json();
            const filteredData: Record<string, { price: number; change: number; prevPrice: number }> = {};

            if (Array.isArray(data)) {
                data.forEach((item: BinanceTicker) => {
                    if (targetSymbols.includes(item.symbol)) {
                        filteredData[item.symbol] = {
                            price: parseFloat(item.lastPrice),
                            change: parseFloat(item.priceChangePercent),
                            prevPrice: parseFloat(item.prevClosePrice)
                        };
                    }
                });
            }
            return NextResponse.json(filteredData);
        }
    } catch (error) {
        console.warn("Binance API failed, falling back to CoinGecko", error);
    }

    // 2. Fallback to CoinGecko (If Binance updates are blocked/failing)
    try {
        const cgIds = "bitcoin,ethereum,solana,dogecoin,pepe,binancecoin,ripple,cardano";
        const cgResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`, {
            next: { revalidate: 30 }
        });

        if (cgResponse.ok) {
            const data = await cgResponse.json();
            // Map CoinGecko keys back to our Symbols
            const mapping: Record<string, string> = {
                "bitcoin": "BTCUSDT",
                "ethereum": "ETHUSDT",
                "solana": "SOLUSDT",
                "dogecoin": "DOGEUSDT",
                "pepe": "PEPEUSDT",
                "binancecoin": "BNBUSDT",
                "ripple": "XRPUSDT",
                "cardano": "ADAUSDT"
            };

            interface CoinGeckoPrice {
                usd: number;
                usd_24h_change: number;
            }

            const mappedData: Record<string, { price: number; change: number; prevPrice: number }> = {};
            Object.entries(data).forEach(([key, value]) => {
                const symbol = mapping[key];
                const priceData = value as CoinGeckoPrice;
                if (symbol) {
                    mappedData[symbol] = {
                        price: priceData.usd,
                        change: priceData.usd_24h_change,
                        prevPrice: priceData.usd // Approximate since we don't have prev close easily, but acceptable for fallback
                    };
                }
            });
            return NextResponse.json(mappedData);
        }
    } catch (error) {
        console.error("CoinGecko API also failed", error);
    }

    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
}
