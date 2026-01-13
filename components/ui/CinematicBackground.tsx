"use client";

export function CinematicBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
            {/* Base Gradient - Static, extremely lightweight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

            {/* Grain Overlay - Static texture for premium feel without load */}
            <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        </div>
    );
}
