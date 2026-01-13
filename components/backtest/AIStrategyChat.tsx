"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CheckCircle2, ChevronRight, Play, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StrategyConfig, Rule, IndicatorConfig } from "@/lib/services/backtestService";

interface AIStrategyChatProps {
    onRun: (strategy: StrategyConfig) => void;
    isRunning: boolean;
    onEdit: (strategy: StrategyConfig) => void;
    initialContext?: string; // New prop for injecting strategy description
}

interface Message {
    id: string;
    role: "assistant" | "user";
    content: string;
    proposedStrategy?: StrategyConfig; // Only for assistant confirmation messages
}

export function AIStrategyChat({ onRun, isRunning, onEdit, initialContext }: AIStrategyChatProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([{
        id: "init",
        role: "assistant",
        content: "Describe your trading strategy, and I'll configure the engine for you. \n\nExample: 'Buy when RSI is below 30 and sells when RSI crosses above 70.'"
    }]);

    // Effect to handle initial context injection
    useEffect(() => {
        if (initialContext) {
            setMessages(prev => [
                ...prev,
                { id: "context-user", role: "user", content: `I want to test this strategy: ${initialContext}` }
            ]);
            // Auto-trigger analysis for the injected context
            setIsTyping(true);
            setTimeout(() => {
                const strategy = parseStrategyFromText(initialContext);
                const responseMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: strategy
                        ? `I've loaded the strategy rules for "${initialContext.split('\n')[0]}". You can confirm or refine them below.`
                        : "I tried to parse the loaded strategy but need some clarification.",
                    proposedStrategy: strategy || undefined
                };
                setMessages(prev => [...prev, responseMsg]);
                setIsTyping(false);
            }, 1000);
        }
    }, [initialContext]);

    // Reset messages if context cleared? No, keeps history.

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Thinking
        setTimeout(() => {
            const strategy = parseStrategyFromText(userMsg.content);
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: strategy
                    ? `I've interpreted your strategy. Please confirm the rules below before we start the simulation.`
                    : "I couldn't quite catch the specific rules. Could you specify indicators (like RSI, SMA) and conditions (like 'above', 'crosses')?",
                proposedStrategy: strategy || undefined
            };
            setMessages(prev => [...prev, responseMsg]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar overscroll-contain" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${msg.role === "assistant" ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-foreground"}`}>
                            {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={`max-w-[85%] space-y-2`}>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" : "bg-card border border-border rounded-tl-none shadow-sm"}`}>
                                {msg.content}
                            </div>

                            {/* Strategy Confirmation Card */}
                            {msg.proposedStrategy && (
                                <StrategyConfirmationCard
                                    strategy={msg.proposedStrategy}
                                    onConfirm={() => onRun(msg.proposedStrategy!)}
                                    onEdit={() => onEdit(msg.proposedStrategy!)}
                                    isRunning={isRunning}
                                />
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border bg-primary/10 border-primary/20 text-primary">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none flex items-center gap-1 h-10 w-16 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 flex gap-3 items-end mt-auto justify-center">
                <div className="relative flex-1 max-w-3xl flex items-end gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden p-2 pl-6 shadow-2xl ring-1 ring-white/5 transition-all focus-within:ring-primary/50 focus-within:bg-black/60 focus-within:border-primary/30">
                    <textarea
                        className="flex-1 bg-transparent border-none focus:ring-0 px-0 py-3.5 text-sm text-white placeholder:text-muted-foreground/50 resize-none min-h-[52px] max-h-[120px] custom-scrollbar focus:outline-none"
                        placeholder="Describe your strategy here..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e as any);
                            }
                        }}
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="h-[44px] w-[44px] mb-0 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
}

