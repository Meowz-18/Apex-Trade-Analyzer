export type AssetMarketType = "STOCK" | "CRYPTO";

export interface ScreenerAsset {
    symbol: string;
    name: string;
    type: AssetMarketType;
    sector: string;
    price: number;
    change24h: number;
    volume24h: number; // in millions for stocks, raw for crypto
    marketCap: number; // in billions for stocks, raw/billions for crypto
    currency: "USD" | "INR" | "EUR" | "GBP";
    country?: "USA" | "India" | "Global" | "Europe" | "UK";
    
    // Stock specific financials
    peRatio?: number;
    roe?: number;
    dividendYield?: number;
    debtToEquity?: number;
    
    // Technicals
    high52w: number;
    low52w: number;
}

export const mockScreenerData: ScreenerAsset[] = [
    // US Tech Stocks
    { symbol: "AAPL", name: "Apple Inc.", type: "STOCK", sector: "Technology", price: 175.50, change24h: 1.2, volume24h: 55.2, marketCap: 2800, currency: "USD", country: "USA", peRatio: 28.5, roe: 156.2, dividendYield: 0.53, debtToEquity: 1.45, high52w: 198.23, low52w: 145.89 },
    { symbol: "MSFT", name: "Microsoft", type: "STOCK", sector: "Technology", price: 340.20, change24h: -0.5, volume24h: 22.1, marketCap: 2600, currency: "USD", country: "USA", peRatio: 33.1, roe: 39.4, dividendYield: 0.85, debtToEquity: 0.28, high52w: 384.30, low52w: 245.61 },
    { symbol: "GOOGL", name: "Alphabet", type: "STOCK", sector: "Technology", price: 135.40, change24h: 2.1, volume24h: 28.4, marketCap: 1700, currency: "USD", country: "USA", peRatio: 24.8, roe: 23.5, dividendYield: 0, debtToEquity: 0.05, high52w: 142.38, low52w: 88.58 },
    { symbol: "AMZN", name: "Amazon", type: "STOCK", sector: "Consumer Discretionary", price: 145.20, change24h: -1.2, volume24h: 45.3, marketCap: 1500, currency: "USD", country: "USA", peRatio: 72.4, roe: 12.1, dividendYield: 0, debtToEquity: 0.65, high52w: 155.00, low52w: 81.43 },
    { symbol: "NVDA", name: "NVIDIA", type: "STOCK", sector: "Technology", price: 450.80, change24h: 5.4, volume24h: 65.1, marketCap: 1100, currency: "USD", country: "USA", peRatio: 105.2, roe: 45.6, dividendYield: 0.04, debtToEquity: 0.42, high52w: 502.66, low52w: 108.13 },
    { symbol: "META", name: "Meta Platforms", type: "STOCK", sector: "Technology", price: 320.10, change24h: 1.8, volume24h: 18.5, marketCap: 820, currency: "USD", country: "USA", peRatio: 30.5, roe: 22.3, dividendYield: 0, debtToEquity: 0.25, high52w: 342.92, low52w: 88.09 },
    { symbol: "TSLA", name: "Tesla Inc.", type: "STOCK", sector: "Consumer Discretionary", price: 210.50, change24h: -3.2, volume24h: 112.4, marketCap: 670, currency: "USD", country: "USA", peRatio: 65.4, roe: 25.1, dividendYield: 0, debtToEquity: 0.12, high52w: 313.80, low52w: 101.81 },
    { symbol: "NFLX", name: "Netflix", type: "STOCK", sector: "Communication", price: 485.20, change24h: 2.1, volume24h: 6.2, marketCap: 215, currency: "USD", country: "USA", peRatio: 45.2, roe: 28.5, dividendYield: 0, debtToEquity: 0.85, high52w: 505.00, low52w: 350.50 },
    { symbol: "CRM", name: "Salesforce", type: "STOCK", sector: "Technology", price: 285.30, change24h: -0.8, volume24h: 7.1, marketCap: 275, currency: "USD", country: "USA", peRatio: 65.1, roe: 15.2, dividendYield: 0.5, debtToEquity: 0.35, high52w: 300.00, low52w: 195.00 },
    
    // Financials
    { symbol: "JPM", name: "JPMorgan Chase", type: "STOCK", sector: "Financials", price: 155.30, change24h: 0.4, volume24h: 8.5, marketCap: 450, currency: "USD", country: "USA", peRatio: 9.8, roe: 16.5, dividendYield: 2.8, debtToEquity: 2.1, high52w: 160.00, low52w: 115.00 },
    { symbol: "BAC", name: "Bank of America", type: "STOCK", sector: "Financials", price: 28.40, change24h: -0.2, volume24h: 35.1, marketCap: 225, currency: "USD", country: "USA", peRatio: 8.5, roe: 11.2, dividendYield: 3.4, debtToEquity: 1.8, high52w: 35.00, low52w: 24.00 },
    { symbol: "V", name: "Visa", type: "STOCK", sector: "Financials", price: 245.80, change24h: 0.7, volume24h: 5.2, marketCap: 500, currency: "USD", country: "USA", peRatio: 31.5, roe: 42.1, dividendYield: 0.75, debtToEquity: 0.6, high52w: 250.00, low52w: 185.00 },
    { symbol: "MA", name: "Mastercard", type: "STOCK", sector: "Financials", price: 410.50, change24h: 1.2, volume24h: 3.1, marketCap: 385, currency: "USD", country: "USA", peRatio: 35.4, roe: 145.2, dividendYield: 0.6, debtToEquity: 2.4, high52w: 420.00, low52w: 340.00 },
    
    // Healthcare
    { symbol: "UNH", name: "UnitedHealth", type: "STOCK", sector: "Healthcare", price: 540.20, change24h: 0.1, volume24h: 2.8, marketCap: 500, currency: "USD", country: "USA", peRatio: 22.4, roe: 25.4, dividendYield: 1.5, debtToEquity: 0.75, high52w: 555.00, low52w: 445.00 },
    { symbol: "JNJ", name: "Johnson & Johnson", type: "STOCK", sector: "Healthcare", price: 155.80, change24h: -0.5, volume24h: 6.5, marketCap: 375, currency: "USD", country: "USA", peRatio: 14.5, roe: 18.2, dividendYield: 3.1, debtToEquity: 0.55, high52w: 175.00, low52w: 140.00 },
    { symbol: "PFE", name: "Pfizer", type: "STOCK", sector: "Healthcare", price: 32.50, change24h: -1.1, volume24h: 25.4, marketCap: 180, currency: "USD", country: "USA", peRatio: 12.8, roe: 15.6, dividendYield: 5.2, debtToEquity: 0.45, high52w: 52.00, low52w: 28.00 },
    { symbol: "LLY", name: "Eli Lilly", type: "STOCK", sector: "Healthcare", price: 650.40, change24h: 3.4, volume24h: 4.8, marketCap: 615, currency: "USD", country: "USA", peRatio: 110.5, roe: 45.2, dividendYield: 0.8, debtToEquity: 1.2, high52w: 660.00, low52w: 320.00 },

    // Indian Stocks (NSE proxy for variety)
    { symbol: "RELIANCE.NS", name: "Reliance Ind.", type: "STOCK", sector: "Energy", price: 2855.40, change24h: 1.5, volume24h: 8.2, marketCap: 23500, currency: "INR", country: "India", peRatio: 28.4, roe: 10.5, dividendYield: 0.35, debtToEquity: 0.4, high52w: 2950.00, low52w: 2100.00 },
    { symbol: "TCS.NS", name: "Tata Consultancy", type: "STOCK", sector: "Technology", price: 3950.20, change24h: -0.8, volume24h: 2.1, marketCap: 17500, currency: "INR", country: "India", peRatio: 32.1, roe: 45.2, dividendYield: 1.2, debtToEquity: 0.05, high52w: 4050.00, low52w: 3000.00 },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank", type: "STOCK", sector: "Financials", price: 1450.60, change24h: 2.2, volume24h: 18.5, marketCap: 16000, currency: "INR", country: "India", peRatio: 15.4, roe: 16.8, dividendYield: 1.1, debtToEquity: 1.5, high52w: 1750.00, low52w: 1350.00 },
    { symbol: "INFY.NS", name: "Infosys", type: "STOCK", sector: "Technology", price: 1655.80, change24h: 0.5, volume24h: 4.8, marketCap: 8500, currency: "INR", country: "India", peRatio: 26.5, roe: 31.4, dividendYield: 2.1, debtToEquity: 0.08, high52w: 1700.00, low52w: 1250.00 },
    { symbol: "ITC.NS", name: "ITC Ltd", type: "STOCK", sector: "Consumer Staples", price: 420.50, change24h: 0.2, volume24h: 12.5, marketCap: 6500, currency: "INR", country: "India", peRatio: 28.6, roe: 28.1, dividendYield: 3.5, debtToEquity: 0.02, high52w: 480.00, low52w: 350.00 },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank", type: "STOCK", sector: "Financials", price: 1050.20, change24h: 1.8, volume24h: 14.5, marketCap: 7400, currency: "INR", country: "India", peRatio: 17.2, roe: 18.5, dividendYield: 0.8, debtToEquity: 1.3, high52w: 1100.00, low52w: 800.00 },
    { symbol: "SBIN.NS", name: "State Bank of India", type: "STOCK", sector: "Financials", price: 615.80, change24h: -0.5, volume24h: 21.2, marketCap: 5500, currency: "INR", country: "India", peRatio: 8.5, roe: 15.1, dividendYield: 1.8, debtToEquity: 2.5, high52w: 650.00, low52w: 500.00 },
    { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", type: "STOCK", sector: "Communication", price: 1150.40, change24h: -1.2, volume24h: 6.8, marketCap: 6800, currency: "INR", country: "India", peRatio: 55.4, roe: 12.5, dividendYield: 0.4, debtToEquity: 1.1, high52w: 1200.00, low52w: 750.00 },
    { symbol: "L&T.NS", name: "Larsen & Toubro", type: "STOCK", sector: "Industrials", price: 3450.90, change24h: 2.5, volume24h: 4.2, marketCap: 4800, currency: "INR", country: "India", peRatio: 38.2, roe: 14.5, dividendYield: 0.7, debtToEquity: 0.8, high52w: 3550.00, low52w: 2200.00 },
    { symbol: "ASIANPAINT.NS", name: "Asian Paints", type: "STOCK", sector: "Materials", price: 3150.20, change24h: 0.5, volume24h: 1.8, marketCap: 3000, currency: "INR", country: "India", peRatio: 65.4, roe: 28.5, dividendYield: 0.8, debtToEquity: 0.05, high52w: 3500.00, low52w: 2700.00 },

    // European/Global Stocks
    { symbol: "ASML", name: "ASML Holding", type: "STOCK", sector: "Technology", price: 850.40, change24h: 1.5, volume24h: 1.2, marketCap: 340, currency: "USD", country: "Europe", peRatio: 45.2, roe: 55.4, dividendYield: 0.8, debtToEquity: 0.3, high52w: 900.00, low52w: 550.00 },
    { symbol: "NVO", name: "Novo Nordisk", type: "STOCK", sector: "Healthcare", price: 115.20, change24h: 2.8, volume24h: 4.5, marketCap: 520, currency: "USD", country: "Europe", peRatio: 42.5, roe: 85.2, dividendYield: 1.1, debtToEquity: 0.1, high52w: 120.00, low52w: 65.00 },
    { symbol: "TM", name: "Toyota Motor", type: "STOCK", sector: "Consumer Discretionary", price: 215.80, change24h: -1.2, volume24h: 2.1, marketCap: 310, currency: "USD", country: "Global", peRatio: 9.5, roe: 12.4, dividendYield: 2.5, debtToEquity: 1.1, high52w: 220.00, low52w: 135.00 },
    { symbol: "BABA", name: "Alibaba", type: "STOCK", sector: "Consumer Discretionary", price: 85.40, change24h: -2.5, volume24h: 15.2, marketCap: 215, currency: "USD", country: "Global", peRatio: 14.2, roe: 12.5, dividendYield: 1.2, debtToEquity: 0.15, high52w: 120.00, low52w: 70.00 },
    
    // Crypto List
    { symbol: "BTC", name: "Bitcoin", type: "CRYPTO", sector: "Layer 1", price: 65420.00, change24h: 2.5, volume24h: 35000, marketCap: 1280, currency: "USD", country: "Global", high52w: 73700.00, low52w: 25000.00 },
    { symbol: "ETH", name: "Ethereum", type: "CRYPTO", sector: "Smart Contracts", price: 3450.20, change24h: 1.8, volume24h: 15000, marketCap: 415, currency: "USD", country: "Global", high52w: 4090.00, low52w: 1500.00 },
    { symbol: "SOL", name: "Solana", type: "CRYPTO", sector: "Layer 1", price: 145.60, change24h: 5.2, volume24h: 4500, marketCap: 65, currency: "USD", country: "Global", high52w: 210.00, low52w: 15.00 },
    { symbol: "BNB", name: "BNB", type: "CRYPTO", sector: "Exchange Token", price: 580.40, change24h: -1.5, volume24h: 1800, marketCap: 88, currency: "USD", country: "Global", high52w: 690.00, low52w: 205.00 },
    { symbol: "XRP", name: "XRP", type: "CRYPTO", sector: "Payments", price: 0.55, change24h: 0.2, volume24h: 800, marketCap: 30, currency: "USD", country: "Global", high52w: 0.95, low52w: 0.40 },
    { symbol: "ADA", name: "Cardano", type: "CRYPTO", sector: "Layer 1", price: 0.45, change24h: -2.1, volume24h: 350, marketCap: 16, currency: "USD", country: "Global", high52w: 0.85, low52w: 0.22 },
    { symbol: "AVAX", name: "Avalanche", type: "CRYPTO", sector: "Layer 1", price: 35.20, change24h: 4.5, volume24h: 650, marketCap: 13, currency: "USD", country: "Global", high52w: 65.00, low52w: 8.50 },
    { symbol: "DOGE", name: "Dogecoin", type: "CRYPTO", sector: "Meme", price: 0.15, change24h: 8.4, volume24h: 2100, marketCap: 22, currency: "USD", country: "Global", high52w: 0.22, low52w: 0.05 },
    { symbol: "LINK", name: "Chainlink", type: "CRYPTO", sector: "Oracle", price: 18.20, change24h: 1.1, volume24h: 520, marketCap: 10, currency: "USD", country: "Global", high52w: 22.00, low52w: 5.50 },
    { symbol: "UNI", name: "Uniswap", type: "CRYPTO", sector: "DeFi", price: 7.50, change24h: -3.5, volume24h: 250, marketCap: 4.5, currency: "USD", country: "Global", high52w: 12.00, low52w: 3.50 },
    { symbol: "SHIB", name: "Shiba Inu", type: "CRYPTO", sector: "Meme", price: 0.00003, change24h: 12.5, volume24h: 1500, marketCap: 17, currency: "USD", country: "Global", high52w: 0.000045, low52w: 0.000005 },
    { symbol: "MATIC", name: "Polygon", type: "CRYPTO", sector: "Layer 2", price: 0.85, change24h: 3.2, volume24h: 450, marketCap: 8, currency: "USD", country: "Global", high52w: 1.25, low52w: 0.50 },
    { symbol: "DOT", name: "Polkadot", type: "CRYPTO", sector: "Layer 1", price: 7.10, change24h: 0.5, volume24h: 180, marketCap: 9, currency: "USD", country: "Global", high52w: 11.50, low52w: 3.80 },
    { symbol: "LTC", name: "Litecoin", type: "CRYPTO", sector: "Payments", price: 82.50, change24h: 1.2, volume24h: 340, marketCap: 6, currency: "USD", country: "Global", high52w: 115.00, low52w: 58.00 },
    { symbol: "ATOM", name: "Cosmos", type: "CRYPTO", sector: "Layer 1", price: 10.20, change24h: -1.5, volume24h: 120, marketCap: 4, currency: "USD", country: "Global", high52w: 15.00, low52w: 6.50 },
    { symbol: "NEAR", name: "NEAR Protocol", type: "CRYPTO", sector: "Layer 1", price: 6.40, change24h: 4.8, volume24h: 210, marketCap: 6.5, currency: "USD", country: "Global", high52w: 8.50, low52w: 1.20 }
];
