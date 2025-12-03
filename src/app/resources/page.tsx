"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Youtube, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Resource {
    title: string;
    url: string;
    type: "video" | "article";
    description: string;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastTopic, setLastTopic] = useState<string>("");

    useEffect(() => {
        const fetchResources = async () => {
            const supabase = createClient();

            // Get last submission topic
            const { data: lastSub } = await supabase
                .from("submissions")
                .select("topic, problem_title")
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (lastSub) {
                setLastTopic(lastSub.topic || "General");
                // Mocking resource generation based on topic (Real implementation would use YouTube API or AI search)
                // For this demo, we generate relevant links dynamically
                const topic = lastSub.topic || "Coding";
                const problem = lastSub.problem_title || "Algorithm";

                setResources([
                    {
                        title: `Mastering ${topic} for Interviews`,
                        url: `https://www.youtube.com/results?search_query=${topic}+interview+questions`,
                        type: "video",
                        description: `Deep dive into ${topic} patterns and common interview questions.`
                    },
                    {
                        title: `Solution Walkthrough: ${problem}`,
                        url: `https://www.youtube.com/results?search_query=leetcode+${problem}+solution`,
                        type: "video",
                        description: "Watch how top engineers solve this exact problem."
                    },
                    {
                        title: `${topic} Cheatsheet`,
                        url: `https://google.com/search?q=${topic}+cheatsheet`,
                        type: "article",
                        description: "Quick reference for syntax and common algorithms."
                    }
                ]);
            } else {
                setResources([
                    {
                        title: "Getting Started with Algorithms",
                        url: "https://www.youtube.com/results?search_query=data+structures+and+algorithms+for+beginners",
                        type: "video",
                        description: "Fundamental concepts for every software engineer."
                    }
                ]);
            }
            setLoading(false);
        };

        fetchResources();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Curating resources for you...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Learning Resources</h2>
                <p className="text-slate-500">
                    {lastTopic ? `Curated for your recent work on ${lastTopic}` : "Recommended for you"}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource, i) => (
                    <Card key={i} className="group cursor-pointer transition-all hover:shadow-md hover:border-indigo-200">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                            <CardHeader>
                                <CardTitle className="flex items-start justify-between text-lg">
                                    <span className="text-slate-800 group-hover:text-indigo-600 transition-colors">
                                        {resource.title}
                                    </span>
                                    {resource.type === "video" ? (
                                        <Youtube className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <BookOpen className="h-5 w-5 text-blue-500" />
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 mb-4">{resource.description}</p>
                                <div className="flex items-center text-xs font-medium text-indigo-600">
                                    Open Resource <ExternalLink className="ml-1 h-3 w-3" />
                                </div>
                            </CardContent>
                        </a>
                    </Card>
                ))}
            </div>
        </div>
    );
}
