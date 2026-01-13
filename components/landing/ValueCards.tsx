"use client";

import { Brain, Database, Layers, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
    {
        icon: Brain,
        title: "Free AI Brains",
        description: "Powered by Llama 3 & Gemini via Groq for instant, zero-cost analysis.",
    },
    {
        icon: Database,
        title: "Real Market Data",
        description: "Live crypto & stock data fetched directly without paid subscriptions.",
    },
    {
        icon: Layers,
        title: "Backtesting Engine",
        description: "Validate strategies with historical data before risking a cent.",
    },
    {
        icon: Rocket,
        title: "Deploy Anywhere",
        description: "Open-source stack ready to deploy on Vercel, Netlify, or Docker.",
    },
];

export function ValueCards() {
    return (
        <section className="py-24 bg-background relative border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 px-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 ${index % 2 === 1 ? "lg:mt-8" : ""}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <card.icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-foreground">{card.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
