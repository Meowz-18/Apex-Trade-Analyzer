import { supabase } from "./client";
import { SingleModelResult } from "@/lib/services/analysisService";

export async function saveAnalysis(
    symbol: string,
    assetType: string,
    modelA: SingleModelResult,
    modelB: SingleModelResult,
    price: number
) {
    const { data, error } = await supabase
        .from("analysis_history")
        .insert({
            symbol,
            asset_type: assetType,
            signal_a: modelA.signal,
            signal_b: modelB.signal,
            confidence_a: modelA.confidence,
            confidence_b: modelB.confidence,
            price,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getAnalysisHistory(limit = 30) {
    const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data ?? [];
}
