import { supabase } from "./client";

// ─── User Profile (Onboarding Preferences) ───────────────────────────

export interface UserProfile {
    id: string; // matches auth.users.id
    risk_level: "LOW" | "MEDIUM" | "HIGH";
    preferred_markets: string[]; // e.g. ["CRYPTO", "STOCKS"]
    experience_level: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
    created_at?: string;
}

export async function upsertUserProfile(profile: UserProfile) {
    const { data, error } = await supabase
        .from("user_profiles")
        .upsert(profile)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 = not found
    return data ?? null;
}

// ─── Watchlist ───────────────────────────────────────────────────────

export interface WatchlistItem {
    symbol: string;
    asset_type: "CRYPTO" | "STOCK" | "INDEX" | "FOREX";
}

export async function getWatchlist(userId: string) {
    const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function addToWatchlist(userId: string, item: WatchlistItem) {
    const { data, error } = await supabase
        .from("watchlists")
        .insert({ user_id: userId, ...item })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function removeFromWatchlist(userId: string, symbol: string) {
    const { error } = await supabase
        .from("watchlists")
        .delete()
        .eq("user_id", userId)
        .eq("symbol", symbol);
    if (error) throw error;
}
