import { ReportAnalyzer } from "@/components/analyzer/ReportAnalyzer";

export const metadata = {
    title: "AI Financial Analyst | APEX",
    description: "Upload detailed financial reports for instant AI-powered analysis.",
};

export default function ReportPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <ReportAnalyzer />
        </div>
    );
}
