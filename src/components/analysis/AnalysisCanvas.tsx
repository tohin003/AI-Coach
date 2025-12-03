"use client";

import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Play, CheckCircle2, AlertTriangle, XCircle, Info, RotateCcw, MessageSquare, Send, ExternalLink, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mermaid } from "@/components/analysis/Mermaid";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface AnalysisResult {
    rating: number;
    correctness_status: string;
    critique: string;
    strengths: string[];
    weaknesses: string[];
    topic?: string;
    difficulty?: string;
    problem_title?: string;
    user_approach?: string;
    optimized_approach?: string;
    optimized_code: string;
    visualization: string;
    similar_problems?: {
        name: string;
        link: string;
        difficulty: string;
    }[];
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function AnalysisCanvas() {
    const [code, setCode] = useState("// Write your solution here...");
    const [language, setLanguage] = useState("javascript");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [topic, setTopic] = useState("Arrays");

    // Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isChatting, setIsChatting] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCode = localStorage.getItem("coach_code");
        const savedLanguage = localStorage.getItem("coach_language");
        const savedResult = localStorage.getItem("coach_result");
        const savedTopic = localStorage.getItem("coach_topic");

        if (savedCode) setCode(savedCode);
        if (savedLanguage) setLanguage(savedLanguage);
        if (savedResult) setResult(JSON.parse(savedResult));
        if (savedTopic) setTopic(savedTopic);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (code) localStorage.setItem("coach_code", code);
        if (language) localStorage.setItem("coach_language", language);
        if (result) localStorage.setItem("coach_result", JSON.stringify(result));
        if (topic) localStorage.setItem("coach_topic", topic);
    }, [code, language, result, topic]);

    const handleNewChat = () => {
        if (confirm("Are you sure? This will clear your current code and analysis.")) {
            setCode("// Write your solution here...");
            setResult(null);
            setTopic("Arrays");
            setChatMessages([]);
            localStorage.removeItem("coach_code");
            localStorage.removeItem("coach_result");
            localStorage.removeItem("coach_topic");
            toast.success("New session started");
        }
    };

    const handleAnalyze = async () => {
        if (!code.trim()) {
            toast.error("Please enter some code first.");
            return;
        }

        setIsAnalyzing(true);
        setResult(null);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();

            // Clean up Mermaid string if it contains markdown blocks
            if (data.visualization) {
                data.visualization = data.visualization
                    .replace(/```mermaid/g, "")
                    .replace(/```/g, "")
                    .trim();
            }

            setResult(data);

            // Use AI-detected topic
            const detectedTopic = data.topic || "Other";
            setTopic(detectedTopic);

            // Save to Supabase (Fire and forget)
            saveToSupabase(code, language, data, detectedTopic);

            toast.success("Analysis complete!");
        } catch (error) {
            toast.error("Failed to analyze code. Please try again.");
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAskQuestion = async () => {
        if (!chatInput.trim()) return;

        const userMsg: ChatMessage = { role: "user", content: chatInput };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput("");
        setIsChatting(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...chatMessages, userMsg],
                    context: {
                        code,
                        analysis: result
                    }
                }),
            });

            if (!response.ok) throw new Error("Chat failed");

            const data = await response.json();
            setChatMessages(prev => [...prev, { role: "assistant", content: data.message }]);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsChatting(false);
        }
    };

    const saveToSupabase = async (code: string, language: string, result: AnalysisResult, detectedTopic: string) => {
        try {
            const { createClient } = await import("@/lib/supabase");
            const supabase = createClient();

            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("You must be logged in to save progress");
                return;
            }

            // 2. Create Submission
            const { data: submission, error: subError } = await supabase
                .from("submissions")
                .insert({
                    user_id: user.id,
                    code,
                    language,
                    problem_title: result.problem_title || "Custom Problem",
                    topic: detectedTopic,
                    difficulty: result.difficulty || "Medium"
                })
                .select()
                .single();

            if (subError) {
                console.error("Supabase Submission Error:", JSON.stringify(subError, null, 2));
                throw subError;
            }

            // 2. Create Analysis
            const { error: analysisError } = await supabase
                .from("analyses")
                .insert({
                    submission_id: submission.id,
                    rating: result.rating,
                    correctness: result.correctness_status,
                    optimized_code: result.optimized_code,
                    improvement_points: result.weaknesses,
                    visualization_mermaid: result.visualization,
                    user_approach: result.user_approach,
                    optimized_approach: result.optimized_approach
                });

            if (analysisError) {
                console.error("Supabase Analysis Error:", JSON.stringify(analysisError, null, 2));
                throw analysisError;
            }

        } catch (error) {
            console.error("Failed to save to Supabase:", error);
        }
    };

    return (
        <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Panel: Editor */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-700">Code Editor</h3>
                    <Button variant="ghost" size="sm" onClick={handleNewChat} className="text-slate-500 hover:text-red-600">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        New Chat
                    </Button>
                </div>
                <CodeEditor
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    language={language}
                    onLanguageChange={setLanguage}
                />
                <div className="flex justify-end">
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        {isAnalyzing ? (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Run Analysis
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Right Panel: AI Insights */}
            <Card className="flex flex-col overflow-hidden border-slate-200 shadow-sm h-full max-h-[calc(100vh-8rem)]">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center text-lg font-semibold text-slate-800">
                            <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
                            Coach Insights
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            {result && (
                                <>
                                    <Badge variant="outline" className="bg-white">
                                        {topic}
                                    </Badge>
                                    {result.difficulty && (
                                        <Badge variant="secondary" className={
                                            result.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                                                result.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                        }>
                                            {result.difficulty}
                                        </Badge>
                                    )}
                                    <Badge variant={result.rating >= 80 ? "default" : "secondary"} className={result.rating >= 80 ? "bg-green-600" : ""}>
                                        Score: {result.rating}/100
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 relative">
                    <Tabs defaultValue="analysis" className="flex h-full flex-col">
                        <div className="px-6 pt-4 flex-shrink-0">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                <TabsTrigger value="optimized">Optimized Code</TabsTrigger>
                                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                                <TabsTrigger value="chat">Ask Coach</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-6">
                                    <TabsContent value="analysis" className="mt-0 space-y-6">
                                        {!result ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                                                <Sparkles className="mb-4 h-12 w-12 text-slate-300" />
                                                <p>Run analysis to see AI insights here.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Status & Critique */}
                                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                                    <h4 className="font-medium text-slate-900 mb-2">Coach's Critique</h4>
                                                    <p className="text-sm text-slate-700 leading-relaxed">{result.critique}</p>
                                                </div>

                                                {/* Approaches */}
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                                                        <h4 className="font-medium text-slate-900 mb-2">Your Approach</h4>
                                                        <p className="text-sm text-slate-600">{result.user_approach || "Not analyzed"}</p>
                                                    </div>
                                                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                                                        <h4 className="font-medium text-indigo-900 mb-2">Optimized Approach</h4>
                                                        <p className="text-sm text-indigo-800">{result.optimized_approach || "Not analyzed"}</p>
                                                    </div>
                                                </div>

                                                {/* Strengths */}
                                                <div>
                                                    <h4 className="mb-3 flex items-center font-semibold text-green-700">
                                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                                        Strengths
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.strengths.map((item, i) => (
                                                            <li key={i} className="flex items-start text-sm text-slate-600">
                                                                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Weaknesses */}
                                                <div>
                                                    <h4 className="mb-3 flex items-center font-semibold text-amber-600">
                                                        <AlertTriangle className="mr-2 h-5 w-5" />
                                                        Areas for Improvement
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.weaknesses.map((item, i) => (
                                                            <li key={i} className="flex items-start text-sm text-slate-600">
                                                                <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Similar Problems */}
                                                {result.similar_problems && (
                                                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                                        <h4 className="mb-3 flex items-center font-semibold text-blue-800">
                                                            <HelpCircle className="mr-2 h-5 w-5" />
                                                            Practice Similar Problems
                                                        </h4>
                                                        <ul className="space-y-3">
                                                            {result.similar_problems.map((prob, i) => (
                                                                <li key={i} className="flex items-center justify-between text-sm">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2 mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                                                        <a
                                                                            href={prob.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="font-medium text-blue-700 hover:underline"
                                                                        >
                                                                            {prob.name}
                                                                        </a>
                                                                    </div>
                                                                    <Badge variant="outline" className="bg-white text-blue-600 border-blue-200 text-xs">
                                                                        {prob.difficulty}
                                                                    </Badge>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="optimized" className="mt-0 h-full">
                                        {result ? (
                                            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                                                <pre className="font-mono text-sm overflow-x-auto">
                                                    <code>{result.optimized_code}</code>
                                                </pre>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-12 text-slate-500">
                                                No optimized code available yet.
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="visualization" className="mt-0 h-full">
                                        {result ? (
                                            <div className="rounded-md border border-slate-200 bg-white p-4">
                                                <Mermaid chart={result.visualization} />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-12 text-slate-500">
                                                No visualization available yet.
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="chat" className="mt-0 h-full">
                                        <div className="flex flex-col h-[400px]">
                                            <ScrollArea className="flex-1 pr-4">
                                                <div className="space-y-4">
                                                    {chatMessages.length === 0 && (
                                                        <div className="text-center text-slate-500 py-8">
                                                            <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                                            <p>Ask me anything about your code or the optimization!</p>
                                                        </div>
                                                    )}
                                                    {chatMessages.map((msg, i) => (
                                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-slate-100 text-slate-800'
                                                                }`}>
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                            <div className="mt-4 flex gap-2">
                                                <Input
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    placeholder="Ask a question..."
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                                                />
                                                <Button size="icon" onClick={handleAskQuestion} disabled={isChatting}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </ScrollArea>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
