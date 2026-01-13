"use client";

import { motion } from "framer-motion";

export function MarketDepthVisualizer() {
    // Simulated Depth Data
    const bids = [45, 60, 30, 80, 50, 20, 90, 40].reverse();
    const asks = [50, 30, 70, 40, 60, 20, 80, 30];

    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden p-6 h-full flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 relative z-10">Market Depth</h3>

            <div className="flex-1 flex gap-1 relative items-center z-10">
                {/* Bids (Green) - Left Side */}
                <div className="flex-1 flex flex-col gap-1 items-end justify-center">
                    {bids.map((val, i) => (
                        <div key={`bid-${i}`} className="w-full flex justify-end group">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: i * 0.1 }}
                                className="h-1.5 rounded-full bg-emerald-500/30 group-hover:bg-emerald-400/60 transition-colors"
                            />
                        </div>
                    ))}
                </div>

                {/* Center Divider / Spread */}
                <div className="w-px h-full bg-white/10 mx-2 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-white/10 px-2 py-0.5 rounded text-[10px] text-muted-foreground font-mono">
                        0.05%
                    </div>
                </div>

                {/* Asks (Red) - Right Side */}
                <div className="flex-1 flex flex-col gap-1 items-start justify-center">
                    {asks.map((val, i) => (
                        <div key={`ask-${i}`} className="w-full flex justify-start group">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: i * 0.1 }}
                                className="h-1.5 rounded-full bg-rose-500/30 group-hover:bg-rose-400/60 transition-colors"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-4 text-[10px] font-mono text-muted-foreground/50">
                <span>BID VOLUME</span>
                <span>ASK VOLUME</span>
            </div>
        </div>
    );
}
