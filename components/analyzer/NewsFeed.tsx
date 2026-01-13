import { ExternalLink } from "lucide-react";

interface NewsItem {
    title: string;
    sentiment: "Positive" | "Negative" | "Neutral";
    source: string;
    url?: string;
}

interface NewsFeedProps {
    news: NewsItem[];
}

export function NewsFeed({ news }: NewsFeedProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Market Intelligence</h3>
            </div>
            <div className="divide-y divide-border overflow-y-auto custom-scrollbar h-full">
                {news.map((item, index) => (
                    <a
                        key={index}
                        href={item.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 hover:bg-muted transition-colors group cursor-pointer border-b border-border last:border-0"
                    >
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {item.title}
                            </h4>
                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{item.source}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.sentiment === 'Positive' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : item.sentiment === 'Negative' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'}`}>
                                {item.sentiment}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
