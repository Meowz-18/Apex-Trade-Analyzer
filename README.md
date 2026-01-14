# Apex Trade Analyzer

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**Apex Trade Analyzer** is an institutional-grade AI trading platform designed to democratize advanced market analysis. It combines real-time data visualization, dual-model AI reasoning (Gemini & Llama), and a powerful visual backtester into a single, cohesive interface.

## 🚀 Key Features

### 1. Quantum Hero Landing Experience
A visually immersive entry point featuring:
- **3D Parallax Effects**: Interactive background elements that respond to mouse movement and scroll.
- **Decrypted Text Animation**: "Predict The Unseen Future" headline effect.
- **Real-Time Market Ticker**: A scrolling marquee displaying live price updates for Crypto, Forex, and Commodities with a "count-up" animation effect.
- **Launch Console**: Direct access to the analytical dashboard.

### 2. AI Market Analyzer
Get a "second opinion" on any asset before you trade.
- **Dual-Model Intelligence**: Simultaneously queries **Google Gemini** and **Meta Llama 3** to provide contrasting perspectives (e.g., one might be bullish based on technicals, the other bearish based on macro).
- **Sentiment Analysis**: Aggregates fear/greed metrics from news sources.
- **Interactive Chat**: Ask follow-up questions to specific models directly from the comparison cards.

### 3. Visual Strategy Backtester
Simulate trading strategies without writing code.
- **No-Code Builder**: Construct complex entry/exit rules using a simple UI (e.g., "RSI < 30" AND "Price crosses above SMA 50").
- **Instant Simulation**: Run backtests on historical data in milliseconds.
- **Deep Analytics**: View equity curves, monthly PnL breakdowns, max drawdown, and win rates.
- **AI Strategy Interpreter**: Type a strategy in plain English (e.g., "Buy when RSI is low"), and the AI will convert it into executable logic.

### 4. Real-Time Market Data
- **Hybrid Data Proxy**: Seamlessly switches between Binance (for speed) and CoinGecko (for breadth) APIs.
- **Unified Interface**: Normalizes data across different asset classes (Crypto, Stocks, Forex) for consistent charting.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **3D Visuals**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18.17 or later

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Meowz-18/Apex-Trade-Analyzer.git
    cd Apex-Trade-Analyzer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    # Required for AI Features
    GEMINI_API_KEY=your_gemini_key_here
    GROQ_API_KEY=your_groq_key_here # For Llama model support
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Architecture Overview

- **`/app`**: Next.js App Router pages and API endpoints.
    - **`/api/market-proxy`**: Server-side route to fetch and cache third-party market data.
- **`/components`**: Reusable UI building blocks.
    - **`/analyzer`**: Components specific to the dashboard (TokenStats, ModelComparison).
    - **`/backtest`**: Strategy builder and result visualization components.
    - **`/landing`**: Hero section and marketing feature blocks.
- **`/lib`**: Utility functions and shared services.
    - **`marketService.ts`**: Core logic for fetching and normalizing candle data.
    - **`backtestService.ts`**: The engine responsible for running strategy simulations.

## 🔮 Future Roadmap

- [ ] **User Authentication**: Save strategies and analysis history to user profiles.
- [ ] **Live Execution**: Connect to exchange APIs (Binance/Coinbase) to execute trades directly from the analyzer.
- [ ] **Portfolio Tracking**: Real-time PnL tracking for connected wallets.

---

Built with ❤️ by the Apex Team.
