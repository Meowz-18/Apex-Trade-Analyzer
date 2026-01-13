"use client";

import { motion } from "framer-motion";
import { Search, Server, Cpu, LineChart } from "lucide-react";

const steps = [
    {
        prefix: "01",
        title: "Input Symbol",
        description: "Enter any Stock or Crypto ticker (e.g. AAPL, BTC).",
        icon: Search,
    },
    {
        prefix: "02",
        title: "Data Ingestion",
        description: "System pulls live prices, news, and fundamentals.",
        icon: Server,
    },
    {
        prefix: "03",
        title: "AI Analysis",
        description: "LLMs analyze sentiment and technical patterns.",
        icon: Cpu,
    },
    {
        prefix: "04",
        title: "Actionable Insights",
        description: "Receive clear Buy/Sell/Hold signals with confidence scores.",
        icon: LineChart,
    },
];

export function StepFlow() {
    return (
        <section className="py-24 bg-card/30 border-y border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From raw query to institutional-grade strategy in seconds.
                    </p>
                </div>

                <div className="relative grid md:grid-cols-4 gap-8">
                    {/* Connector Line (Desktop) */}
                    <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent hidden md:block" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-card shadow-xl mb-6">
                                <step.icon className="h-10 w-10 text-primary" />
                                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-black border-2 border-background">
                                    {step.prefix}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground max-w-[200px]">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
