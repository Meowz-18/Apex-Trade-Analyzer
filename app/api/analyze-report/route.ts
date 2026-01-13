import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime for file handling
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // In a real generic app, we would parse the PDF here using 'pdf-parse'.
        // const buffer = Buffer.from(await file.arrayBuffer());
        // const data = await pdf(buffer);
        // const text = data.text;

        // HOWEVER, for this demo/simulation of "Vertex AI + Gemini 3", 
        // we will generate high-fidelity simulated data based on the file name context if possible,
        // or just return a generic robust financial analysis.

        // Simulating processing delay
        await new Promise((resolve) => setTimeout(resolve, 2500));

        const fileName = file.name.toLowerCase();
        let company = "TechCorp Inc.";
        if (fileName.includes("nvda") || fileName.includes("nvidia")) company = "NVIDIA Corp";
        if (fileName.includes("tsla") || fileName.includes("tesla")) company = "Tesla Inc";
        if (fileName.includes("aapl") || fileName.includes("apple")) company = "Apple Inc";
        if (fileName.includes("msft") || fileName.includes("microsoft")) company = "Microsoft Corp";

        // Simulated AI Response Data
        // This mirrors what Gemini would extract from a PDF earnings report
        const simulatedResult = {
            company: company,
            sentiment: Math.random() > 0.4 ? "Bullish" : "Neutral", // Bias towards bullish for tech
            summary: `Based on the Q3 earnings report for ${company}, the company has exceeded analyst expectations on both top and bottom lines. Key drivers include accelerated data center revenue and improved operating margins. Management provided raised guidance for Q4, citing strong demand visibility.`,
            metrics: [
                { period: "Q4 2024", revenue: 18.4, netIncome: 6.2, guidance: "Maintain" },
                { period: "Q1 2025", revenue: 20.1, netIncome: 7.8, guidance: "Raise" },
                { period: "Q2 2025", revenue: 22.5, netIncome: 9.1, guidance: "Raise" },
                { period: "Q3 2025", revenue: 24.8, netIncome: 10.4, guidance: "Raise" },
            ],
            keyRisks: [
                "Supply chain constraints for next-gen semiconductor components.",
                "Regulatory scrutiny regarding AI safety and antitrust concerns.",
                "Macroeconomic headwinds potentially affecting consumer hardware spend."
            ],
            opportunities: [
                "Expansion of AI cloud services to enterprise customers.",
                "New partnership announcements expected in Q4.",
                "Operational efficiency improvements driving margin expansion."
            ]
        };

        return NextResponse.json(simulatedResult);

    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
