"use client";

import { motion } from "framer-motion";
import { Zap, Activity, BarChart2, Globe } from "lucide-react";

export function TokenStatsRail() {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-full gap-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Volatility Index */}
            <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <Activity className="w-3 h-3 text-purple-400" /> Volatility Idx
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-mono font-bold text-white">42.8</span>
                    <span className="text-[10px] text-purple-400 mb-1">HIGH</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-rose-500 w-[75%]" />
                </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* 24h Volume */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <BarChart2 className="w-3 h-3 text-cyan-400" /> 24h Volume
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-mono font-bold text-white">$2.4B</span>
                    <span className="text-[10px] text-emerald-400 mb-1">+5.2%</span>
                </div>
                {/* Mini Sparkline Simulation */}
                <div className="flex gap-0.5 items-end h-4 opacity-50">
                    {[4, 7, 3, 8, 5, 9, 6, 4, 8, 10].map((h, i) => (
                        <div key={i} style={{ height: `${h * 10}%` }} className="flex-1 bg-cyan-500/50 rounded-t-sm" />
                    ))}
                </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Global Dominance */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <Globe className="w-3 h-3 text-indigo-400" /> Dominance
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-mono font-bold text-white">52.1%</span>
                </div>
                <div className="flex gap-1 h-1.5">
                    <div className="w-[52%] bg-indigo-500 rounded-full" />
                    <div className="flex-1 bg-white/10 rounded-full" />
                </div>
            </div>

        </div>
    );
}
