import { supabase } from "./client";
import { StrategyConfig, BacktestResult } from "@/lib/services/backtestService";

// ─── Backtest Results ────────────────────────────────────────────────

export async function saveBacktestResult(
    symbol: string,
    timeframe: string,
    strategyName: string,
    config: StrategyConfig,
    result: BacktestResult
) {
    const { data, error } = await supabase
        .from("backtest_results")
        .insert({
            symbol,
            timeframe,
            strategy_name: strategyName,
            config,
            result,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getSavedBacktests() {
    const { data, error } = await supabase
        .from("backtest_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) throw error;
    return data ?? [];
}

export async function deleteBacktestResult(id: string) {
    const { error } = await supabase
        .from("backtest_results")
        .delete()
        .eq("id", id);
    if (error) throw error;
}

// ─── Saved Strategies ────────────────────────────────────────────────

export async function saveStrategy(name: string, config: StrategyConfig) {
    const { data, error } = await supabase
        .from("saved_strategies")
        .insert({ name, config })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getSavedStrategies() {
    const { data, error } = await supabase
        .from("saved_strategies")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
}

export async function deleteStrategy(id: string) {
    const { error } = await supabase
        .from("saved_strategies")
        .delete()
        .eq("id", id);
    if (error) throw error;
}
