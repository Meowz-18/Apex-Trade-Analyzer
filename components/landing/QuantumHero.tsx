"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, Activity, DollarSign, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { TickerData } from "@/lib/market-data";
import DecryptedText from "@/components/ui/DecryptedText";
import CountUp from "@/components/ui/CountUp";

interface QuantumHeroProps {
    marketData?: Record<string, TickerData>;
}

export function QuantumHero({ marketData }: QuantumHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const rotate = useTransform(scrollY, [0, 500], [0, 20]);

    // Mouse move effect for 3D tilt
    const x = useSpring(0, { stiffness: 100, damping: 30 });
    const y = useSpring(0, { stiffness: 100, damping: 30 });

    function handleMouseMove(event: React.MouseEvent) {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        x.set((clientX / innerWidth - 0.5) * 40); // Tilt range
        y.set((clientY / innerHeight - 0.5) * 40);
    }

    // Process Market Data for Display
    const tickerItems = React.useMemo(() => {
        if (!marketData || Object.keys(marketData).length === 0) return MOCK_FALLBACK;

        return Object.entries(marketData).map(([symbol, data]) => {
            let type = "STOCK";
            let icon = <Sparkles className="w-4 h-4" />;

            if (["BTC", "ETH", "SOL", "XRP"].includes(symbol)) { type = "CRYPTO"; icon = <Activity className="w-4 h-4" />; }
            if (symbol === "EUR/USD") { type = "FOREX"; icon = <DollarSign className="w-4 h-4" />; }
            if (symbol === "GOLD") { type = "COMMODITY"; icon = <Layers className="w-4 h-4" />; }

            return {
                symbol,
                name: symbol, // Could map to full names if needed
                price: data.price, // Keep raw number for CountUp
                formattedPrice: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.price),
                change: data.change,
                type,
                icon
            };
        });
    }, [marketData]);

    const displayItems = [...tickerItems, ...tickerItems]; // Duplicate for infinite scroll

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-[#050505]"
        >
            {/* 1. Background Grid & Particles */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]"></div>

            {/* 2. Floating 3D Elements (Simulated with CSS/Motion) */}

            {/* Large Neon Orb */}
            <motion.div
                style={{ x: useTransform(x, value => value * -1), y: useTransform(y, value => value * -1) }}
                className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
            />

            {/* Secondary Purple Orb */}
            <motion.div
                style={{ x, y }}
                className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"
            />

            {/* Ghost Box Removed Here */}

            <motion.div style={{ y: y1, rotate: 5, x: useTransform(x, v => v * -0.5) }} className="absolute left-[10%] bottom-[20%] hidden lg:block z-0 opacity-30">
                <div className="w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-full backdrop-blur-xl -rotate-6 transform-gpu shadow-2xl glow-purple" />
            </motion.div>


            {/* 3. Main Content Content */}
            <div className="relative z-10 container px-4 mx-auto text-center">

                {/* Headline */}
                <motion.h1
                    className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-6 drop-shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Predict The <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 glow-text-cyan">
                        <DecryptedText
                            text="Unseen"
                            animateOn="view"
                            revealDirection="center"
                            speed={100}
                            maxIterations={20}
                            characters="ABCD1234!?"
                            className="text-cyan-400"
                            parentClassName="inline-block"
                            encryptedClassName="text-purple-500"
                        />
                    </span> Future
                </motion.h1>

                {/* Subhead */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Harness the power of institutional-grade AI to analyze market sentiment, predict trends, and execute simulated trades with <span className="text-white font-semibold">Quantum Precision</span>.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button asChild size="lg" className="relative group bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-12 px-8 rounded-full glow-cyan transition-all duration-300 transform hover:scale-105">
                        <Link href="/analyzer">
                            <span className="relative z-10 flex items-center gap-2">
                                Launch Console <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </Button>


                </motion.div>

                {/* Quantum Market Ticker */}
                <motion.div
                    style={{ y: 50, opacity: useTransform(scrollY, [0, 300], [1, 0]) }}
                    className="mt-20 w-full overflow-hidden"
                >
                    <div className="flex gap-6 animate-scroll w-max hover:[animation-play-state:paused]">
                        {displayItems.map((item, i) => (
                            <div
                                key={i}
                                className="w-64 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md flex flex-col gap-2 group hover:border-cyan-500/30 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className={`p-1.5 rounded-lg ${item.type === 'CRYPTO' ? 'bg-orange-500/20 text-orange-400' : item.type === 'STOCK' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-bold text-sm tracking-wider">{item.symbol}</span>
                                    </div>
                                    <span className={`text-xs font-mono font-bold ${item.change >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-mono font-medium text-white/90">
                                        $<CountUp
                                            to={item.price as number}
                                            from={0}
                                            separator=","
                                            duration={1.5}
                                            className="inline-block"
                                        />
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

const MOCK_FALLBACK = [
    { symbol: "BTC", name: "Bitcoin", price: 64230, change: 2.4, type: "CRYPTO", icon: <Activity className="w-4 h-4" /> },
    { symbol: "ETH", name: "Ethereum", price: 3450, change: 1.8, type: "CRYPTO", icon: <Activity className="w-4 h-4" /> },
];
