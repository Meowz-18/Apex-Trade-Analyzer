"use client";

import { useState, useEffect } from "react";
import { Plus, Play, Trash2 } from "lucide-react";
import { StrategyConfig, Rule, IndicatorConfig } from "@/lib/services/backtestService";

interface ManualStrategyFormProps {
    onRun: (strategy: StrategyConfig) => void;
    isRunning: boolean;
    initialStrategy?: StrategyConfig;
}

const DEFAULT_INDICATOR: IndicatorConfig = { type: "RSI", period: 14 };
const DEFAULT_RULE: Rule = {
    indicatorA: { type: "RSI", period: 14 },
    comparator: "<",
    indicatorB: { type: "PRICE", value: 30 } // Using value for constant
};

export function ManualStrategyForm({ onRun, isRunning, initialStrategy }: ManualStrategyFormProps) {
    const [entryRules, setEntryRules] = useState<Rule[]>([DEFAULT_RULE]);
    const [exitRules, setExitRules] = useState<Rule[]>([]);
    const [stopLoss, setStopLoss] = useState(2);
    const [takeProfit, setTakeProfit] = useState(4);

    useEffect(() => {
        if (initialStrategy) {
            setEntryRules(initialStrategy.entryRules);
            setExitRules(initialStrategy.exitRules);
            setStopLoss(initialStrategy.stopLossPercent ?? 2);
            setTakeProfit(initialStrategy.takeProfitPercent ?? 4);
        }
    }, [initialStrategy]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRun({
            entryRules,
            exitRules, // Now passing configured exit rules
            stopLossPercent: stopLoss,
            takeProfitPercent: takeProfit
        });
    };

    const addRule = (section: "entry" | "exit") => {
        if (section === "entry") setEntryRules([...entryRules, { ...DEFAULT_RULE }]);
        else setExitRules([...exitRules, { ...DEFAULT_RULE }]);
    };

    const removeRule = (section: "entry" | "exit", idx: number) => {
        if (section === "entry") setEntryRules(entryRules.filter((_, i) => i !== idx));
        else setExitRules(exitRules.filter((_, i) => i !== idx));
    };

    const updateRule = (section: "entry" | "exit", idx: number, field: keyof Rule, value: string | number | IndicatorConfig | undefined) => {
        const rules = section === "entry" ? [...entryRules] : [...exitRules];
        rules[idx] = { ...rules[idx], [field]: value };
        if (section === "entry") setEntryRules(rules);
        else setExitRules(rules);
    };

    const updateIndicator = (section: "entry" | "exit", ruleIdx: number, side: "indicatorA" | "indicatorB", field: keyof IndicatorConfig, value: string | number | undefined) => {
        const rules = section === "entry" ? [...entryRules] : [...exitRules];
        const currentInd = rules[ruleIdx][side];

        rules[ruleIdx] = {
            ...rules[ruleIdx],
            [side]: { ...currentInd, [field]: value }
        };

        if (section === "entry") setEntryRules(rules);
        else setExitRules(rules);
    };

    const renderRuleList = (rules: Rule[], section: "entry" | "exit") => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    {section === "entry" ? "Entry (Buy) Conditions" : "Exit (Sell) Conditions"}
                </h3>
                <button type="button" onClick={() => addRule(section)} className="text-xs flex items-center gap-1 text-primary hover:text-primary/80">
                    <Plus className="h-3 w-3" /> Add Rule
                </button>
            </div>

            {rules.length === 0 && section === "exit" && (
                <div className="text-xs text-muted-foreground italic p-2 border border-dashed border-border/50 rounded-xl text-center">
                    No exit rules. Exits will rely on SL/TP only.
                </div>
            )}

            {rules.map((rule, idx) => (
                <div key={idx} className="p-4 bg-muted/30 border border-border/50 rounded-2xl space-y-4 relative group hover:border-primary/40 transition-all hover:bg-muted/50 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10">
                    <button
                        type="button"
                        onClick={() => removeRule(section, idx)}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>

                    {/* Left Side (Indicator A) */}
                    <div className="flex gap-3 flex-1">
                        <div className="relative w-full">
                            <select
                                className="w-full bg-card border border-input rounded-xl px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none appearance-none hover:bg-accent transition-colors dark:bg-card dark:border-white/10 dark:hover:bg-accent/50"
                                value={rule.indicatorA.type}
                                onChange={(e) => updateIndicator(section, idx, "indicatorA", "type", e.target.value)}
                            >
                                <option value="RSI">RSI</option>
                                <option value="SMA">SMA</option>
                                <option value="EMA">EMA</option>
                                <option value="PRICE">Price</option>
                            </select>
                        </div>
                        {(rule.indicatorA.type !== "PRICE" && rule.indicatorA.value === undefined) && (
                            <input
                                type="number"
                                className="bg-background border border-input rounded-xl px-3 py-2 text-sm w-20 text-center text-foreground focus:ring-1 focus:ring-primary focus:outline-none dark:bg-black/40 dark:border-white/10"
                                value={rule.indicatorA.period || ""}
                                placeholder="14"
                                onChange={(e) => updateIndicator(section, idx, "indicatorA", "period", e.target.value === "" ? 0 : parseInt(e.target.value))}
                            />
                        )}
                    </div>

                    {/* Comparator */}
                    <div className="flex justify-center">
                        <select
                            className="bg-card text-primary font-bold border border-border/50 rounded-lg text-sm px-4 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none appearance-none text-center hover:bg-accent transition-colors cursor-pointer dark:bg-card dark:border-white/5 dark:hover:bg-accent/50"
                            value={rule.comparator}
                            onChange={(e) => updateRule(section, idx, "comparator", e.target.value)}
                        >
                            <option value=">">&gt; (Above)</option>
                            <option value="<">&lt; (Below)</option>
                            <option value="CROSS_ABOVE">Crosses Above</option>
                            <option value="CROSS_BELOW">Crosses Below</option>
                        </select>
                    </div>

                    {/* Right Side (Indicator B - can be value) */}
                    <div className="flex gap-3 flex-1">
                        <div className="flex items-center gap-2 w-full">
                            <select
                                className="bg-card border border-input rounded-xl px-3 py-2 text-sm w-28 text-foreground focus:ring-1 focus:ring-primary focus:outline-none appearance-none hover:bg-accent transition-colors dark:bg-card dark:border-white/10 dark:hover:bg-accent/50"
                                value={rule.indicatorB.value !== undefined ? "VALUE" : rule.indicatorB.type}
                                onChange={(e) => {
                                    if (e.target.value === "VALUE") {
                                        updateIndicator(section, idx, "indicatorB", "value", 50);
                                        updateIndicator(section, idx, "indicatorB", "period", undefined);
                                    } else {
                                        updateIndicator(section, idx, "indicatorB", "value", undefined);
                                        updateIndicator(section, idx, "indicatorB", "type", e.target.value);
                                        updateIndicator(section, idx, "indicatorB", "period", 14);
                                    }
                                }}
                            >
                                <option value="VALUE">Value</option>
                                <option value="RSI">RSI</option>
                                <option value="SMA">SMA</option>
                                <option value="EMA">EMA</option>
                                <option value="PRICE">Price</option>
                            </select>

                            {rule.indicatorB.value !== undefined ? (
                                <input
                                    type="number"
                                    className="bg-background border border-input rounded-xl px-3 py-2 text-sm w-full text-foreground focus:ring-1 focus:ring-primary focus:outline-none dark:bg-black/40 dark:border-white/10"
                                    value={rule.indicatorB.value !== undefined ? rule.indicatorB.value : ""}
                                    onChange={(e) => updateIndicator(section, idx, "indicatorB", "value", e.target.value === "" ? 0 : parseFloat(e.target.value))}
                                />
                            ) : (
                                <input
                                    type="number"
                                    className="bg-background border border-input rounded-xl px-3 py-2 text-sm w-full text-foreground focus:ring-1 focus:ring-primary focus:outline-none dark:bg-black/40 dark:border-white/10"
                                    value={rule.indicatorB.period || ""}
                                    placeholder="14"
                                    onChange={(e) => updateIndicator(section, idx, "indicatorB", "period", e.target.value === "" ? 0 : parseInt(e.target.value))}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {renderRuleList(entryRules, "entry")}

            <div className="border-t border-border/50 pt-4">
                {renderRuleList(exitRules, "exit")}
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Risk Management</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Stop Loss (%)</label>
                        <input
                            type="number"
                            className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                            value={stopLoss || ""}
                            onChange={(e) => setStopLoss(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Take Profit (%)</label>
                        <input
                            type="number"
                            className="w-full bg-background border border-input rounded-xl px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                            value={takeProfit || ""}
                            onChange={(e) => setTakeProfit(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isRunning}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                <Play className="h-4 w-4 fill-current" />
                {isRunning ? "Running Simulation..." : "Run Backtest"}
            </button>
        </form>
    );
}
