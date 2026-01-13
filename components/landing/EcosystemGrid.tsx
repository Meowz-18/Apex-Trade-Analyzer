"use client";

import { motion } from "framer-motion";
import { Activity, Globe, ShieldCheck, Zap, BarChart3, Users, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export function EcosystemGrid() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                        Institutional-Grade Infrastructure
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Powered by a decentralized mesh of real-time data providers and specialized AI agents.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-[auto_auto] gap-4 h-[800px] md:h-[600px]">

                    {/* Large Card: Global Coverage */}
                    <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-card/50 to-background border border-border/50 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-center" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Global Market Coverage</h3>
                            <p className="text-muted-foreground mb-8">Access real-time data from 50+ exchanges across Crypto, Stocks, and Forex markets with millisecond latency.</p>

                            <div className="mt-auto relative h-48 w-full bg-black/20 rounded-xl overflow-hidden border border-white/5">
                                {/* Simulated stylized map/globe effect using CSS gradients */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[64px] animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-mono text-primary/50 tracking-widest">LIVE DATA FEED ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tall Card: AI Core */}
                    <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                        <div className="bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                            <Server className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Neural Core</h3>
                        <p className="text-sm text-muted-foreground mb-6">Hybrid LLM architecture processing 1M+ tokens per analysis session.</p>
                        <div className="mt-auto space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between text-xs bg-black/20 p-2 rounded-lg border border-white/5">
                                    <span className="text-muted-foreground">Node {i} Status</span>
                                    <span className="text-green-400 font-mono">ONLINE</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Small Card: Security */}
                    <div className="md:col-span-1 lg:col-span-1 bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex flex-col justify-center group hover:bg-card/50 transition-colors">
                        <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
                        <h3 className="text-lg font-bold">Enterprise Security</h3>
                        <p className="text-xs text-muted-foreground mt-2">End-to-end encryption for all user strategies and data.</p>
                    </div>

                    {/* Small Card: Speed */}
                    <div className="md:col-span-1 lg:col-span-1 bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex flex-col justify-center group hover:bg-card/50 transition-colors">
                        <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                        <h3 className="text-lg font-bold">Ultra-Low Latency</h3>
                        <p className="text-xs text-muted-foreground mt-2">&lt;50ms execution time on verified strategies.</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
