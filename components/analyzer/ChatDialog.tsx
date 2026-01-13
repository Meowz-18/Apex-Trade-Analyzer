"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Zap, User } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    modelName: string;
    symbol: string;
    initialContext?: string;
    currentPrice: number;
}

export function ChatDialog({ isOpen, onClose, modelName, symbol, initialContext, currentPrice }: ChatDialogProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = modelName.includes("Llama")
                ? `Yo! I'm watching ${symbol} like a hawk. Price is $${currentPrice.toLocaleString()}. What's the play?`
                : `Hello. I have analyzed the technical structure of ${symbol} at $${currentPrice.toLocaleString()}. Do you have specific questions about the indicators?`;

            setMessages([{
                id: "init",
                role: "assistant",
                content: greeting
            }]);
        }
    }, [isOpen, modelName, symbol, currentPrice]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Lock body scroll when dialog is open to prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden"; // Also lock HTML to be sure
        } else {
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Delay & Response
        setTimeout(() => {
            const response = generateSimulatedResponse(input, modelName, symbol, currentPrice);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
            setIsTyping(false);
        }, 1500);
    };

    const isLlama = modelName.includes("Llama");
    const accentColor = isLlama ? "text-purple-400" : "text-cyan-400";
    const bgGradient = isLlama
        ? "bg-gradient-to-br from-purple-500/10 to-transparent"
        : "bg-gradient-to-br from-cyan-500/10 to-transparent";
    const borderColor = isLlama ? "border-purple-500/20" : "border-cyan-500/20";
    const glowColor = isLlama ? "shadow-purple-500/20" : "shadow-cyan-500/20";
    const Icon = isLlama ? Zap : Bot;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-all duration-300"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[650px] h-full md:h-[700px] bg-[#0A0A0A] border ${borderColor} md:rounded-3xl shadow-2xl ${glowColor} z-50 flex flex-col overflow-hidden ring-1 ring-white/10`}
                    >
                        {/* Header */}
                        <div className={`p-5 border-b ${borderColor} flex justify-between items-center ${bgGradient} backdrop-blur-xl relative overflow-hidden`}>
                            {/* Decorative Background Elements */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${isLlama ? "bg-purple-500/20" : "bg-cyan-500/20"} blur-[80px] rounded-full pointer-events-none`} />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isLlama ? "bg-purple-500/20 border-purple-500/30" : "bg-cyan-500/20 border-cyan-500/30"} border shadow-lg`}>
                                    <Icon className={`h-6 w-6 ${accentColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                                        {modelName}
                                        <span className="flex h-2 w-2 relative">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLlama ? "bg-purple-400" : "bg-cyan-400"} opacity-75`}></span>
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLlama ? "bg-purple-500" : "bg-cyan-500"}`}></span>
                                        </span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium tracking-wide">
                                        LIVE ANALYSIS <span className="mx-1.5 opacity-50">|</span> {symbol} <span className="mx-1.5 opacity-50">|</span> <span className="text-foreground">${currentPrice.toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground active:scale-95 duration-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth overscroll-y-contain custom-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${msg.role === "user" ? "bg-white/10 border-white/20" : `${isLlama ? "bg-purple-500/20 border-purple-500/30" : "bg-cyan-500/20 border-cyan-500/30"}`}`}>
                                        {msg.role === "user" ? <User className="h-4 w-4 text-white" /> : <Icon className={`h-4 w-4 ${accentColor}`} />}
                                    </div>

                                    <div className={`max-w-[80%] space-y-1`}>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                            ? "bg-white/10 text-white rounded-tr-none border border-white/10"
                                            : `bg-[#111] text-gray-200 border border-white/5 rounded-tl-none ${isLlama ? "shadow-purple-900/10" : "shadow-cyan-900/10"}`
                                            }`}>
                                            <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground px-1 block opacity-60">
                                            {msg.role === "assistant" ? modelName.split(" ")[0] : "You"} • Just now
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3"
                                >
                                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${isLlama ? "bg-purple-500/20 border-purple-500/30" : "bg-cyan-500/20 border-cyan-500/30"}`}>
                                        <Icon className={`h-4 w-4 ${accentColor}`} />
                                    </div>
                                    <div className={`bg-[#111] border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-12`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLlama ? "bg-purple-400" : "bg-cyan-400"}`} style={{ animationDelay: "0ms" }} />
                                        <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLlama ? "bg-purple-400" : "bg-cyan-400"}`} style={{ animationDelay: "150ms" }} />
                                        <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isLlama ? "bg-purple-400" : "bg-cyan-400"}`} style={{ animationDelay: "300ms" }} />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-5 border-t border-white/5 bg-[#0A0A0A] relative z-20">
                            <div className="relative flex items-center group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`Ask ${modelName} anything about ${symbol}...`}
                                    className={`w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-foreground focus:outline-none focus:border-opacity-50 transition-all placeholder:text-muted-foreground/40 font-medium ${isLlama ? "focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20" : "focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"}`}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className={`absolute right-2 p-2.5 rounded-xl transition-all duration-200 transform active:scale-95 ${!input.trim() || isTyping
                                        ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                                        : isLlama
                                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20"
                                            : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20"
                                        }`}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-muted-foreground/60 font-medium tracking-wide uppercase">
                                    AI-Generated Content • Not Financial Advice
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// --- Enhanced Simulation Logic ---
function generateSimulatedResponse(input: string, model: string, symbol: string, currentPrice: number): string {
    const isLlama = model.includes("Llama");
    const lowerInput = input.toLowerCase();

    // Helper for Price Formatting
    const fmt = (val: number) => val < 1 ? val.toFixed(4) : val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // 1. Support & Resistance Queries
    if (lowerInput.includes("support") || lowerInput.includes("resistance") || lowerInput.includes("level")) {
        const s1 = currentPrice * 0.95;
        const s2 = currentPrice * 0.88;
        const r1 = currentPrice * 1.08;
        const r2 = currentPrice * 1.15;

        if (isLlama) {
            return `Yo, here's the alpha on levels:\n\n🚀 Resistance: $${fmt(r1)} (Break this and we fly)\n🛡️ Support: $${fmt(s1)} (Load the boat zone)\n\nIf we dip to $${fmt(s2)}, it's liquidation city. Stay safe.`;
        }
        return `Based on Fibonacci retracement and volume profile:\n\nKey Resistance Levels:\n• R1: $${fmt(r1)} (200 MA)\n• R2: $${fmt(r2)} (Weekly High)\n\nKey Support Levels:\n• S1: $${fmt(s1)} (0.618 Fib)\n• S2: $${fmt(s2)} (Demand Zone)\n\nThe trend remains valid as long as S1 holds.`;
    }

    // 2. Entry / SL / TP Queries
    if (
        lowerInput.includes("entry") || lowerInput.includes("price") ||
        lowerInput.includes("sl") || lowerInput.includes("stop") ||
        lowerInput.includes("tp") || lowerInput.includes("target") || lowerInput.includes("profit")
    ) {
        const entryLow = currentPrice * 0.99;
        const entryHigh = currentPrice * 1.01;
        const stopLoss = currentPrice * 0.94;
        const takeProfit1 = currentPrice * 1.12;
        const takeProfit2 = currentPrice * 1.25;

        if (isLlama) {
            return `🔥 Degen Setup for ${symbol}:\n\n🎯 Entry: $${fmt(entryLow)} - $${fmt(entryHigh)}\n🛑 SL: $${fmt(stopLoss)} (Don't be a bagholder)\n💰 TP1: $${fmt(takeProfit1)}\n🚀 TP2: $${fmt(takeProfit2)}\n\nRisk/Reward is 1:3. Send it based on your own risk tolerance tho. NFA.`;
        }
        return `Here is a calculated trade setup based on current volatility:\n\nEntry Range: $${fmt(entryLow)} - $${fmt(entryHigh)}\n\nStop Loss (SL): $${fmt(stopLoss)} (Below recent swing low)\n\nTake Profit (TP):\n1. Target 1: $${fmt(takeProfit1)} (Conservative)\n2. Target 2: $${fmt(takeProfit2)} (Extension)\n\nRecommended position size: 2-3% of equity to manage risk effectively.`;
    }

    // 3. General Buy/Sell/Long/Short
    if (lowerInput.includes("buy") || lowerInput.includes("long")) {
        if (isLlama) return `Send it. Whales are accumulating ${symbol} aggressively. Wait for a retest of $${fmt(currentPrice * 0.98)} though.`;
        return `Technical indicators suggest caution. ${symbol} is approaching resistance at $${fmt(currentPrice * 1.05)}. I recommend waiting for a confirmed breakout above that level with volume support.`;
    }
    if (lowerInput.includes("sell") || lowerInput.includes("short")) {
        if (isLlama) return `Nah, don't fade the momentum on ${symbol} yet. Funding is still neutral. Let it cook until $${fmt(currentPrice * 1.1)}.`;
        return `RSI is overbought. A reversion to the mean of $${fmt(currentPrice * 0.9)} is statistically probable. Short-term bearish divergence is visible on the 4H chart.`;
    }

    // 4. Default / Fallback
    if (isLlama) {
        if (lowerInput.includes("risk")) return `High risk, high reward. Only APEX chads survive this volatility.`;
        return `Markets are weird rn. I'm seeing mixed signals on-chain for ${symbol} at $${fmt(currentPrice)}. Probably chop city for a bit. Ask me for 'levels' or a 'setup'.`;
    } else {
        return `I am analyzing the latest price action for ${symbol} ($${fmt(currentPrice)}). Currently, the trend is neutral. \n\nYou can ask me for:\n- Support & Resistance Levels\n- Trade Setups (Entry, SL, TP)\n- Momentum Analysis`;
    }
}
