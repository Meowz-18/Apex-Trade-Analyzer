"use client";

import { motion } from "framer-motion";
import { Database, BrainCircuit, LineChart, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: 1,
        title: "Data Aggregation",
        description: "We ingest millions of data points per second from global exchanges, dark pools, and social sentiment sources.",
        icon: Database,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        id: 2,
        title: "Neural Processing",
        description: "Our Llama 3-70B fine-tuned models process unstructured data including news, earnings calls, and regulatory filings.",
        icon: BrainCircuit,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        id: 3,
        title: "Quantitative Analysis",
        description: "Traditional technical indicators (RSI, MACD, Bollinger Bands) are calculated and cross-referenced with AI insights.",
        icon: LineChart,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        id: 4,
        title: "Signal Generation",
        description: "A final confidence score is generated. Only high-probability setups trigger a Buy or Sell signal.",
        icon: ShieldCheck,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        id: 5,
        title: "Real-time Execution",
        description: "Signals are delivered instantly via the dashboard with reasoning and risk management parameters.",
        icon: Zap,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 py-24 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground"
                    >
                        The Intelligence Engine
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        From raw chaos to actionable clarity. See how Antigravity processes market data in milliseconds.
                    </motion.p>
                </div>

                {/* Steps Timeline */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent transform md:-translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={cn(
                                    "relative flex flex-col md:flex-row gap-8 items-start md:items-center",
                                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                                )}
                            >
                                {/* Icon Bubble */}
                                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full border border-border bg-background z-10 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)]">
                                    <step.icon className={cn("w-6 h-6", step.color)} />
                                </div>

                                {/* Content Card */}
                                <div className={cn(
                                    "ml-16 md:ml-0 md:w-[calc(50%-40px)] p-8 rounded-2xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group",
                                    step.border
                                )}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={cn("text-xs font-mono px-2 py-1 rounded border bg-background/50", step.color, step.border)}>
                                            Step 0{step.id}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                                <div className="hidden md:block md:w-[calc(50%-40px)]" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 text-center"
                >
                    <div className="inline-flex flex-col items-center gap-6 p-12 rounded-3xl border border-border bg-gradient-to-b from-card/50 to-background relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none" />
                        <h2 className="text-3xl font-bold text-foreground relative z-10">Ready to see it in action?</h2>
                        <Link href="/analyzer">
                            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer relative z-10">
                                Launch Analyzer <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
