import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Yahoo Finance Search API
        // quotesQueryId=tss_match_phrase_query helps filter for better matches
        const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;

        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!res.ok) {
            throw new Error(`Yahoo Search API error: ${res.statusText}`);
        }

        const data = await res.json();

        // Transform results for frontend
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results = (data.quotes || []).map((q: any) => ({
            symbol: q.symbol,
            name: q.shortname || q.longname || q.symbol,
            type: q.quoteType, // 'EQUITY', 'CRYPTOCURRENCY', 'ETF', 'INDEX', etc.
            exch: q.exchDisp || q.exchange
        }));

        return NextResponse.json({ results });

    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
    }
}
