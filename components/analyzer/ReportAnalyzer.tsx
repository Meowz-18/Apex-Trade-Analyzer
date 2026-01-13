"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, BarChart3, PieChart, ArrowRight } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data Types for the "AI Analysis"
interface FinancialMetrics {
    period: string;
    revenue: number;
    netIncome: number;
    guidance: "Raise" | "Lower" | "Maintain";
}

interface AIAnalysisResult {
    summary: string;
    sentiment: "Bullish" | "Bearish" | "Neutral";
    metrics: FinancialMetrics[];
    keyRisks: string[];
    opportunities: string[];
}

export function ReportAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setResult(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
    });

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/analyze-report", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Analysis failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError("Failed to analyze report. Please try again.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-serif font-medium tracking-tight">Financial Analyst Assistant</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Upload an earnings report (PDF) to extract key financial metrics, automated summaries, and sentiment analysis powered by simulated Gemini 3.
                </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-2xl mx-auto">
                {!result && (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${isDragActive ? "border-primary bg-primary/5 scale-102" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-lg">
                                {file ? <FileText className="h-8 w-8 text-indigo-400" /> : <Upload className="h-8 w-8 text-indigo-400" />}
                            </div>
                            <div>
                                {file ? (
                                    <p className="text-lg font-medium text-foreground">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-lg font-medium text-foreground">Drop earnings report PDF here</p>
                                        <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analyze Button */}
                {file && !result && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="relative overflow-hidden rounded-full py-3 px-8 bg-foreground text-background font-bold text-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing Report...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Generate Insights <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Results Dashboard */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Summary & Sentiment */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2 border-white/10 bg-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bot className="h-5 w-5 text-indigo-400" /> Executive Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed text-muted-foreground">{result.summary}</p>
                                </CardContent>
                            </Card>

                            <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Sentiment Score</CardTitle>
                                    <CardDescription>AI-derived tone analysis</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <div className={`text-4xl font-bold mb-2 ${result.sentiment === "Bullish" ? "text-emerald-400" : result.sentiment === "Bearish" ? "text-rose-400" : "text-yellow-400"}`}>
                                            {result.sentiment}
                                        </div>
                                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${result.sentiment === "Bullish" ? "bg-emerald-500 w-3/4" : result.sentiment === "Bearish" ? "bg-rose-500 w-1/4" : "bg-yellow-500 w-1/2"}`}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Area */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Revenue & Net Income Trend</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={result.metrics}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="period" stroke="rgba(255,255,255,0.5)" />
                                            <YAxis stroke="rgba(255,255,255,0.5)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#111", borderColor: "#333" }}
                                                itemStyle={{ color: "#fff" }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#818cf8" fillOpacity={1} fill="url(#colorRev)" name="Revenue (B)" />
                                            <Area type="monotone" dataKey="netIncome" stroke="#34d399" fillOpacity={1} fill="url(#colorInc)" name="Net Income (B)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle>Key Risks & Opportunities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="opportunities" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-white/5">
                                            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                                            <TabsTrigger value="risks">Risks</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="opportunities" className="mt-4 space-y-3">
                                            {result.opportunities.map((opp, i) => (
                                                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-emerald-100/80">{opp}</p>
                                                </div>
                                            ))}
                                        </TabsContent>
                                        <TabsContent value="risks" className="mt-4 space-y-3">
                                            {result.keyRisks.map((risk, i) => (
                                                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                                                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-rose-100/80">{risk}</p>
                                                </div>
                                            ))}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper icons
function Bot({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    )
}
