import { DetailedFeatures } from "@/components/features/DetailedFeatures";
import { CinematicBackground } from "@/components/ui/CinematicBackground";

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-background relative selection:bg-primary/20 overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-50">
                <CinematicBackground />
            </div>

            <div className="relative z-10 pt-20">
                <DetailedFeatures />
            </div>
        </main>
    );
}
