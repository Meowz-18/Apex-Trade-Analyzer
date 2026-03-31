"use client";

import { useState, useMemo, useEffect } from "react";
import { FilterSidebar, FilterState } from "@/components/stock-lens/FilterSidebar";
import { AssetGrid } from "@/components/stock-lens/AssetGrid";
import { mockScreenerData, ScreenerAsset } from "@/lib/mockScreenerData";
import { useRecentStocks } from "@/lib/hooks/useRecentStocks";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Clock } from "lucide-react";

export default function StockLensPage() {
    const { recentStocks, isLoaded } = useRecentStocks();
    
    // UI states
    const [searchQuery, setSearchQuery] = useState("");
    
    const [filters, setFilters] = useState<FilterState>({
        marketType: "ALL",
        sector: "ALL",
        country: "ALL",
        minMarketCap: 0,
        maxPeRatio: 500,
        minDividendYield: 0,
    });

    // Derive available sectors from mock data
    const availableSectors = useMemo(() => {
        const sectors = new Set<string>();
        mockScreenerData.forEach(d => {
            if (filters.marketType === "ALL" || filters.marketType === d.type) {
                sectors.add(d.sector);
            }
        });
        return Array.from(sectors).sort();
    }, [filters.marketType]);

    // Derive available countries from mock data
    const availableCountries = useMemo(() => {
        const countries = new Set<string>();
        mockScreenerData.forEach(d => {
            if (d.country && (filters.marketType === "ALL" || filters.marketType === d.type)) {
                countries.add(d.country);
            }
        });
        return Array.from(countries).sort();
    }, [filters.marketType]);

    // Check if the user has changed ANY default filters
    const isFiltering = useMemo(() => {
        return (
            filters.marketType !== "ALL" ||
            filters.sector !== "ALL" ||
            filters.country !== "ALL" ||
            filters.minMarketCap > 0 ||
            filters.maxPeRatio < 500 ||
            filters.minDividendYield > 0 ||
            searchQuery.trim().length > 0
        );
    }, [filters, searchQuery]);

    // Apply filters to data
    const filteredAssets = useMemo(() => {
        return mockScreenerData.filter(asset => {
            // Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (!asset.name.toLowerCase().includes(q) && !asset.symbol.toLowerCase().includes(q)) {
                    return false;
                }
            }
            
            // Filters
            if (filters.marketType !== "ALL" && asset.type !== filters.marketType) return false;
            if (filters.sector !== "ALL" && asset.sector !== filters.sector) return false;
            if (filters.country !== "ALL" && asset.country !== filters.country) return false;
            
            // Financials
            if (asset.marketCap < filters.minMarketCap) return false;
            
            if (asset.type === "STOCK") {
                if (asset.peRatio && asset.peRatio > filters.maxPeRatio) return false;
                if (filters.minDividendYield > 0) {
                    if (!asset.dividendYield || asset.dividendYield < filters.minDividendYield) return false;
                }
            }

            return true;
        });
    }, [filters, searchQuery]);

    // Figure out what to actually display
    // If not filtering, and the user has recent stocks -> show recent stocks
    const displayAssets = useMemo(() => {
        if (!isFiltering && recentStocks.length > 0) {
            // Map recent symbols back to data
            return recentStocks
                .map(sym => mockScreenerData.find(a => a.symbol === sym))
                .filter((a): a is ScreenerAsset => a !== undefined);
        }
        return filteredAssets;
    }, [isFiltering, recentStocks, filteredAssets]);

    // Live Price Overlay
    const [liveQuotes, setLiveQuotes] = useState<Record<string, { price: number, change: number }>>({});

    useEffect(() => {
        const symbolsToFetch = displayAssets.map(a => a.symbol);
        if (symbolsToFetch.length === 0) return;
        
        let isMounted = true;
        
        const fetchQuotes = async () => {
            const chunkSize = 5;
            for (let i = 0; i < symbolsToFetch.length; i += chunkSize) {
                if (!isMounted) break;
                const chunk = symbolsToFetch.slice(i, i + chunkSize);
                
                await Promise.all(chunk.map(async (symbol) => {
                    // Skip if we already have it to prevent infinite loop/over-fetching
                    if (liveQuotes[symbol]) return;
                    
                    try {
                        const res = await fetch(`/api/market/quote?symbol=${symbol}`);
                        if (!res.ok) return;
                        const data = await res.json();
                        if (data && data.price && isMounted) {
                            setLiveQuotes(prev => ({
                                ...prev,
                                [symbol]: { price: data.price, change: data.changePercent || 0 }
                            }));
                        }
                    } catch (e) {
                        // Keep mock price if fetch fails
                    }
                }));
            }
        };
        
        fetchQuotes();
        
        return () => { isMounted = false; };
        // We do NOT want to re-run on liveQuotes changing, only on displayAssets
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayAssets]);

    const finalAssetsToRender = useMemo(() => {
        return displayAssets.map(asset => {
            if (liveQuotes[asset.symbol]) {
                return {
                    ...asset,
                    price: liveQuotes[asset.symbol].price,
                    change24h: liveQuotes[asset.symbol].change
                };
            }
            return asset;
        });
    }, [displayAssets, liveQuotes]);

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const showWelcome = !isFiltering && recentStocks.length === 0;

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen">
            {/* Header / Title Area */}
            <div className="mb-8 md:mb-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
                    Stock Lens
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Discover opportunities across global equities and cryptocurrencies with powerful, real-time filters.
                </p>
                
                {/* Search Bar */}
                <div className="mt-8 relative max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for an asset or symbol..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 bg-card border border-border/50 rounded-2xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-lg shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <FilterSidebar 
                        filters={filters} 
                        setFilters={setFilters} 
                        availableSectors={availableSectors} 
                        availableCountries={availableCountries}
                    />
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {showWelcome ? (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-3xl p-8 md:p-12 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]"
                            >
                                <div className="p-4 bg-primary/10 rounded-full inline-flex">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold">Welcome to Stock Lens</h2>
                                <p className="text-lg text-muted-foreground max-w-lg">
                                    You don't have any recently viewed assets yet. Get started by adjusting the filters on the left or searching for your favorite stocks to find market opportunities.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-2xl">
                                    {["Technology", "Finance", "Crypto", "High Yield"].map(tag => (
                                        <div key={tag} className="bg-card border border-border/50 rounded-xl py-3 px-4 text-sm font-medium">
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                {!isFiltering && recentStocks.length > 0 && (
                                    <div className="flex items-center gap-2 px-1 text-muted-foreground">
                                        <Clock className="w-5 h-5" />
                                        <h2 className="text-lg font-medium">Recently Viewed</h2>
                                    </div>
                                )}
                                
                                {isFiltering && (
                                    <div className="flex items-center justify-between px-1">
                                        <h2 className="text-lg font-medium text-muted-foreground">
                                            Found <span className="text-foreground font-bold">{filteredAssets.length}</span> matching assets
                                        </h2>
                                    </div>
                                )}

                                <AssetGrid assets={finalAssetsToRender} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
