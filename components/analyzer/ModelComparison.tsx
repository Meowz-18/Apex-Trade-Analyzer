"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Zap, MessageSquare } from "lucide-react";
import { ChatDialog } from "./ChatDialog";

interface ModelResult {
    modelName: string;
    signal: "BUY" | "SELL" | "HOLD";
    confidence: string;
    reasoning: string;
}

interface ModelComparisonProps {
    modelA: ModelResult;
    modelB: ModelResult;
    symbol: string;
    currentPrice: number;
}

export function ModelComparison({ modelA, modelB, symbol, currentPrice }: ModelComparisonProps) {
    const [activeChat, setActiveChat] = useState<{ model: string; symbol: string } | null>(null);

    return (
        <>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Model A: Gemini */}
                <ModelCard
                    result={modelA}
                    icon={Bot}
                    colorClass="border-blue-500/30 bg-blue-500/5"
                    iconColor="text-blue-400"
                    onChat={() => setActiveChat({ model: modelA.modelName, symbol })}
                />

                {/* Model B: Llama */}
                <ModelCard
                    result={modelB}
                    icon={Zap}
                    colorClass="border-purple-500/30 bg-purple-500/5"
                    iconColor="text-purple-400"
                    onChat={() => setActiveChat({ model: modelB.modelName, symbol })}
                />
            </div>

            <ChatDialog
                isOpen={!!activeChat}
                onClose={() => setActiveChat(null)}
                modelName={activeChat?.model || ""}
                symbol={activeChat?.symbol || "Asset"}
                currentPrice={currentPrice}
            />
        </>
    );
}

function ModelCard({
    result,
    icon: Icon,
    colorClass,
    iconColor,
    onChat
}: {
    result: ModelResult;
    icon: any;
    colorClass: string;
    iconColor: string;
    onChat: () => void;
}) {
    const isBuy = result.signal === "BUY";
    const isSell = result.signal === "SELL";

    const signalColor = isBuy ? "text-green-400" : isSell ? "text-red-400" : "text-yellow-400";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl border p-6 backdrop-blur-sm ${colorClass} flex flex-col h-full`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                    <h3 className="font-bold text-lg text-foreground">{result.modelName}</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-2xl font-black tracking-tighter ${signalColor}`}>{result.signal}</span>
                    <span className="text-xs font-medium text-muted-foreground">{result.confidence} Confidence</span>
                </div>
            </div>

            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line space-y-2 font-mono flex-1">
                {result.reasoning}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <button
                    onClick={onChat}
                    className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${result.modelName.includes("Sentiment")
                        ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20"
                        : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        }`}
                >
                    <MessageSquare className="h-4 w-4" />
                    Ask {result.modelName.split(" ")[0]}
                </button>
            </div>
        </motion.div>
    );
}
