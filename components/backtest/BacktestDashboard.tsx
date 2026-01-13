"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ManualStrategyForm } from "./ManualStrategyForm";
import { AIStrategyChat } from "./AIStrategyChat";
import { BacktestResults } from "./BacktestResults";
import { StrategyConfig, BacktestResult, BacktestService, Rule } from "@/lib/services/backtestService";
import { Candle } from "@/lib/services/marketService";
import { PRE_BACKTESTED_STRATEGIES } from "@/lib/data/strategies";
import { Loader2, Zap, BrainCircuit, Activity, Search, BarChart3, Globe, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Target } from "lucide-react";

// Generic fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BacktestDashboardProps {
    marketData: Candle[];
}

export function BacktestDashboard({ marketData: initialData }: BacktestDashboardProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<BacktestResult | null>(null);
    const [activeTab, setActiveTab] = useState("manual");
    const [strategyToEdit, setStrategyToEdit] = useState<StrategyConfig | undefined>(undefined);

    // Data Selection State
    const [symbol, setSymbol] = useState("BTC");
    const [assetType, setAssetType] = useState("CRYPTO");
    const [timeframe, setTimeframe] = useState("3M");

    // Fetch dynamic history
    const { data: fetchedData, isLoading, error } = useSWR<Candle[]>(
        `/api/market/history?symbol=${symbol}&type=${assetType}&range=${timeframe}`,
        fetcher,
        {
            fallbackData: (symbol === "BTC" && timeframe === "3M") ? initialData : undefined,
            revalidateOnFocus: false
        }
    );

    const activeData = fetchedData || [];

    // --- Helper Parser for "Verified Strategies" ---
    const parseStrategyToConfig = (strategyData: typeof PRE_BACKTESTED_STRATEGIES[0]): StrategyConfig => {
        const rules: { entry: Rule[], exit: Rule[] } = { entry: [], exit: [] };

        const parseCondition = (cond: string): Rule | null => {
            let clean = cond.replace("Buy:", "").replace("Sell:", "").trim();
            let comparator: Rule["comparator"] = ">";
            if (clean.includes("crosses above")) comparator = "CROSS_ABOVE";
            else if (clean.includes("crosses below")) comparator = "CROSS_BELOW";
            else if (clean.includes("<")) comparator = "<";
            else if (clean.includes(">")) comparator = ">";

            const splitKey = comparator === "CROSS_ABOVE" ? "crosses above" :
                comparator === "CROSS_BELOW" ? "crosses below" : comparator;

            const parts = clean.split(splitKey);
            if (parts.length < 2) return null;

            const parseIndicator = (str: string): any => {
                str = str.trim();
                const matchInd = str.match(/(SMA|EMA|RSI)\((\d+)\)/i);
                if (matchInd) return { type: matchInd[1].toUpperCase(), period: parseInt(matchInd[2]) };
                if (/price/i.test(str)) return { type: "PRICE" };
                if (!isNaN(parseFloat(str))) return { type: "RSI", value: parseFloat(str) };
                return { type: "PRICE" };
            };

            const indA = parseIndicator(parts[0]);
            const indB = parseIndicator(parts[1]);
            if (indB.value !== undefined) indB.type = indA.type;

            return { indicatorA: indA, comparator, indicatorB: indB };
        };

        strategyData.conditions.forEach(cond => {
            const rule = parseCondition(cond);
            if (rule) {
                if (cond.startsWith("Buy:")) rules.entry.push(rule);
                if (cond.startsWith("Sell:")) rules.exit.push(rule);
            }
        });

        let sl = 2; let tp = 6;
        if (strategyData.riskReward.includes(":")) {
            const ratio = parseFloat(strategyData.riskReward.split(":")[1]);
            if (!isNaN(ratio)) tp = sl * ratio;
        }

        return {
            entryRules: rules.entry.length > 0 ? rules.entry : [],
            exitRules: rules.exit,
            stopLossPercent: sl,
            takeProfitPercent: tp
        };
    };

    const [aiContext, setAiContext] = useState<string | undefined>(undefined);

    useEffect(() => {
        const handleStrategySelect = () => {
            const params = new URLSearchParams(window.location.search);
            const strategyId = params.get("strategy");
            if (strategyId) {
                const strategy = PRE_BACKTESTED_STRATEGIES.find(s => s.id === strategyId);
                if (strategy) {
                    if (activeTab === "ai") {
                        const context = `${strategy.name}\n${strategy.conditions.join("\n")}\nStop Loss: ${strategy.stopLossPercent}% | Take Profit: ${strategy.takeProfitPercent}%`;
                        setAiContext(context);
                    } else {
                        const newConfig = parseStrategyToConfig(strategy);
                        setStrategyToEdit(newConfig);
                        setActiveTab("manual");
                    }
                }
            }
        };
        window.addEventListener("strategy-selected", handleStrategySelect);
        handleStrategySelect();
        return () => window.removeEventListener("strategy-selected", handleStrategySelect);
    }, [activeTab]);

    const runBacktest = async (strategy: StrategyConfig) => {
        setIsRunning(true);
        setResult(null);
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            const res = BacktestService.runBacktest(activeData, strategy); // Use activeData
            setResult(res);
        } catch (error) {
            console.error("Backtest failed", error);
        } finally {
            setIsRunning(false);
        }
    };

    const handleEditStrategy = (strategy: StrategyConfig) => {
        setStrategyToEdit(strategy);
        setActiveTab("manual");
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/30">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-background to-background dark:from-indigo-900/40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-20 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 py-8 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 dark:from-white dark:via-white/80 dark:to-white/50">
                            Strategy Lab <span className="text-primary text-2xl align-top">BETA</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Design. Simulate. Dominate.
                        </p>
                    </div>

                    {/* Data Control Bar */}
                    <div className="flex items-center gap-2 bg-card/60 backdrop-blur-md p-2 rounded-xl border border-border/50 shadow-lg">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                placeholder="Symbol (e.g. BTC)"
                                className="w-32 pl-9 bg-background/50 border-0 focus-visible:ring-1"
                            />
                        </div>
                        <Select value={assetType} onValueChange={setAssetType}>
                            <SelectTrigger className="w-[110px] bg-background/50 border-0 focus:ring-1">
                                <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CRYPTO">Crypto</SelectItem>
                                <SelectItem value="STOCK">Stock</SelectItem>
                                <SelectItem value="INDEX">Index</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={timeframe} onValueChange={setTimeframe}>
                            <SelectTrigger className="w-[90px] bg-background/50 border-0 focus:ring-1">
                                <BarChart3 className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1M">1 Mo</SelectItem>
                                <SelectItem value="3M">3 Mo</SelectItem>
                                <SelectItem value="6M">6 Mo</SelectItem>
                                <SelectItem value="1Y">1 Yr</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="px-3 py-2 text-xs font-mono text-muted-foreground border-l border-border/50">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                                <span>{activeData.length} pts</span>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8 flex-1 min-h-0">
                    {/* Left Panel: Control Station */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-5 flex flex-col h-full"
                    >
                        <div className="flex-1 bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl relative overflow-hidden group flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none dark:from-white/5" />
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                                <div className="p-6 pb-2">
                                    <TabsList className="w-full grid grid-cols-2 mb-2 bg-muted/50 border border-border/50 p-1 rounded-xl">
                                        <TabsTrigger value="manual" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg transition-all">
                                            <Zap className="w-4 h-4 mr-2" /> Manual
                                        </TabsTrigger>
                                        <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-lg transition-all">
                                            <BrainCircuit className="w-4 h-4 mr-2" /> Neural AI
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <div className="flex-1 relative min-h-0 flex flex-col">
                                    <AnimatePresence mode="wait">
                                        <TabsContent value="manual" key="manual" className="mt-0 w-full px-6 pb-6">
                                            <ManualStrategyForm
                                                onRun={runBacktest}
                                                isRunning={isRunning}
                                                initialStrategy={strategyToEdit}
                                            />
                                        </TabsContent>
                                        <TabsContent value="ai" key="ai" className="h-[600px] mt-0 w-full flex flex-col bg-background/50 backdrop-blur-sm">
                                            <AIStrategyChat
                                                onRun={runBacktest}
                                                isRunning={isRunning}
                                                onEdit={handleEditStrategy}
                                                initialContext={aiContext}
                                            />
                                        </TabsContent>
                                    </AnimatePresence>
                                </div>
                            </Tabs>
                        </div>
                    </motion.div>

                    {/* Right Panel: Holographic Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:col-span-7 h-full"
                    >
                        <div className="h-full bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-1 relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20 dark:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" />
                            <div className="relative z-20 h-full w-full bg-background/50 rounded-[22px] overflow-hidden flex flex-col">
                                {isRunning && (
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                                        <div className="relative">
                                            <div className="h-24 w-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Activity className="h-8 w-8 text-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-bold animate-pulse text-primary">Running Simulation</h3>
                                            <p className="text-sm text-muted-foreground font-mono">
                                                Crunching {activeData?.length || 0} data points...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {!isRunning && !result && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                        <div className="w-32 h-32 bg-gradient-to-tr from-muted to-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-border/10 dark:from-gray-800 dark:to-gray-900 dark:border-white/5">
                                            <Zap className="h-12 w-12 text-gray-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground mb-2">Systems Online</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Target: <span className="text-primary font-mono">{symbol}</span> ({timeframe})
                                            <br />
                                            Initialize a strategy sequence to generate performance analytics.
                                        </p>
                                    </div>
                                )}

                                {!isRunning && result && (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        <BacktestResults result={result} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div >
        </div >
    );
}

function KpiCard({ label, value, subValue, icon: Icon, trend }: any) {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-border/80 transition-all">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                <Icon className="h-16 w-16" />
            </div>

            <div className="relative z-10">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</div>
                <div className={`text-2xl font-black tracking-tight ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-foreground"}`}>
                    {value}
                </div>
                {subValue && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        {trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                        {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                        {subValue}
                    </div>
                )}
            </div>
        </div>
    );
}
