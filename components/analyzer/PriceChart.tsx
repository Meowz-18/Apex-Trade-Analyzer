"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartData {
    date: string;
    price: number;
}

interface PriceChartProps {
    data: ChartData[];
    symbol: string;
    onTimeframeChange: (tf: string) => void;
    activeTimeframe: string;
}

export function PriceChart({ data, symbol, onTimeframeChange, activeTimeframe }: PriceChartProps) {
    const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

    return (
        <div className="rounded-xl border border-border bg-card p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-semibold text-foreground">{symbol} Price Action</h3>
                    <p className="text-xs text-muted-foreground">Historical Performance</p>
                </div>
                <div className="flex bg-muted/50 rounded-lg p-1 gap-1">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => onTimeframeChange(tf)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTimeframe === tf
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#555555" strokeOpacity={0.2} vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                color: 'var(--foreground)',
                                borderRadius: '8px'
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            labelStyle={{ color: 'var(--muted-foreground)' }}
                            formatter={(value: number | string | undefined) => [`$${Number(value || 0).toLocaleString()}`, 'Price']}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            // Fix: Use generic var() without hsl() since variables might be oklch or hex
                            stroke="var(--primary)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--foreground)' }}
                            isAnimationActive={false} // Disable animation for robust rendering
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
