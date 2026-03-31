"use client";

import { StatCard } from "@/components/analyzer/StatCard";
// import { SignalCard } from "@/components/analyzer/SignalCard"; // Deprecated for dual-model
import { ModelComparison } from "@/components/analyzer/ModelComparison";
import { NewsFeed } from "@/components/analyzer/NewsFeed";
import { PriceChart } from "@/components/analyzer/PriceChart";
// import { OrderEntryPanel } from "@/components/analyzer/OrderEntryPanel"; // Removed per user request
import { MarketDepthVisualizer } from "@/components/analyzer/MarketDepthVisualizer"; // Kept import but unused in JSX for now, or can remove if desired.
import { TokenStatsRail } from "@/components/analyzer/TokenStatsRail";
import { DollarSign, Activity, PieChart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
    title: string;
    sentiment: "Positive" | "Negative" | "Neutral";
    source: string;
}

interface ChartData {
    date: string;
    price: number;
}

interface SingleModelResult {
    modelName: string;
    signal: "BUY" | "SELL" | "HOLD";
    confidence: string;
    reasoning: string;
}

interface MarketData {
    symbol: string;
    price: number;
    change: number;
    marketCap: string;
    peRatio: string;
    revenue: string;
    // New Multi-Model Data
    modelA: SingleModelResult;
    modelB: SingleModelResult;
    news: NewsItem[];
    chartData: ChartData[];
    // Currency
    currency?: "USD" | "INR";
    // UI State for Timeframe
    activeTimeframe: string;
    onTimeframeChange: (tf: string) => void;
}

interface AnalyzerDashboardProps {
    data: MarketData;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function AnalyzerDashboard({ data }: AnalyzerDashboardProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
            {/* Top Stats Row (Bento Style) */}
            <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div variants={item}><StatCard title="Current Price" value={`${data.currency === "INR" ? "₹" : "$"}${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} subValue={`${data.change > 0 ? '+' : ''}${data.change.toFixed(3)}%`} trend={data.change > 0 ? "up" : "down"} icon={DollarSign} /></motion.div>
                <motion.div variants={item}><StatCard title="Market Cap" value={data.marketCap} icon={PieChart} /></motion.div>
                <motion.div variants={item}><StatCard title="P/E Ratio" value={data.peRatio} icon={Activity} /></motion.div>
                <motion.div variants={item}><StatCard title="Revenue" value={data.revenue} icon={TrendingUp} /></motion.div>
            </div>

            {/* Main Grid: 12 Columns */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Column: Chart & AI (9 cols) */}
                <div className="lg:col-span-9 grid grid-cols-1 gap-6">

                    {/* Top: Price Chart Area - Full Width */}
                    <motion.div variants={item} className="h-[600px] w-full">
                        <PriceChart
                            data={data.chartData}
                            symbol={data.symbol}
                            onTimeframeChange={data.onTimeframeChange}
                            activeTimeframe={data.activeTimeframe}
                        />
                    </motion.div>

                    {/* Bottom Row: AI Models */}
                    <motion.div variants={item} className="h-[400px]">
                        <ModelComparison modelA={data.modelA} modelB={data.modelB} symbol={data.symbol} currentPrice={data.price} />
                    </motion.div>
                </div>

                {/* Right Column: Stats Rail & News (Sticky) */}
                <motion.div variants={item} className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24 h-full max-h-[1100px]">

                    {/* Token Stats Rail - Moved here */}
                    <div className="h-[400px]">
                        <TokenStatsRail />
                    </div>

                    {/* News Feed - Below Stats */}
                    <div className="flex-1 min-h-[500px] overflow-hidden rounded-3xl border border-white/5 bg-black/20">
                        <NewsFeed news={data.news} />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
