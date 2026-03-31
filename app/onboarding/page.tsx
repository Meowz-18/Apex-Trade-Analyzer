"use client";

import { OnboardingQuiz } from "@/components/onboarding/OnboardingQuiz";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();
    
    return (
        <main className="min-h-screen bg-[#050505] relative flex flex-col justify-center items-center overflow-hidden">
            {/* Background elements to match aesthetic */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] pointer-events-none"></div>

            <div className="relative z-10 w-full">
                <OnboardingQuiz onComplete={() => router.push("/dashboard")} />
            </div>
        </main>
    );
}
