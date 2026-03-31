import { useState, useEffect } from "react";

const RECENT_STOCKS_KEY = "apex_recent_stocks";

export function useRecentStocks() {
    const [recentStocks, setRecentStocks] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_STOCKS_KEY);
            if (stored) {
                setRecentStocks(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load recent stocks", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addRecent = (symbol: string) => {
        setRecentStocks((prev) => {
            // Remove if exists to move to front
            const filtered = prev.filter(s => s !== symbol);
            const updated = [symbol, ...filtered].slice(0, 10); // Keep top 10
            
            try {
                localStorage.setItem(RECENT_STOCKS_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save recent stock", e);
            }
            
            return updated;
        });
    };

    const clearRecent = () => {
        setRecentStocks([]);
        localStorage.removeItem(RECENT_STOCKS_KEY);
    };

    return {
        recentStocks,
        addRecent,
        clearRecent,
        isLoaded
    };
}
