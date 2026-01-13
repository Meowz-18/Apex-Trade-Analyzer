import { NextRequest, NextResponse } from "next/server";
import { RealMarketService } from "@/lib/services/realMarketService";
import { AssetType } from "@/lib/services/realMarketService";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");
    const type = searchParams.get("type") as AssetType | undefined;
    const range = searchParams.get("range") || "3M"; // Default to 3 months for backtesting

    console.log(`[API History] Request: ${symbol} (${type}) Range: ${range}`);

    if (!symbol) {
        return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    try {
        const history = await RealMarketService.getHistory(symbol, type, range);
        return NextResponse.json(history);
    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json({ error: "Failed to fetch market history" }, { status: 500 });
    }
}
