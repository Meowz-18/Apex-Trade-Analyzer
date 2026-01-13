"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Info } from "lucide-react";

export function OrderEntryPanel({ symbol, price }: { symbol: string; price: number }) {
    const [leverage, setLeverage] = useState(20);
    const [orderType, setOrderType] = useState<"Market" | "Limit">("Market");
    const [side, setSide] = useState<"Long" | "Short">("Long");
    const [amount, setAmount] = useState(1000);

    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
                <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-white/5">
                    {["Market", "Limit"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setOrderType(type as "Market" | "Limit")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${orderType === type
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-muted-foreground hover:text-white"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <button className="text-muted-foreground hover:text-white transition-colors">
                    <Settings2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 space-y-6 flex-1">
                {/* Leverage Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Leverage</span>
                        <span className="text-yellow-400 font-mono font-bold">{leverage}x</span>
                    </div>
                    <div className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group">
                        <div
                            className="absolute left-0 top-0 h-full bg-yellow-500 rounded-full group-hover:bg-yellow-400 transition-colors"
                            style={{ width: `${leverage}%` }}
                        />
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={leverage}
                            onChange={(e) => setLeverage(Number(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border border-black"
                            style={{ left: `${leverage}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono">
                        <span>1x</span>
                        <span>50x</span>
                        <span>100x</span>
                    </div>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Entry Price (USD)</label>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex justify-between items-center">
                        <span className="font-mono text-white tracking-widest text-lg">
                            {orderType === "Market" ? price.toLocaleString() : "0.00"}
                        </span>
                        <span className="text-xs text-muted-foreground">USD</span>
                    </div>
                </div>

                {/* Size Input */}
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Amount (USD)</label>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex justify-between items-center group focus-within:border-primary/50 transition-colors">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-transparent border-none text-white font-mono text-lg w-full focus:outline-none placeholder:text-muted-foreground/30"
                            placeholder="1000"
                        />
                        <span className="text-xs text-muted-foreground">USD</span>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 py-2 border-t border-dashed border-white/10">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Cost</span>
                        <span className="text-white font-mono">${(amount / leverage).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">Liquidation <Info className="w-3 h-3" /></span>
                        <span className="text-orange-400 font-mono">
                            {/* Simple Liquidation Calc: Entry +/- (Entry * (1/Leverage)) */}
                            ${(side === "Long"
                                ? price * (1 - (1 / leverage))
                                : price * (1 + (1 / leverage))
                            ).toFixed(2)}
                        </span>
                    </div>
                </div>

            </div>

            {/* Action Buttons */}
            <div className="p-4 grid grid-cols-2 gap-3 mt-auto">
                <button
                    onClick={() => setSide("Long")}
                    className="relative overflow-hidden group bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 hover:border-emerald-400 text-emerald-500 hover:text-black py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)]"
                >
                    <div className="font-bold text-lg">Buy / Long</div>
                    <div className="text-[10px] opacity-70 font-mono tracking-widest opacity-60 group-hover:text-black/70">ENTER BULLISH</div>
                </button>
                <button
                    onClick={() => setSide("Short")}
                    className="relative overflow-hidden group bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:border-rose-400 text-rose-500 hover:text-black py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(244,63,94,0.1)] hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.6)]"
                >
                    <div className="font-bold text-lg">Sell / Short</div>
                    <div className="text-[10px] opacity-70 font-mono tracking-widest opacity-60 group-hover:text-black/70">ENTER BEARISH</div>
                </button>
            </div>
        </div>
    );
}
