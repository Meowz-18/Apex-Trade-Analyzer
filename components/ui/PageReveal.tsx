"use client";

import { motion } from "framer-motion";

export function PageReveal() {
    return (
        <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-white origin-top pointer-events-none mix-blend-difference"
        />
    );
}
