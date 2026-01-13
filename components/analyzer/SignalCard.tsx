import { ShieldCheck, AlertCircle, Bot } from "lucide-react";

interface SignalCardProps {
    signal: string;
    confidence: string;
    reasoning: string;
}

export function SignalCard({ signal, confidence, reasoning }: SignalCardProps) {
    const isBuy = signal.includes("BUY");
    const isSell = signal.includes("SELL");

    return (
        <div className="relative rounded-2xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
            <div className="relative z-10 p-4 border-b border-border flex items-center justify-between bg-card/5">
                <h3 className="font-serif font-medium text-foreground flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5 text-primary" /> AI Strategy Signal
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                    </span>
                    Gemini 3.0 Pro (Thinking)
                </span>
            </div>
            <div className="relative z-10 p-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className={`px-6 py-3 rounded-xl border text-2xl font-mono font-bold tracking-widest ${isBuy ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_-5px_hsl(var(--primary))]' : isSell ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'}`}>
                        {signal}
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Confidence Score</p>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary shadow-[0_0_10px_var(--primary)]" style={{ width: confidence }}></div>
                            </div>
                            <span className="font-mono font-bold text-foreground">{confidence}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-5 border border-border shadow-inner">
                    <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2 uppercase tracking-wider font-mono">
                        <Bot className="h-4 w-4 text-primary" /> Chain-of-Thought
                    </h4>
                    <div className="text-sm leading-relaxed text-muted-foreground font-sans whitespace-pre-wrap">
                        {reasoning}
                    </div>
                </div>
            </div>
        </div>
    );
}
