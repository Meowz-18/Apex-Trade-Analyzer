"use client";

import { motion } from "framer-motion";
import { Cpu, Server, Code2, Layers, Key, Box } from "lucide-react";
import { cn } from "@/lib/utils";

const stack = [
    {
        title: "Frontend Core",
        description: "Next.js 14 App Router with React Server Components for optimal performance and SEO.",
        icon: Box,
        items: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "AI & Inference",
        description: "Custom fine-tuned Llama 3 models running on high-performance GPU clusters.",
        icon: BrainCircuit, // Defined below locally or imported? I need to make sure I import it if I use it. I'll use Cpu instead for general compute.
        items: ["Llama 3-70B", "PyTorch", "Hugging Face", "CUDA"],
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        title: "Backend Infrastructure",
        description: "Scalable microservices architecture handling real-time WebSocket streams.",
        icon: Server,
        items: ["FastAPI", "Redis", "PostgreSQL", "Docker"],
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        title: "Data Pipeline",
        description: "Institutional-grade data ingestion from multiple providers.",
        icon: Layers,
        items: ["Kafka", "Polygon.io", "Tiingo", "Twitter API"],
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    }
];

// Re-using specific icons from previous step or new ones
function BrainCircuit(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0 2.526 5.77 4 4 0 0 0 .556 6.5 4 4 0 1 0 5.83 0 4 4 0 0 0 .556-6.501 4 4 0 0 0 2.526-5.77A3 3 0 1 0 12 5z" />
            <path d="M12 5v14" />
            <path d="M12 3v2" />
            <path d="M12 19v2" />
        </svg>
    )
}

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-background py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-foreground"
                    >
                        Built for Speed.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        A look under the hood of Antigravity's high-frequency decision engine.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {stack.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group p-8 rounded-3xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 relative overflow-hidden",
                                item.border
                            )}
                        >
                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", item.bg)} />

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className={cn("p-4 rounded-2xl bg-background border", item.border)}>
                                    <item.icon className={cn("w-8 h-8", item.color)} />
                                </div>
                                <div className="flex gap-2">
                                    {/* Decorative dots */}
                                    <div className={cn("w-2 h-2 rounded-full", item.bg.replace('/10', '/50'))} />
                                    <div className={cn("w-2 h-2 rounded-full opacity-50", item.bg.replace('/10', '/50'))} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                            <p className="text-muted-foreground mb-8 min-h-[3rem]">{item.description}</p>

                            <div className="flex flex-wrap gap-2">
                                {item.items.map((tech, i) => (
                                    <span
                                        key={i}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-mono border bg-background/50",
                                            item.border,
                                            item.color
                                        )}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
