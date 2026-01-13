import { AlertCircle } from "lucide-react";

export function Disclaimer() {
    return (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-medium text-yellow-500">Disclaimer</h4>
                    <p className="text-sm text-yellow-500/90">
                        This platform is for educational and informational purposes only. The analysis provided by AI models should not be considered financial advice. Always do your own research before making investment decisions.
                    </p>
                </div>
            </div>
        </div>
    );
}
