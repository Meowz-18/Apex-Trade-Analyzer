"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    Activity,
    BarChart2,
    Zap,
    Clock,
    Target,
    ChevronRight,
    Check,
    Play
} from "lucide-react";
import { PRE_BACKTESTED_STRATEGIES, StrategyData } from "@/lib/data/strategies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PreBacktestedStrategies() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <section className="py-12 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Verified Strategies
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        A curated collection of high-performance strategies verified with historical data.
                        Load any strategy to inspect details or run your own simulations.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1 h-auto text-sm border-primary/20 bg-primary/5 text-primary">
                        <Check className="w-3 h-3 mr-1" /> All Verified
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 h-auto text-sm border-green-500/20 bg-green-500/5 text-green-500">
                        <TrendingUp className="w-3 h-3 mr-1" /> &gt; 50% Win Rate
                    </Badge>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRE_BACKTESTED_STRATEGIES.map((strategy, index) => (
                    <StrategyCard
                        key={strategy.id}
                        strategy={strategy}
                        index={index}
                        isExpanded={selectedId === strategy.id}
                        onToggle={() => setSelectedId(selectedId === strategy.id ? null : strategy.id)}
                    />
                ))}
            </div>
        </section>
    );
}

function StrategyCard({
    strategy,
    index,
    isExpanded,
    onToggle
}: {
    strategy: StrategyData;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                layout: { duration: 0.4, type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }}
            viewport={{ once: true }}
            layout
            onClick={onToggle}
            className={`
                group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm 
                hover:border-primary/50 transition-colors duration-500 cursor-pointer
                ${isExpanded ? 'lg:col-span-2 row-span-2 bg-card/80 border-primary/30 z-20 shadow-2xl shadow-primary/10' : 'hover:shadow-lg hover:shadow-primary/5'}
            `}
        >
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 relative z-10 flex flex-col h-full">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`
                            p-3 rounded-xl transition-all duration-300
                            ${strategy.winRate > 60 ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}
                            group-hover:scale-110
                        `}>
                            {strategy.type === "Trend" && <TrendingUp className="w-6 h-6" />}
                            {strategy.type === "Mean Reversion" && <Activity className="w-6 h-6" />}
                            {strategy.type === "Breakout" && <Zap className="w-6 h-6" />}
                            {strategy.type === "Price Action" && <BarChart2 className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg leading-none mb-1 group-hover:text-primary transition-colors">
                                {strategy.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{strategy.type}</Badge>
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {strategy.timeframe}</span>
                            </div>
                        </div>
                    </div>

                    {/* Win Rate Badge */}
                    <div className="text-right">
                        <div className={`text-xl font-bold ${strategy.winRate > 60 ? 'text-green-400' : 'text-foreground'}`}>
                            {strategy.winRate}%
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Win Rate</div>
                    </div>
                </div>

                {/* Info Grid - Always Visible */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background/40 rounded-lg p-3 border border-border/30">
                        <div className="text-muted-foreground text-xs mb-1">Profit Factor</div>
                        <div className="font-mono font-semibold text-foreground">{strategy.profitFactor}</div>
                    </div>
                    <div className="bg-background/40 rounded-lg p-3 border border-border/30">
                        <div className="text-muted-foreground text-xs mb-1">Trades</div>
                        <div className="font-mono font-semibold text-foreground">{strategy.trades}</div>
                    </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                hidden: { opacity: 0, height: 0 },
                                visible: {
                                    opacity: 1,
                                    height: "auto",
                                    transition: {
                                        height: { duration: 0.3, ease: "easeOut" },
                                        staggerChildren: 0.1,
                                        delayChildren: 0.1
                                    }
                                }
                            }}
                            className="bg-transparent"
                        >
                            <div className="border-t border-border/40 pt-4 mt-2 space-y-4">
                                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center text-primary/80">
                                        <Activity className="w-4 h-4 mr-2" /> Strategy Logic
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {strategy.description}
                                    </p>
                                </motion.div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <motion.div
                                        variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                                        className="bg-muted/20 p-4 rounded-xl border border-border/30"
                                    >
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Entry Conditions</h4>
                                        <ul className="space-y-2">
                                            {strategy.conditions.map((cond, i) => (
                                                <li key={i} className="text-sm flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                    {cond}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                    <div className="space-y-4">
                                        <motion.div
                                            variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }}
                                            className="bg-muted/20 p-4 rounded-xl border border-border/30"
                                        >
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Metrics</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Risk/Reward</span>
                                                    <span className="font-mono">{strategy.riskReward}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Best Market</span>
                                                    <span className="font-medium text-right">{strategy.bestFor}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.div
                                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                    className="pt-2 flex justify-end"
                                >
                                    <Button
                                        size="sm"
                                        className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            // Dispatch event or update URL - let's use URL for simplicity if Dashboard watches it, 
                                            // OR assuming Dashboard is parent/sibling, we need a way to communicate.
                                            // Since we can't easily pass props down from server page without client wrapper, 
                                            // let's use URL query param method which is robust for Next.js 14+
                                            const url = new URL(window.location.href);
                                            url.searchParams.set("strategy", strategy.id);
                                            window.history.pushState({}, "", url);
                                            // Trigger a custom event for immediate client-side reaction
                                            window.dispatchEvent(new Event("strategy-selected"));
                                        }}
                                    >
                                        <Play className="w-4 h-4 mr-2" /> Load This Strategy
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapsed Footer - "View More" */}
                {!isExpanded && (
                    <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        <span>Tap to reveal details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
