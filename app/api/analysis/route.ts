import { NextRequest, NextResponse } from "next/server";
import { AnalysisService } from "@/lib/services/analysisService";
import { RealMarketService, AssetType } from "@/lib/services/realMarketService";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get("symbol");
    const type = searchParams.get("type") as AssetType | undefined;

    const range = searchParams.get("range") || "1M";

    if (!symbol) {
        return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    try {
        // Run full analysis
        const analysis = await AnalysisService.analyze(symbol, type);

        // Also fetch history for charts from RealMarketService
        const history = await RealMarketService.getHistory(symbol, type, range);

        return NextResponse.json({
            ...analysis,
            chartData: history
        });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any).message || "Unknown error";
        return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
}
