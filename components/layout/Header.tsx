"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo3D } from "@/components/ui/Logo3D";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUser } from "@/lib/providers/UserProvider";
import { LogIn, User2 } from "lucide-react";

export function Header() {
    const [authOpen, setAuthOpen] = useState(false);
    const { user, loading } = useUser();

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 relative overflow-hidden transition-transform group-hover:scale-110 duration-300">
                            <Logo3D />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground select-none">APEX</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/news" className="hover:text-primary transition-colors">News</Link>
                        <Link href="/backtest" className="hover:text-primary transition-colors">Backtest Strategy</Link>
                        <Link href="/analyzer" className="hover:text-primary transition-colors">Analyzer</Link>
                        <Link href="/stock-lens" className="hover:text-primary transition-colors">Stock Lens</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {!loading && (
                            user ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                                        <User2 className="w-3.5 h-3.5 text-primary" />
                                        <span className="hidden sm:inline max-w-[120px] truncate">{user.email}</span>
                                    </div>
                                </div>
                            ) : (
                                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAuthOpen(true)}>
                                    <LogIn className="w-3.5 h-3.5" />
                                    Sign In
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </header>
            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}
