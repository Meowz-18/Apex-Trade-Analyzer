"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { SplitText } from "@/components/ui/SplitText";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { MarketOverview } from "@/components/landing/MarketOverview";
import { TickerData } from "@/lib/market-data";

interface HeroProps {
    marketData: Record<string, TickerData>;
}

export function Hero({ marketData }: HeroProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacity = useTransform(scrollY, [0, 1000], [1, 0]);

    return (
        <section className="relative flex min-h-[110vh] flex-col items-center justify-center overflow-hidden bg-background px-4 pb-32">
            {/* Premium Static Background - No Lag */}
            <div className="absolute inset-0 z-0 bg-background" />

            {/* Giant Circle Behind Design (Genius Tip 1) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

            {/* Secondary Geometric Shapes (Genius Tip 3) */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-5 dark:opacity-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] invert dark:invert-0" />

            {/* Accent Glow (Static) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Decorative Floating Elements (Genius Tip 2 & 3) */}
            {/* 3D-ish Sphere Top Left */}
            <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-purple-600/30 rounded-full blur-xl animate-float-slow opacity-60" />

            {/* Fade Out Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent z-20 pointer-events-none" />

            <div className="container relative z-10 mx-auto grid lg:grid-cols-2 gap-16 items-center pt-20">
                {/* Text Content */}
                <motion.div
                    style={{ y, opacity }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center lg:text-left space-y-8"
                >


                    <h1 className="text-6xl md:text-7xl lg:text-9xl font-serif font-medium tracking-tighter text-foreground leading-tight pb-2 relative z-10">
                        <div className="flex items-center gap-4">
                            <SplitText delay={0.1}>Insight</SplitText>
                            {/* Shape between typography (Genius Tip 3) */}
                            <span className="hidden lg:block h-4 w-4 rounded-full bg-primary/40 animate-pulse mt-4" />
                        </div>
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-purple-500 animate-gradient-x bg-[length:200%_auto] relative inline-block">
                            Overload.

                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
                        Institutional-grade trading analysis, democratized.
                        <span className="text-foreground block mt-2 font-medium">No fees. No limits. Just pure alpha.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                        <Link href="/analyzer">
                            <MagneticButton className="cursor-pointer group">
                                <div className="relative w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    Start Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </MagneticButton>
                        </Link>
                    </div>
                </motion.div>

                {/* Market Overview Dashboard */}
                <div className="perspective-1000 w-full flex justify-center lg:justify-end">
                    <MarketOverview initialData={marketData} />
                </div>
            </div>

        </section>
    );
}
