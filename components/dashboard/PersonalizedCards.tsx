"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, DollarSign, Sparkles } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import CountUp from "@/components/ui/CountUp";
import { getMarketData, TickerData } from "@/lib/market-data";

interface PersonalizedCardsProps {
    preferredMarkets: string[]; // ["CRYPTO", "STOCKS", "FOREX"]
}

// Generate some fake sparkline data based on the current price and change
function generateSparkline(price: number, change: number) {
    const data = [];
    let currentPrice = price / (1 + change / 100); // start at prev price
    const steps = 20;
    const stepVolatility = (price * 0.005); // 0.5% volatility per step

    for (let i = 0; i < steps; i++) {
        data.push({ value: currentPrice });
        // Random walk drifting towards current price
        const drift = (price - currentPrice) / (steps - i);
        const randomShift = (Math.random() - 0.5) * stepVolatility;
        currentPrice += drift + randomShift;
    }
    data.push({ value: price });
    return data;
}

export function PersonalizedCards({ preferredMarkets }: PersonalizedCardsProps) {
    const [marketData, setMarketData] = useState<Record<string, TickerData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            const data = await getMarketData();
            setMarketData(data);
            setLoading(false);
        }
        fetch();
    }, []);

    const displayItems = React.useMemo(() => {
        const items = Object.entries(marketData).map(([symbol, data]) => {
            let type = "STOCK";
            let icon = <Sparkles className="w-5 h-5 text-purple-400" />;

            if (["BTC", "ETH", "SOL", "XRP"].includes(symbol)) {
                type = "CRYPTO";
                icon = <Activity className="w-5 h-5 text-orange-400" />;
            }
            if (symbol === "EUR/USD" || symbol === "GBP/USD") {
                type = "FOREX";
                icon = <DollarSign className="w-5 h-5 text-blue-400" />;
            }

            return {
                symbol,
                name: symbol, // Could map to full names
                price: data.price,
                change: data.change,
                type,
                icon,
                sparkline: generateSparkline(data.price, data.change),
            };
        });

        // Filter based on user preferences. If no match, fallback to some defaults.
        const filtered = items.filter(item => preferredMarkets.includes(item.type));
        return filtered.length > 0 ? filtered : items.slice(0, 4); 
    }, [marketData, preferredMarkets]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 rounded-[28px] bg-white/5 border border-white/10" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayItems.map((item, i) => (
                <Link key={item.symbol} href={`/analyzer?symbol=${encodeURIComponent(item.symbol)}`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                        className="group relative p-6 rounded-[28px] bg-[#0a0a0a] border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden cursor-pointer"
                    >
                        {/* Background subtle glow based on positive/negative change */}
                        <div className={`absolute -inset-10 opacity-20 blur-[80px] rounded-full pb-20 pointer-events-none transition-all duration-500 ${item.change >= 0 ? 'bg-cyan-500/20 group-hover:bg-cyan-500/40' : 'bg-red-500/20 group-hover:bg-red-500/40'}`} />

                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <span className="p-2 rounded-2xl bg-white/5">
                                    {item.icon}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-lg tracking-wide">{item.symbol}</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.name}</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-1 font-mono text-sm font-semibold px-2 py-1 rounded-full ${item.change >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
                            </div>
                        </div>

                        <div className="relative z-10 flex justify-between items-end gap-4">
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">Current Price</span>
                                <div className="text-3xl font-mono font-medium tracking-tight">
                                    $<CountUp
                                        to={item.price as number}
                                        from={item.price * 0.9} // Start close to the price
                                        separator=","
                                        duration={1}
                                        className="inline-block"
                                    />
                                </div>
                            </div>

                            {/* Sparkline */}
                            <div className="h-16 w-32 -mr-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={item.sparkline}>
                                        <YAxis domain={['dataMin', 'dataMax']} hide />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={item.change >= 0 ? "#10b981" : "#f87171"}
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={true}
                                            animationDuration={1500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
