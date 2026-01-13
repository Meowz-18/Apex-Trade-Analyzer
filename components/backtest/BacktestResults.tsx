"use client";

import { BacktestResult } from "@/lib/services/backtestService";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, Target } from "lucide-react";

export function BacktestResults({ result }: { result: BacktestResult }) {
    const isProfitable = result.totalPnLPercent > 0;

    // Format data for charts
    const chartData = result.equityCurve.map(pt => ({
        // Fix: Input time is in seconds (unix), JS Date needs ms.
        time: new Date(pt.time * 1000).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        equity: pt.equity
    }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                    label="Net PnL"
                    value={`${result.totalPnLPercent.toFixed(2)}%`}
                    subValue={isProfitable ? "Profitable" : "Loss"}
                    icon={TrendingUp}
                    trend={isProfitable ? "up" : "down"}
                />
                <KpiCard
                    label="Win Rate"
                    value={`${result.winRate.toFixed(1)}%`}
                    subValue={`${result.trades.filter(t => t.status === "WIN").length} / ${result.totalTrades} Trades`}
                    icon={Target}
                    trend={result.winRate > 50 ? "up" : "down"}
                />
                <KpiCard
                    label="Max Drawdown"
                    value={`${result.maxDrawdown.toFixed(2)}%`}
                    subValue="Peak to Trough"
                    icon={AlertTriangle}
                    trend="neutral"
                />
                <KpiCard
                    label="Total Trades"
                    value={result.totalTrades.toString()}
                    subValue="Executed"
                    icon={Target} // Placeholder icon
                    trend="neutral"
                />
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Equity Curve */}
                <div className="md:col-span-2 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" /> Equity Curve
                    </h3>
                    <div className="h-[300px] w-full">
                        {/* Debug: Check if data exists */}
                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No chart data available</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isProfitable ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={isProfitable ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#888888" strokeOpacity={0.2} />
                                    <XAxis
                                        dataKey="time"
                                        hide
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        stroke="#888888"
                                        fontSize={12}
                                        tickFormatter={(val) => `$${val.toLocaleString()}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }}
                                        formatter={(val: number | undefined) => [val ? `$${val.toFixed(2)}` : "0.00", "Equity"] as [string, string]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="equity"
                                        stroke={isProfitable ? "#10b981" : "#ef4444"}
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorEquity)"
                                        isAnimationActive={false} // Disable animation to ensure immediate render
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Monthly Breakdown Table */}
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="font-semibold mb-4">Monthly Performance</h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-muted-foreground bg-muted/20 sticky top-0 backdrop-blur-md">
                                <tr>
                                    <th className="py-2 text-left pl-2">Period</th>
                                    <th className="py-2 text-center">Trades</th>
                                    <th className="py-2 text-right pr-2">PnL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {Object.entries(result.monthlyBreakdown).map(([period, data]) => (
                                    <tr key={period} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-2 font-mono text-muted-foreground">{period}</td>
                                        <td className="py-3 text-center">{data.trades}</td>
                                        <td className={`py-3 text-right pr-2 font-bold ${data.pnl > 0 ? "text-green-400" : "text-red-400"}`}>
                                            {data.pnl > 0 ? "+" : ""}{data.pnl.toFixed(2)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ label, value, subValue, icon: Icon, trend }: any) {
    return (
        <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-border/80 transition-all">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                <Icon className="h-16 w-16" />
            </div>

            <div className="relative z-10">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</div>
                <div className={`text-2xl font-black tracking-tight ${trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-foreground"}`}>
                    {value}
                </div>
                {subValue && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        {trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                        {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                        {subValue}
                    </div>
                )}
            </div>
        </div>
    );
}
