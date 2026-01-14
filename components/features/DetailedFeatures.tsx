"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Zap, TrendingUp, Lock, Globe, BarChart3, Database, FileText, Share2, Activity, Cpu, Layers, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Real-time Processing",
        description: "Sub-millisecond latency engine. We process thousands of ticks per second to ensure you're always acting on the latest price action.",
        icon: Zap,
        gradient: "from-amber-500/20 to-orange-600/20",
        border: "group-hover:border-amber-500/50",
        text: "group-hover:text-amber-400",
    },
    {
        title: "AI Strategy Interpreter",
        description: "Our LLM engine doesn't just display signals; it explains them. Get plain-English breakdowns of why a setup is valid or invalid.",
        icon: Cpu,
        gradient: "from-indigo-500/20 to-purple-600/20",
        border: "group-hover:border-indigo-500/50",
        text: "group-hover:text-indigo-400",
    },
    {
        title: "Institutional Security",
        description: "Enterprise-grade encryption for your API keys and strategy data. We never store your exchange withdrawal permissions.",
        icon: Shield,
        gradient: "from-emerald-500/20 to-teal-600/20",
        border: "group-hover:border-emerald-500/50",
        text: "group-hover:text-emerald-400",
    },
    {
        title: "Global Market Coverage",
        description: "Trade Crypto, Forex, and Stocks from a single interface. Our unified data layer normalizes charts across all asset classes.",
        icon: Globe,
        gradient: "from-blue-500/20 to-cyan-600/20",
        border: "group-hover:border-blue-500/50",
        text: "group-hover:text-blue-400",
    },
    {
        title: "Backtesting Suite",
        description: "Simulate years of trading in seconds. Test for slippage, commission impact, and liquidity constraints before risking a cent.",
        icon: Layers,
        gradient: "from-rose-500/20 to-red-600/20",
        border: "group-hover:border-rose-500/50",
        text: "group-hover:text-rose-400",
    },
    {
        title: "Sentiment Analysis",
        description: "We scrape 50,000+ news sources and social channels to build a real-time 'Fear & Greed' index for every individual asset.",
        icon: Share2,
        gradient: "from-fuchsia-500/20 to-pink-600/20",
        border: "group-hover:border-fuchsia-500/50",
        text: "group-hover:text-fuchsia-400",
    },
];

const featureImages = [
    "/assets/feature-glass.png",
    "/assets/feature-cube.png",
    "/assets/feature-sphere.png",
    "/assets/feature-glass.png",
    "/assets/feature-cube.png",
    "/assets/feature-sphere.png",
];

export function DetailedFeatures() {
    return (
        <div className="py-32 md:py-48 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-32 space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground font-serif"
                >
                    Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Alpha.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Institutional-grade infrastructure, democratized for the modern trader.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} image={featureImages[index]} />
                ))}
            </div>
        </div>
    );
}

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    border: string;
    text: string;
}

function FeatureCard({ feature, index, image }: { feature: Feature; index: number; image: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="group relative h-[500px] w-full rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:scale-[1.02] transition-transform duration-500"
        >
            {/* Internal "Frame" Padding */}
            <div className="absolute inset-2 md:inset-3 rounded-2xl overflow-hidden bg-black/40 flex flex-col justify-end p-8 border border-white/5 group-hover:border-white/10 transition-colors">

                {/* Background Image/Asset */}
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                    <img
                        src={image}
                        alt={feature.title}
                        className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-[1.5s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className={`h-12 w-12 rounded-full backdrop-blur-md bg-white/10 border border-white/10 flex items-center justify-center mb-4 ${feature.text}`}>
                        <feature.icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight font-serif">
                        {feature.title}
                    </h3>

                    <p className="text-white/60 leading-relaxed font-light text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {feature.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
