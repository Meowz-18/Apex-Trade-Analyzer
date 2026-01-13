"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
    children: string;
    className?: string;
    delay?: number;
}

export function SplitText({ children, className, delay = 0 }: SplitTextProps) {
    const characters = children.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 50,
        },
    };

    return (
        <motion.span
            className={`inline-block overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {characters.map((char, index) => (
                <motion.span variants={child} key={index} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}
