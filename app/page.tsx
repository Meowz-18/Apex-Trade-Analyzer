import Image from "next/image";

import { QuantumHero } from "@/components/landing/QuantumHero";
import { ValueCards } from "@/components/landing/ValueCards";
import { StepFlow } from "@/components/landing/StepFlow";
import { Features } from "@/components/landing/Features";
import { EcosystemGrid } from "@/components/landing/EcosystemGrid";
import { CinematicBackground } from "@/components/ui/CinematicBackground";
import { getMarketData } from "@/lib/market-data";

export const revalidate = 0; // Disable caching for development/immediate update

export default async function Home() {
  const marketData = await getMarketData();

  return (
    <main className="flex min-h-screen flex-col relative">
      <div className="absolute inset-0 z-0">
        <CinematicBackground />
      </div>
      <div className="relative z-10">
        <QuantumHero marketData={marketData} />
        <ValueCards />
        <StepFlow />
        <Features />
        <EcosystemGrid />
      </div>
    </main>
  );
}
