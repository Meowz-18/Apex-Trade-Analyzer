"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { AnalyzerDashboard } from "@/components/analyzer/AnalyzerDashboard";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { formatSymbolName } from "@/lib/utils/formatters";

type AssetType = "STOCK" | "CRYPTO" | "INDEX" | "INDIA";

interface SearchResult {
    symbol: string;
    name: string;
    type: string;
    exch: string;
}

function AnalyzerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const initialSymbol = searchParams.get("symbol") || "";
    const initialTypeParam = searchParams.get("type");
    const initialType: AssetType = (initialTypeParam === "STOCK" || initialTypeParam === "CRYPTO" || initialTypeParam === "INDEX" || initialTypeParam === "INDIA")
        ? initialTypeParam
        : "STOCK";

    const [symbol, setSymbol] = useState(initialSymbol);
    const [activeSymbol, setActiveSymbol] = useState(initialSymbol);
    const [selectedType, setSelectedType] = useState<AssetType>(initialType);

    // Sync URL when activeSymbol or selectedType changes
    useEffect(() => {
        const currentParams = new URLSearchParams(searchParams.toString());
        const newParams = new URLSearchParams(searchParams.toString());

        if (activeSymbol) {
            newParams.set("symbol", activeSymbol);
            newParams.set("type", selectedType);
        } else {
            newParams.delete("symbol");
            // If checking persistence of type without symbol is desired, keep it, otherwise consistent
        }

        // Only update if params actually changed
        if (currentParams.get("symbol") !== newParams.get("symbol") ||
            currentParams.get("type") !== newParams.get("type")) {
            router.replace(`/analyzer?${newParams.toString()}`, { scroll: false });
        }
    }, [activeSymbol, selectedType, router, searchParams]);

    // Search Autocomplete State
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce Timer Ref
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const [timeframe, setTimeframe] = useState("1M");

    // Only fetch when activeSymbol is set
    const fetcher = async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || "Symbol not supported or API error");
        }
        return res.json();
    };

    // Map UI 'INDIA' selection to backend 'STOCK' type
    const apiType = selectedType === "INDIA" ? "STOCK" : selectedType;

    const { data, error, isLoading } = useSWR(
        activeSymbol ? `/api/analysis?symbol=${activeSymbol}&type=${apiType}&range=${timeframe}` : null,
        fetcher,
        {
            refreshInterval: 30000,
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!symbol) return;
        setActiveSymbol(symbol);
        setShowResults(false);
    };

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSymbol(value);
        setShowResults(true);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (value.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/market/search?q=${value}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.results || []);
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const handleSelectResult = (s: SearchResult) => {
        setSymbol(s.symbol);
        setActiveSymbol(s.symbol);
        setShowResults(false);
        setSearchResults([]);

        // Smart Tab Switching
        if (s.type === 'CRYPTOCURRENCY') setSelectedType("CRYPTO");
        else if (s.exch.includes("NSE") || s.symbol.endsWith(".NS")) setSelectedType("INDIA");
        else if (s.type === 'INDEX' || s.symbol.startsWith("^")) setSelectedType("INDEX");
        else setSelectedType("STOCK"); // Default fallback
    };

    // Quick suggestions based on active tab
    const suggestions = {
        STOCK: ["NVDA", "AAPL", "TSLA", "MSFT", "AMD"],
        CRYPTO: ["BTC", "ETH", "SOL", "DOGE", "XRP"],
        INDEX: ["^GSPC", "^DJI", "^IXIC"],
        INDIA: ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "^NSEI", "^BSESN"]
    };

    return (
        <div className="flex flex-col min-h-screen container mx-auto px-4 py-8 gap-8">
            {/* Search Section */}
            <section className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        AI Market Analyzer
                    </h1>
                    <p className="text-muted-foreground">
                        Enter a symbol to generate an instant institutional-grade report.
                    </p>
                </div>

                {/* Asset Type Selector */}
                <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50 backdrop-blur-sm overflow-x-auto max-w-full">
                    {(["STOCK", "CRYPTO", "INDEX", "INDIA"] as AssetType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => {
                                setSelectedType(type);
                                setSymbol("");
                                setActiveSymbol("");
                                setSearchResults([]);
                            }}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${selectedType === type
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            {type === "STOCK" && "Stocks"}
                            {type === "CRYPTO" && "Crypto"}
                            {type === "INDEX" && "Indices"}
                            {type === "INDIA" && "India (NSE)"}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleAnalyze} className="w-full relative z-50">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={symbol}
                            onChange={onSearchChange}
                            onFocus={() => { if (symbol.length >= 2) setShowResults(true); }}
                            onBlur={() => {
                                // Delay hide to allow click
                                setTimeout(() => setShowResults(false), 200);
                            }}
                            placeholder={
                                selectedType === "STOCK" ? "Search ticker (e.g. NVDA)..." :
                                    selectedType === "CRYPTO" ? "Search coin (e.g. BTC)..." :
                                        selectedType === "INDIA" ? "Search NSE/BSE (e.g. RELIANCE)..." :
                                            "Search index (e.g. S&P 500)..."
                            }
                            className="block w-full rounded-xl border border-border bg-card py-4 pl-12 pr-32 text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-lg backdrop-blur-md"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !symbol}
                            className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
                        </button>

                        {/* Search Dropdown */}
                        <AnimatePresence>
                            {showResults && (isSearching || searchResults.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute w-full mt-2 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl max-h-[300px] overflow-y-auto"
                                >
                                    {isSearching && (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> Searching...
                                        </div>
                                    )}
                                    {!isSearching && searchResults.length === 0 && (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No results found.
                                        </div>
                                    )}
                                    {!isSearching && searchResults.map((res) => (
                                        <button
                                            key={res.symbol}
                                            type="button"
                                            onClick={() => handleSelectResult(res)}
                                            className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex justify-between items-center group/item border-b border-border/40 last:border-0"
                                        >
                                            <div>
                                                <div className="font-semibold text-foreground group-hover/item:text-primary transition-colors">
                                                    {res.symbol}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {res.name}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-secondary-foreground mb-1 inline-block">
                                                    {res.exch}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {res.type}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mt-3 text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            {error.message}
                        </p>
                    )}
                </form>

                <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                    <span>Try:</span>
                    {suggestions[selectedType].map(s => (
                        <button
                            key={s}
                            onClick={() => { setSymbol(s); setActiveSymbol(s); }}
                            className="hover:text-primary underline cursor-pointer px-1"
                        >
                            {formatSymbolName(s)}
                        </button>
                    ))}
                </div>

                {/* New Feature: AI Document Analysis Link */}
                <div className="pt-8 w-full max-w-lg">
                    <div
                        onClick={() => router.push('/analyzer/reports')}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 hover:border-primary/30 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between z-10 relative">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Financial Analyst Agent</h3>
                                </div>
                                <p className="text-xs text-muted-foreground max-w-[250px]">
                                    Upload PDF earnings reports for instant AI extraction & visualization.
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 space-y-4"
                    >
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-muted-foreground animate-pulse">Running AI Inference Models...</p>
                        <div className="flex gap-2 text-xs text-muted-foreground/50">
                            <span>• Fetching Price Data</span>
                            <span>• Analyzing Sentiment</span>
                            <span>• Calculating Technicals</span>
                        </div>
                    </motion.div>
                )}

                {data && !isLoading && !error && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-4 px-2">
                            <div className="flex gap-2">
                                <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                                    Source: {data.marketData?.source || (selectedType === "CRYPTO" ? "CoinGecko API" : "Yahoo Finance API")}
                                </span>
                                <span className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                                    Asset: {selectedType}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live Data (30s poll)
                            </span>
                        </div>

                        <AnalyzerDashboard data={{
                            symbol: formatSymbolName(data.symbol),
                            price: data.marketData ? data.marketData.price : 0,
                            change: data.marketData ? data.marketData.change : 0,
                            currency: selectedType === "INDIA" ? "INR" : "USD",
                            // Fallback static data for fields not in Simulation Engine yet
                            marketCap: data.symbol === "NVDA" ? "2.2T" : (selectedType === "CRYPTO" ? "N/A" : "N/A"),
                            peRatio: data.symbol === "NVDA" ? "74.5" : (selectedType === "CRYPTO" ? "N/A" : "N/A"),
                            revenue: data.symbol === "NVDA" ? "+12% QoQ" : (selectedType === "CRYPTO" ? "N/A" : "N/A"),
                            modelA: data.modelA,
                            modelB: data.modelB,
                            news: data.news,
                            chartData: data.chartData,
                            activeTimeframe: timeframe,
                            onTimeframeChange: setTimeframe
                        }} />
                        <div className="mt-8 max-w-4xl mx-auto">
                            <Disclaimer />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AnalyzerPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col min-h-screen container mx-auto px-4 py-8 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <AnalyzerContent />
        </Suspense>
    );
}
