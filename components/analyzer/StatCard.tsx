import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    subValue?: string;
    trend?: "up" | "down";
    icon: LucideIcon;
}

export function StatCard({ title, value, subValue, trend, icon: Icon }: StatCardProps) {
    return (
        <div className="p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                {subValue && (
                    <span className={`text-sm font-medium mb-1 ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {subValue}
                    </span>
                )}
            </div>
        </div>
    );
}