function StrategyConfirmationCard({ strategy, onConfirm, onEdit, isRunning }: { strategy: StrategyConfig, onConfirm: () => void, onEdit: () => void, isRunning: boolean }) {
    const [confirmed, setConfirmed] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4 space-y-3 w-full max-w-sm shadow-sm"
        >
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="h-3 w-3" /> Proposed Configuration
            </div>

            <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Entry Rules:</div>
                {strategy.entryRules.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-mono bg-muted/50 p-2 rounded-xl border border-border">
                        <span className="text-yellow-400">{r.indicatorA.type}{r.indicatorA.period && `(${r.indicatorA.period})`}</span>
                        <span className="text-muted-foreground">{r.comparator}</span>
                        <span className="text-blue-400">
                            {r.indicatorB.value !== undefined ? r.indicatorB.value : `${r.indicatorB.type}(${r.indicatorB.period})`}
                        </span>
                    </div>
                ))}

                {strategy.exitRules.length > 0 && (
                    <>
                        <div className="text-xs text-muted-foreground mt-2">Exit Rules:</div>
                        {strategy.exitRules.map((r, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-mono bg-muted/50 p-2 rounded-xl border border-border">
                                <span className="text-red-400">{r.indicatorA.type}{r.indicatorA.period && `(${r.indicatorA.period})`}</span>
                                <span className="text-muted-foreground">{r.comparator}</span>
                                <span className="text-blue-400">
                                    {r.indicatorB.value !== undefined ? r.indicatorB.value : `${r.indicatorB.type}(${r.indicatorB.period})`}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                <span>SL: {strategy.stopLossPercent}%</span>
                <span>TP: {strategy.takeProfitPercent}%</span>
            </div>

            {!confirmed ? (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={onEdit}
                        disabled={isRunning}
                        className="flex-1 bg-muted/50 hover:bg-muted text-muted-foreground border border-border py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                        <Edit2 className="h-3 w-3" /> Edit
                    </button>
                    <button
                        onClick={() => { setConfirmed(true); onConfirm(); }}
                        disabled={isRunning}
                        className="flex-[2] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                        {isRunning ? "Running..." : "Confirm & Run"} <ChevronRight className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <div className="w-full mt-2 bg-green-500/10 text-green-500 border border-green-500/20 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-3 w-3" /> Simulation Started
                </div>
            )}
        </motion.div>
    );
}

// --- Primitive NLP Parser --- 
// --- Better NLP Parser with Presets --- 
// --- Helper to parse rules from a text segment ---
function extractRulesFromSegment(segment: string): Rule[] {
    const rules: Rule[] = [];
    const lower = segment.toLowerCase();

    // Pattern: "RSI < 30"
    if (lower.includes("rsi") && (lower.includes("below") || lower.includes("<"))) {
        const valMatch = lower.match(/(?:below|<)\s*(\d+)/) || lower.match(/(\d+)/);
        const val = valMatch && valMatch[1] ? parseInt(valMatch[1]) : (valMatch ? parseInt(valMatch[0]) : 30);

        rules.push({
            indicatorA: { type: "RSI", period: 14 },
            comparator: "<",
            indicatorB: { type: "PRICE", value: val }
        });
    }

    // Pattern: "RSI > 70"
    if (lower.includes("rsi") && (lower.includes("above") || lower.includes(">") || lower.includes("crosses above"))) {
        const valMatch = lower.match(/(?:above|>)\s*(\d+)/) || lower.match(/(\d+)/);
        const val = valMatch && valMatch[1] ? parseInt(valMatch[1]) : 70;

        rules.push({
            indicatorA: { type: "RSI", period: 14 },
            comparator: ">",
            indicatorB: { type: "PRICE", value: val }
        });
    }

    // Pattern: "SMA Cross"
    if ((lower.includes("price") || lower.includes("close")) && lower.includes("sma")) {
        const smaPeriodMatch = lower.match(/sma\s*(\d+)/) || lower.match(/(\d+)\s*sma/);
        const period = smaPeriodMatch ? parseInt(smaPeriodMatch[1]) : 50;

        if (lower.includes("above") || lower.includes("crosses above")) {
            rules.push({
                indicatorA: { type: "PRICE" },
                comparator: lower.includes("cross") ? "CROSS_ABOVE" : ">",
                indicatorB: { type: "SMA", period }
            });
        }
    }

    return rules;
}

function parseStrategyFromText(text: string): StrategyConfig | null {
    const lower = text.toLowerCase();

    // 1. Detect Complex/Optimization Requests -> Return High Performance Preset
    if (
        lower.includes("multiple strategy") ||
        lower.includes("win rate") ||
        lower.includes("best strategy") ||
        lower.includes("optimize") ||
        lower.includes("top two")
    ) {
        return {
            entryRules: [
                { indicatorA: { type: "RSI", period: 14 }, comparator: "<", indicatorB: { type: "PRICE", value: 30 } },
                { indicatorA: { type: "PRICE" }, comparator: ">", indicatorB: { type: "SMA", period: 200 } }
            ],
            exitRules: [],
            stopLossPercent: 2.5,
            takeProfitPercent: 6.0
        };
    }

    // 2. Risk Management (Global Parse)
    let sl = 2;
    let tp = 4;

    const slMatch = lower.match(/(?:sl|stop loss)\s*(\d+(?:\.\d+)?)/);
    if (slMatch) sl = parseFloat(slMatch[1]);

    const tpMatch = lower.match(/(?:tp|take profit)\s*(\d+(?:\.\d+)?)/);
    if (tpMatch) tp = parseFloat(tpMatch[1]);

    const rrMatch = lower.match(/(?:rr|risk|reward|ratio).*?(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?).*?(?:rr|risk|reward|ratio)/);
    if (rrMatch) {
        const val1 = parseFloat(rrMatch[1] || rrMatch[3]);
        const val2 = parseFloat(rrMatch[2] || rrMatch[4]);
        let multiplier = 2;
        if (val1 === 1) multiplier = val2;
        else if (val2 === 1) multiplier = val1;
        else multiplier = val2 / val1;
        tp = sl * multiplier;
    }

    // 3. Segment Text into Entry vs Exit
    // Default: treat whole text as entry unless "sell" or "exit" is found
    // Split by the *first* occurrence of sell/exit keyword to define the boundary
    const splitRegex = /(?:sell|exit|close)/i;
    const splitMatch = text.match(splitRegex);

    let entryText = text;
    let exitText = "";

    if (splitMatch && splitMatch.index !== undefined) {
        // If "sell" is at the very beginning (weird but possible: "Sell when RSI > 70"), assume user implies Exit only? 
        // Or if user says "Buy when X. Sell when Y."

        // We assume the first part is Entry, second part matches Exit.
        // Exception: "Strategy: Sell when..." -> unlikely for a Long bot. 
        // We will stick to: Part 1 = Entry, Part 2 = Exit.
        entryText = text.substring(0, splitMatch.index);
        exitText = text.substring(splitMatch.index);
    }

    const entryRules = extractRulesFromSegment(entryText);
    const exitRules = extractRulesFromSegment(exitText);

    // fallback: if no entry rules found but risk vars exist, add default entry
    if (entryRules.length === 0 && (slMatch || tpMatch || rrMatch)) {
        entryRules.push({
            indicatorA: { type: "PRICE" },
            comparator: ">",
            indicatorB: { type: "SMA", period: 50 }
        });
    }

    if (entryRules.length === 0) return null;

    return {
        entryRules,
        exitRules,
        stopLossPercent: sl,
        takeProfitPercent: tp
    };
}
