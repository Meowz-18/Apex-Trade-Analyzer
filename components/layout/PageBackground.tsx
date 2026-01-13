"use client";

import { usePathname } from "next/navigation";

export function PageBackground() {
    const pathname = usePathname();

    // Do not show gradient on landing page
    if (pathname === "/") return null;

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-300">
            {/* Light Mode Gradient: Subtle warm/cool blend */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-50/50 via-gray-50 to-white dark:hidden" />

            {/* Dark Mode Gradient: Deep slate/blue blend with spotlight effect */}
            <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background" />

            {/* Optional: Add a subtle mesh or noise if desired, but keeping it clean for now */}
        </div>
    );
}
