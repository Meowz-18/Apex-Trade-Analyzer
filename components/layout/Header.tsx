import Link from "next/link";

import { Logo3D } from "@/components/ui/Logo3D";
// import { Button } from "@/components/ui/button"; // Removed unused import
// For now I'll use a standard HTML button or create a Button component.
// I'll stick to standard HTML for this step to avoid circular dependency if I haven't made Button yet.
// Actually, I'll make a simple button inside or inline it.

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-12 w-12 relative overflow-hidden transition-transform group-hover:scale-110 duration-300">
                        <Logo3D />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-foreground select-none">APEX</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="/backtest" className="hover:text-primary transition-colors">Backtest Strategy</Link>
                </nav>
                <div className="flex items-center gap-4">

                    <Link href="/analyzer">
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                            Launch Free Analyzer
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
