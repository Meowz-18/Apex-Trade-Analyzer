"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { TickerData } from "@/lib/market-data";
import Link from "next/link";

// Consolidated List of Assets
const ASSETS = [
    { symbol: "BTCUSDT", name: "Bitcoin", icon: "₿" },
    { symbol: "ETHUSDT", name: "Ethereum", icon: "Ξ" },
    { symbol: "SOLUSDT", name: "Solana", icon: "◎" },
    { symbol: "DOGEUSDT", name: "Dogecoin", icon: "Ð" },
    { symbol: "PEPEUSDT", name: "Pepe", icon: "🐸" },
    { symbol: "BNBUSDT", name: "BNB", icon: "🔶" },
    { symbol: "XRPUSDT", name: "Ripple", icon: "✕" },
    { symbol: "ADAUSDT", name: "Cardano", icon: "₳" },
];

const STREAM_URL = "wss://stream.binance.com:9443/stream?streams=" +
    ASSETS.map(a => `${a.symbol.toLowerCase()}@miniTicker`).join("/");

interface MarketOverviewProps {
    initialData: Record<string, TickerData>;
}

export function MarketOverview({ initialData }: MarketOverviewProps) {
    const [tickers, setTickers] = useState<Record<string, TickerData>>(initialData || {});
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await fetch("/api/market-proxy");
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setTickers((prev) => ({ ...prev, ...data }));
                }
            } catch (e) {
                console.error("Fetch failed:", e);
            }
        };

        // 1. Instant Initial Fetch
        fetchData();

        // 2. Poll every 5 seconds (Safety net)
        const intervalId = setInterval(fetchData, 5000);

        // 3. Connect to WebSocket for Live Updates
        const ws = new WebSocket(STREAM_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            // console.log("Connected to Binance Mapper");
        };

        ws.onmessage = (event) => {
            if (!isMounted) return;
            try {
                const message = JSON.parse(event.data);
                // Format: { stream: "...", data: { s: "BTCUSDT", c: "...", ... } }
                if (message.data) {
                    const data = message.data;
                    const symbol = data.s;
                    const price = parseFloat(data.c);
                    const open = parseFloat(data.o);
                    const change = ((price - open) / open) * 100;

                    setTickers((prev) => {
                        const prevData = prev[symbol];
                        // Only update if price actually changed to avoid unnecessary renders
                        if (prevData && prevData.price === price) return prev;

                        return {
                            ...prev,
                            [symbol]: {
                                price,
                                change,
                                prevPrice: prevData ? prevData.price : price,
                            },
                        };
                    });
                }
            } catch (err) {
                console.error("WS Parse Error", err);
            }
        };

        return () => {
            isMounted = false;
            clearInterval(intervalId);
            ws.close();
        };
    }, []);

    const renderCoinRow = (coin: { symbol: string; name: string; icon: string }) => {
        const data = tickers[coin.symbol];

        // Skeleton: Only show if NO data exists at all
        if (!data) return (
            <div key={coin.symbol} className="flex items-center justify-between py-4 px-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted/20 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted/20 rounded animate-pulse" />
                        <div className="h-3 w-12 bg-muted/20 rounded animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <div className="h-4 w-20 bg-muted/20 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-muted/20 rounded animate-pulse" />
                </div>
            </div>
        );

        const isUp = data.change >= 0;
        const priceColor = data.price > data.prevPrice ? "text-green-400" : data.price < data.prevPrice ? "text-red-400" : "text-foreground";

        return (
            <Link
                key={coin.symbol}
                href={`/analyzer?symbol=${coin.symbol}`}
                className="group flex items-center justify-between py-4 px-4 border-b border-white/5 last:border-0 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-lg shadow-inner border border-white/10 group-hover:scale-110 transition-transform group-hover:border-primary/50 group-hover:text-primary">
                        {coin.icon}
                    </div>
                    <div>
                        <div className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">{coin.symbol.replace("USDT", "")}</div>
                        <div className="text-xs text-muted-foreground font-medium group-hover:text-muted-foreground/80">{coin.name}</div>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <div className={cn("font-mono font-bold text-base transition-colors duration-300", priceColor)}>
                        ${data.price < 1 ? data.price.toFixed(4) : data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={cn("text-xs font-mono flex items-center justify-end gap-1 mt-1 font-medium", isUp ? "text-emerald-400" : "text-rose-400")}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(data.change).toFixed(2)}%
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto relative group"
        >
            {/* Echo Layers (Genius Tip: Add echoes/shadows) */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary/10 rounded-3xl blur-2xl transform scale-105 translate-y-4 opacity-50 group-hover:opacity-80 transition-all duration-700 -z-10" />
            <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/10 rounded-3xl blur-3xl transform scale-110 translate-y-8 opacity-30 group-hover:opacity-60 transition-all duration-1000 -z-20" />

            <div className="rounded-3xl border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative z-10 transition-transform duration-500 hover:-translate-y-2">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                        <h3 className="font-semibold tracking-wide text-foreground">Market Pulse</h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">Live</span>
                    </div>
                </div>

                {/* List */}
                <div className="divide-y divide-white/5">
                    {ASSETS.map(renderCoinRow)}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                    <p className="text-xs text-muted-foreground">Streaming real-time data from Binance</p>
                </div>
            </div>
        </motion.div>
    );
}
