"use client";

import { AssetMarketType } from "@/lib/mockScreenerData";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export interface FilterState {
    marketType: AssetMarketType | "ALL";
    sector: string;
    country: string;
    minMarketCap: number; // in billions
    maxPeRatio: number;
    minDividendYield: number;
}

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: (f: FilterState | ((prev: FilterState) => FilterState)) => void;
    availableSectors: string[];
    availableCountries: string[];
}

export function FilterSidebar({ filters, setFilters, availableSectors, availableCountries }: FilterSidebarProps) {
    
    const resetFilters = () => {
        setFilters({
            marketType: "ALL",
            sector: "ALL",
            country: "ALL",
            minMarketCap: 0,
            maxPeRatio: 500, // Effectively no max
            minDividendYield: 0,
        });
    };

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-5 md:p-6 space-y-8 sticky top-24">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filters
                </h2>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-8 px-2">
                    Reset
                </Button>
            </div>

            {/* Market Type */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Asset Class</h3>
                <div className="grid grid-cols-3 gap-2">
                    {["ALL", "STOCK", "CRYPTO"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilters({ ...filters, marketType: type as any })}
                            className={`py-2 px-1 text-xs font-medium rounded-lg transition-colors border ${
                                filters.marketType === type 
                                    ? "bg-primary text-primary-foreground border-primary" 
                                    : "bg-muted/30 text-muted-foreground border-transparent hover:border-border hover:bg-muted"
                            }`}
                        >
                            {type === "ALL" ? "All" : type === "STOCK" ? "Stocks" : "Crypto"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sector */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Sector</h3>
                <select 
                    value={filters.sector}
                    onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                    className="w-full bg-background border border-border text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-colors"
                >
                    <option value="ALL">All Sectors</option>
                    {availableSectors.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Country */}
            <div className={`space-y-3 transition-opacity ${filters.marketType === "CRYPTO" ? "opacity-30 pointer-events-none hidden" : "opacity-100"}`}>
                <h3 className="font-semibold text-sm text-foreground">Country</h3>
                <select 
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full bg-background border border-border text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-colors"
                >
                    <option value="ALL">All Countries</option>
                    {availableCountries.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Market Cap */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-foreground">Min Market Cap</h3>
                    <span className="text-xs font-medium text-muted-foreground">${filters.minMarketCap}B+</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={filters.minMarketCap}
                    onChange={(e) => setFilters({ ...filters, minMarketCap: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </div>

            {/* P/E Ratio (Stocks Only ideally, but we gray it out if crypto is selected) */}
            <div className={`space-y-3 transition-opacity ${filters.marketType === "CRYPTO" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-foreground">Max P/E Ratio</h3>
                    <span className="text-xs font-medium text-muted-foreground">
                        {filters.maxPeRatio >= 500 ? "Any" : `< ${filters.maxPeRatio}`}
                    </span>
                </div>
                <input 
                    type="range" 
                    min="5" 
                    max="500" 
                    step="5"
                    value={filters.maxPeRatio}
                    onChange={(e) => setFilters({ ...filters, maxPeRatio: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </div>

            {/* Dividend Yield */}
            <div className={`space-y-3 transition-opacity ${filters.marketType === "CRYPTO" ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-foreground">Min Dividend Yield</h3>
                    <span className="text-xs font-medium text-muted-foreground">{filters.minDividendYield}%+</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value={filters.minDividendYield}
                    onChange={(e) => setFilters({ ...filters, minDividendYield: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </div>

            <div className="pt-4 border-t border-border/40 text-xs text-muted-foreground/60 text-center">
                Data is simulated for demonstration purposes.
            </div>
        </div>
    );
}
