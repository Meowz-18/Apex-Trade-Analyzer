import { NextRequest, NextResponse } from "next/server";
import { RealMarketService } from "@/lib/services/realMarketService";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");

    if (!symbol) {
        return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    try {
        const quote = await RealMarketService.getQuote(symbol);
        return NextResponse.json(quote);
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any).message || "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
}
