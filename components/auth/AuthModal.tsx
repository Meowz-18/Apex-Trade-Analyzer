"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { signInWithEmail, signUpWithEmail } from "@/lib/supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type Mode = "login" | "register";

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const resetForm = () => {
        setError(null);
        setSuccess(null);
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            if (mode === "login") {
                await signInWithEmail(email, password);
                onSuccess?.();
                onClose();
            } else {
                await signUpWithEmail(email, password);
                setSuccess("Account created! Check your email to confirm, then log in.");
                setMode("login");
            }
        } catch (err: any) {
            setError(err.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetForm(); } }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="relative w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Gradient header */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-primary/80 blur-sm" />

                        <div className="p-8">
                            {/* Close */}
                            <button
                                onClick={() => { onClose(); resetForm(); }}
                                className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Logo */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">APEX</span>
                            </div>

                            <h2 className="text-2xl font-bold mb-1">
                                {mode === "login" ? "Welcome back" : "Create account"}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                {mode === "login"
                                    ? "Sign in to access your dashboard and watchlist."
                                    : "Join APEX and get personalized market intelligence."}
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-9"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {error && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                                        {error}
                                    </motion.p>
                                )}
                                {success && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
                                        {success}
                                    </motion.p>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                </Button>
                            </form>

                            {/* Toggle mode */}
                            <p className="text-center text-sm text-muted-foreground mt-4">
                                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => { setMode(mode === "login" ? "register" : "login"); resetForm(); }}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {mode === "login" ? "Sign up" : "Log in"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
