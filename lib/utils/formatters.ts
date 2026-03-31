export const formatSymbolName = (symbol: string) => {
    if (!symbol) return "";
    
    // Explicit overrides for common indices
    const overrides: Record<string, string> = {
        "^GSPC": "S&P 500",
        "^DJI": "Dow Jones",
        "^IXIC": "NASDAQ",
        "^NSEI": "NIFTY 50",
        "^BSESN": "SENSEX",
        "^RUT": "Russell 2000",
        "^VIX": "VIX Volatility"
    };

    if (overrides[symbol]) return overrides[symbol];

    // Remove suffix like .NS, .BO for Indian stocks
    let name = symbol.split('.')[0];
    
    // Remove prefixed ^ for other indices
    if (name.startsWith('^')) {
        name = name.substring(1);
    }
    
    return name;
};
