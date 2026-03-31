import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "APEX | AI-Powered Market Intelligence",
  description: "Advanced AI trading analysis with real-time data integration. The unfair advantage for modern traders.",
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageReveal } from "@/components/ui/PageReveal";
import { PageBackground } from "@/components/layout/PageBackground";
import { UserProvider } from "@/lib/providers/UserProvider";

import { Disclaimer } from "@/components/layout/Disclaimer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={clsx(
          inter.variable,
          playfair.variable,
          jetbrains.variable,
          "bg-background text-foreground antialiased flex flex-col min-h-screen font-sans selection:bg-primary/30 selection:text-primary-foreground"
        )}>
        <CustomCursor />
        <PageReveal />
        <SmoothScroll>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <PageBackground />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Disclaimer />
            </ThemeProvider>
          </UserProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
