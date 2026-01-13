import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-foreground">APEX</h4>
                        <p className="text-sm text-muted-foreground">
                            Institutional-grade AI trading analysis for free.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/analyzer" className="hover:text-primary">Analyzer</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
                            <li><Link href="/architecture" className="hover:text-primary">Architecture</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">GitHub</Link></li>
                            <li><Link href="#" className="hover:text-primary">Docs</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Terms</Link></li>
                            <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
                    <p>&copy; 2025 APEX. Open Source.</p>
                    <p className="mt-2 text-muted-foreground/60">Not financial advice. For educational purposes only.</p>
                </div>
            </div>
        </footer>
    );
}
