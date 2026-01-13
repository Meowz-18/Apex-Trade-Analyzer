"use client";

import { motion } from "framer-motion";
import { MessageSquareText, TrendingUp, Newspaper, Zap } from "lucide-react";

const features = [
    {
        title: "AI Strategy Interpreter",
        description: "Don't just get data, get an explanation. Our integrated LLMs (Groq/Gemini) translate complex technical indicators into plain English logic.",
        icon: MessageSquareText,
        chart: (
            <div className="p-4 bg-black/20 rounded-lg border border-white/5 space-y-2">
                <div className="h-2 w-2/3 bg-white/10 rounded animate-pulse"></div>
                <div className="h-2 w-full bg-white/10 rounded animate-pulse delay-75"></div>
                <div className="h-2 w-5/6 bg-white/10 rounded animate-pulse delay-150"></div>
                <div className="mt-4 p-3 bg-indigo-500/10 rounded border border-indigo-500/20 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <div className="text-xs text-indigo-400 font-mono font-bold tracking-wide">Analysis: BULLISH DIVERGENCE</div>
                </div>
            </div>
        )
    },
    {
        title: "Backtesting Engine",
        description: "Simulate your strategy against historical data. Verify win rates, profit factors, and drawdowns before real execution.",
        icon: TrendingUp,
        chart: (
            <div className="h-32 flex items-end justify-between gap-1 p-4 bg-black/20 rounded-lg border border-white/5">
                {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-emerald-500/80 rounded-t-sm shadow-[0_0_10px_-2px_rgba(16,185,129,0.5)]"></div>
                ))}
            </div>
        )
    },
    {
        title: "News Sentiment Intelligence",
        description: "Scan thousands of headlines instantly. We aggregate sentiment from top financial news sources to gauge market mood.",
        icon: Newspaper,
        chart: (
            <div className="grid grid-cols-2 gap-2 p-4 bg-black/20 rounded-lg border border-white/5">
                <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-center">
                    <div className="text-xl font-bold text-green-500">76%</div>
                    <div className="text-[10px] uppercase text-green-500">Positive</div>
                </div>
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-center">
                    <div className="text-xl font-bold text-red-500">24%</div>
                    <div className="text-[10px] uppercase text-red-500">Negative</div>
                </div>
            </div>
        )
    },
];

export function Features() {
    return (
        <section className="py-24 bg-background overflow-hidden relative">
            {/* Background enhancement */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
                        <Zap className="mr-1 h-3 w-3" />
                        Powerful Capabilities
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Everything you need to trade smarter.
                    </h2>
                </div>

                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={`flex flex-col gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                                }`}
                        >
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted/20 border border-white/5 text-foreground mb-2 shadow-lg backdrop-blur-sm">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="pt-4">
                                    <button className="text-primary font-medium hover:text-primary/80 flex items-center gap-2 mx-auto md:mx-0 transition-all hover:translate-x-1">
                                        Learn more <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 w-full max-w-md">
                                {/* Glassmorphic Card Container - Fixed Contrast */}
                                <div className="relative rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-md p-6 shadow-2xl skew-y-1 hover:skew-y-0 transition-all duration-500 group hover:shadow-primary/20 hover:border-primary/30">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        {feature.chart}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
