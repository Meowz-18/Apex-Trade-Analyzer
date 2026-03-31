"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { upsertUserProfile, UserProfile } from "@/lib/supabase/userDb";
import { useUser } from "@/lib/providers/UserProvider";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Target, TrendingUp, BookOpen } from "lucide-react";

interface OnboardingQuizProps {
    onComplete: () => void;
}

const QUESTIONS = [
    {
        id: "risk_level" as const,
        icon: Target,
        question: "What's your risk tolerance?",
        subtitle: "This determines how aggressive the AI's market suggestions will be.",
        options: [
            { value: "LOW", label: "Conservative", desc: "I prioritize capital preservation." },
            { value: "MEDIUM", label: "Balanced", desc: "I want growth with managed risk." },
            { value: "HIGH", label: "Aggressive", desc: "I chase high-risk, high-reward setups." },
        ],
    },
    {
        id: "preferred_markets" as const,
        icon: TrendingUp,
        question: "Which markets interest you?",
        subtitle: "Your dashboard will be filtered to show only these markets.",
        options: [
            { value: "CRYPTO", label: "Cryptocurrency", desc: "BTC, ETH, Altcoins" },
            { value: "STOCKS", label: "Indian Stocks", desc: "NSE/BSE – NIFTY, Sensex" },
            { value: "FOREX", label: "Forex", desc: "EUR/USD, GBP/USD, etc." },
        ],
        multi: true,
    },
    {
        id: "experience_level" as const,
        icon: BookOpen,
        question: "What's your trading experience?",
        subtitle: "This personalizes the depth of AI explanations.",
        options: [
            { value: "BEGINNER", label: "Beginner", desc: "Just getting started." },
            { value: "INTERMEDIATE", label: "Intermediate", desc: "I understand charts and indicators." },
            { value: "EXPERT", label: "Expert", desc: "I analyze order flow and macro data." },
        ],
    },
];

export function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<{
        risk_level?: string;
        preferred_markets?: string[];
        experience_level?: string;
    }>({});
    const [saving, setSaving] = useState(false);

    const current = QUESTIONS[step];

    const handleSelect = (value: string) => {
        if (current.multi) {
            const prev = (answers.preferred_markets ?? []);
            const next = prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value];
            setAnswers(a => ({ ...a, preferred_markets: next }));
        } else {
            setAnswers(a => ({ ...a, [current.id]: value }));
        }
    };

    const isSelected = (value: string) => {
        if (current.multi) return (answers.preferred_markets ?? []).includes(value);
        return (answers as any)[current.id] === value;
    };

    const canProceed = current.multi
        ? (answers.preferred_markets?.length ?? 0) > 0
        : !!(answers as any)[current.id];

    const handleNext = async () => {
        if (step < QUESTIONS.length - 1) {
            setStep(s => s + 1);
        } else {
            // Save to Supabase
            if (!user) return onComplete();
            setSaving(true);
            try {
                await upsertUserProfile({
                    id: user.id,
                    risk_level: answers.risk_level as any ?? "MEDIUM",
                    preferred_markets: answers.preferred_markets ?? ["CRYPTO"],
                    experience_level: answers.experience_level as any ?? "INTERMEDIATE",
                });
            } catch (e) {
                console.error("Failed to save profile", e);
            } finally {
                setSaving(false);
                onComplete();
            }
        }
    };

    const Icon = current.icon;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4">
            <div className="w-full max-w-lg">
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {QUESTIONS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-muted"}`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                Step {step + 1} / {QUESTIONS.length}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold mb-2 mt-3">{current.question}</h2>
                        <p className="text-muted-foreground mb-6">{current.subtitle}</p>

                        <div className="space-y-3">
                            {current.options.map((opt) => {
                                const selected = isSelected(opt.value);
                                return (
                                    <motion.button
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
                                            selected
                                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                                : "border-border/50 bg-card/40 hover:border-border"
                                        }`}
                                    >
                                        <div>
                                            <div className="font-semibold">{opt.label}</div>
                                            <div className="text-sm text-muted-foreground">{opt.desc}</div>
                                        </div>
                                        {selected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 ml-3" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <Button
                    className="w-full mt-8 h-12 text-base gap-2"
                    onClick={handleNext}
                    disabled={!canProceed || saving}
                >
                    {saving ? "Saving..." : step < QUESTIONS.length - 1 ? "Continue" : "Complete Setup"}
                    {!saving && <ChevronRight className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );
}
