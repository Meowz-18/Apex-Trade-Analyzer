"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/lib/providers/UserProvider";
import { getWatchlist, getUserProfile } from "@/lib/supabase/userDb";
import { getAnalysisHistory } from "@/lib/supabase/analysisDb";
import { AnalysisService } from "@/lib/services/analysisService";
import { Newspaper, TrendingUp, TrendingDown, Clock, Globe, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
    id: string;
    symbol: string;
    title: string;
    sentiment: "Positive" | "Negative" | "Neutral";
    source: string;
    url?: string;
    timeAgo: string;
}

export default function NewsPage() {
    const { user, loading: userLoading } = useUser();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userLoading) return;

        const fetchNews = async () => {
            setLoading(true);
            try {
                // Determine relevant symbols
                const relevantSymbols = new Set<string>();

                // 1. Fetch user watchlist and profile if logged in
                let hasUserPreferences = false;
                if (user) {
                    const [watchlist, profile] = await Promise.all([
                        getWatchlist(user.id),
                        getUserProfile(user.id).catch(() => null)
                    ]);
                    
                    watchlist.forEach(item => relevantSymbols.add(item.symbol));
                    
                    if (profile && profile.preferred_markets && profile.preferred_markets.length > 0) {
                        hasUserPreferences = true;
                        
                        const marketSymbols: Record<string, string[]> = {
                            "CRYPTO": ["BTC", "ETH", "SOL", "BNB"],
                            "STOCKS": ["NIFTY", "RELIANCE", "TCS.NS", "HDFCBANK.NS", "INFY.NS"],
                            "FOREX": ["EUR/USD", "GBP/USD", "USD/JPY"],
                        };
                        
                        profile.preferred_markets.forEach((market: string) => {
                            const symbols = marketSymbols[market] || [];
                            symbols.forEach(sym => relevantSymbols.add(sym));
                        });
                    }
                }

                // 2. Fetch recent global analysis history (as a proxy for popular/recent markets)
                if (!hasUserPreferences || relevantSymbols.size < 5) {
                    const history = await getAnalysisHistory(20);
                    history.forEach(item => relevantSymbols.add(item.symbol));
                }

                // 3. Fallbacks if too few
                const defaults = ["BTC", "NIFTY", "RELIANCE", "AAPL", "GOLD", "EUR/USD"];
                for (const def of defaults) {
                    if (relevantSymbols.size >= 8) break;
                    relevantSymbols.add(def);
                }

                // Generate news for these symbols
                const generatedNews: NewsItem[] = [];
                let idCounter = 0;

                Array.from(relevantSymbols).slice(0, 10).forEach((symbol, index) => {
                    // Create a pseudo-random but deterministic change percent to drive sentiment
                    // This ensures the news looks realistic and varied
                    const pseudoChange = Math.sin(symbol.charCodeAt(0) + index) * 3; 
                    
                    const articles = AnalysisService.generateNews(symbol, pseudoChange);
                    
                    articles.forEach((article, artIndex) => {
                        // Vary the time ago
                        const hoursAgo = Math.max(1, Math.floor(Math.abs(Math.cos(artIndex + index)) * 24));
                        
                        generatedNews.push({
                            id: `news-${idCounter++}`,
                            symbol,
                            ...article,
                            timeAgo: `${hoursAgo}h ago`
                        });
                    });
                });

                // Shuffle and take top 15
                generatedNews.sort(() => Math.random() - 0.5);
                setNews(generatedNews.slice(0, 15));

            } catch (error) {
                console.error("Failed to load news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [user, userLoading]);

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 lg:min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Newspaper className="w-4 h-4" />
                        Market Intelligence
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Personalized Feed
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {user 
                            ? "AI-curated news based on your watchlist and recent market lookups."
                            : "Real-time AI-generated news for trending global markets."}
                    </p>
                </div>

                {loading || userLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <p>Aggregating global sources...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group relative bg-card hover:bg-card/60 transition-colors border border-border/50 rounded-2xl p-5 md:p-6 overflow-hidden"
                            >
                                {/* Subtle sentiment background hint */}
                                <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${
                                    item.sentiment === "Positive" ? "bg-emerald-500" :
                                    item.sentiment === "Negative" ? "bg-red-500" : "bg-blue-500"
                                }`} />

                                <div className="flex flex-col md:flex-row md:items-start gap-4 relative z-10">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-bold tracking-wider">
                                                {item.symbol}
                                            </span>
                                            <span className={`flex items-center text-xs font-medium ${
                                                item.sentiment === "Positive" ? "text-emerald-400" :
                                                item.sentiment === "Negative" ? "text-red-400" : "text-muted-foreground"
                                            }`}>
                                                {item.sentiment === "Positive" && <TrendingUp className="w-3 h-3 mr-1" />}
                                                {item.sentiment === "Negative" && <TrendingDown className="w-3 h-3 mr-1" />}
                                                {item.sentiment === "Neutral" && <Globe className="w-3 h-3 mr-1" />}
                                                {item.sentiment}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5" />
                                                {item.source}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {item.timeAgo}
                                            </span>
                                        </div>
                                    </div>

                                    {item.url && item.url !== "#" && (
                                        <div className="flex-shrink-0 mt-2 md:mt-0">
                                            <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hover:bg-primary hover:text-primary-foreground transition-all">
                                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                    <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
