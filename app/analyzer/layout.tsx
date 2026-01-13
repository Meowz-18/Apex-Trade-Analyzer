import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Market Analyzer | Antigravity",
    description: "Real-time AI analysis of stock and crypto markets. Get buy/sell signals, sentiment analysis, and technical indicators for free.",
};

export default function AnalyzerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
