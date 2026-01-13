"use client";

import { useEffect, useState } from "react";
import { Logo3D } from "@/components/ui/Logo3D";
import { motion } from "framer-motion";

export function ProjectLoader() {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("Initializing Quantum Core...");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Fast start, slow end simulation
                const remaining = 100 - prev;
                const increment = Math.max(0.5, remaining * 0.1);
                return Math.min(prev + increment, 100);
            });
        }, 100);

        const statusInterval = setInterval(() => {
            const statuses = [
                "Syncing Market Feeds...",
                "Calibrating Neural Nets...",
                "Decrypting Secure Streams...",
                "Optimizing Visual Cortex...",
                "Ready."
            ];
            const randomIndex = Math.floor(Math.random() * statuses.length);
            // Updating text based on progress thresholds mostly
            setProgress((p) => {
                if (p < 30) setStatusText("Initializing Quantum Core...");
                else if (p < 60) setStatusText("Syncing Global Market Feeds...");
                else if (p < 90) setStatusText("Calibrating AI Models...");
                else setStatusText("Preparing Interface...");
                return p;
            });
        }, 500);

        return () => {
            clearInterval(interval);
            clearInterval(statusInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/95 text-white z-[100] fixed inset-0">
            {/* Logo */}
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                <Logo3D className="w-32 h-32 md:w-48 md:h-48" />
            </div>

            {/* Project Title */}
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
            >
                APEX
            </motion.h1>

            {/* Progress Bar Container */}
            <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Status Text & Percentage */}
            <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-cyan-400 font-mono text-xl font-bold">{Math.round(progress)}%</span>
                <span className="text-muted-foreground text-sm tracking-wider uppercase">{statusText}</span>
            </div>
        </div>
    );
}
