import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PersonalizedCards } from "@/components/dashboard/PersonalizedCards";
import { CinematicBackground } from "@/components/ui/CinematicBackground";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/onboarding");
    }

    return (
        <main className="min-h-screen bg-[#050505] relative flex flex-col pt-32 px-6 pb-20">
            {/* Cinematic bg */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <CinematicBackground />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Here is an overview of the {profile.preferred_markets.join(" & ").toLowerCase()} markets matching your {profile.risk_level.toLowerCase()} risk profile.
                    </p>
                </div>

                <PersonalizedCards preferredMarkets={profile.preferred_markets} />
            </div>
        </main>
    );
}
