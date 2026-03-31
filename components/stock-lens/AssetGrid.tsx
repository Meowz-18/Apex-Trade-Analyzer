"use client";

import { ScreenerAsset } from "@/lib/mockScreenerData";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye } from "lucide-react";
import { useRecentStocks } from "@/lib/hooks/useRecentStocks";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface AssetGridProps {
    assets: ScreenerAsset[];
    onAssetClick?: (symbol: string) => void;
}

export function AssetGrid({ assets, onAssetClick }: AssetGridProps) {
    const { addRecent } = useRecentStocks();
    const router = useRouter();

    const handleClick = (asset: ScreenerAsset) => {
        addRecent(asset.symbol);
        if (onAssetClick) {
            onAssetClick(asset.symbol);
        }
        
        const typeParam = asset.type === "STOCK" && asset.currency === "INR" ? "INDIA" : asset.type;
        router.push(`/analyzer?symbol=${asset.symbol}&type=${typeParam}`);
    };

    if (assets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed">
                <p className="text-muted-foreground">No assets found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset, i) => (
                <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    onClick={() => handleClick(asset)}
                    className="relative p-5 border border-border/50 bg-card rounded-2xl hover:bg-muted/30 hover:border-border cursor-pointer transition-all flex flex-col gap-3 group"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">{asset.symbol}</h3>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                    {asset.type}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate max-w-[150px]">{asset.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">{asset.currency === "INR" ? "₹" : "$"}{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className={`text-xs flex items-center justify-end gap-1 font-medium ${
                                asset.change24h >= 0 ? "text-emerald-500" : "text-red-500"
                            }`}>
                                {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {Math.abs(asset.change24h).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-3 border-t border-border/40">
                        <div className="space-y-1">
                            <p className="text-muted-foreground flex justify-between">
                                <span>Mkt Cap</span>
                                <span className="text-foreground font-medium">
                                    {asset.currency === "INR" ? "₹" : "$"}{asset.marketCap >= 1000 ? `${(asset.marketCap/1000).toFixed(1)}T` : `${asset.marketCap}B`}
                                </span>
                            </p>
                            {asset.type === "STOCK" && (
                                <p className="text-muted-foreground flex justify-between">
                                    <span>P/E</span>
                                    <span className="text-foreground font-medium">{asset.peRatio?.toFixed(1) || "-"}</span>
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground flex justify-between">
                                <span>Sector</span>
                                <span className="text-foreground font-medium truncate ml-1">{asset.sector}</span>
                            </p>
                            {asset.type === "STOCK" && (
                                <p className="text-muted-foreground flex justify-between">
                                    <span>Div Yield</span>
                                    <span className="text-foreground font-medium">{asset.dividendYield ? `${asset.dividendYield}%` : "-"}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* View Action Hint */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-sm border border-border">
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            View
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
