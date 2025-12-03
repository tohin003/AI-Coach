"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Youtube, BookOpen, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

interface Resource {
    title: string;
    url: string;
    type: "video" | "article";
    description: string;
}

interface TopicResources {
    topic: string;
    resources: Resource[];
}

export default function ResourcesPage() {
    const [topicResources, setTopicResources] = useState<TopicResources[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            const supabase = createClient();

            // Get all unique topics from submissions
            // Note: Supabase doesn't support 'distinct' directly on select easily without rpc or client-side filtering for this simple query
            // We'll fetch all submissions (lightweight, just topic) and filter client-side for now.
            // For production with millions of rows, use a .rpc() or distinct on DB side.
            const { data: submissions } = await supabase
                .from("submissions")
                .select("topic, problem_title")
                .order("created_at", { ascending: false });

            if (submissions && submissions.length > 0) {
                // Extract unique topics
                const uniqueTopics = Array.from(new Set(submissions.map(s => s.topic || "General"))).filter(Boolean);

                // Generate resources for each topic
                const allResources: TopicResources[] = uniqueTopics.map(topic => {
                    return {
                        topic: topic,
                        resources: [
                            {
                                title: `Mastering ${topic} for Interviews`,
                                url: `https://www.youtube.com/results?search_query=${topic}+interview+questions`,
                                type: "video",
                                description: `Deep dive into ${topic} patterns and common interview questions.`
                            },
                            {
                                title: `${topic} Cheatsheet`,
                                url: `https://google.com/search?q=${topic}+cheatsheet`,
                                type: "article",
                                description: "Quick reference for syntax and common algorithms."
                            },
                            {
                                title: `Top 50 ${topic} Problems`,
                                url: `https://leetcode.com/tag/${topic.toLowerCase().replace(" ", "-")}/`,
                                type: "article",
                                description: "Curated list of problems to practice."
                            }
                        ]
                    };
                });

                setTopicResources(allResources);
            } else {
                // Default for new users
                setTopicResources([{
                    topic: "Getting Started",
                    resources: [
                        {
                            title: "Data Structures & Algorithms for Beginners",
                            url: "https://www.youtube.com/results?search_query=data+structures+and+algorithms+for+beginners",
                            type: "video",
                            description: "Fundamental concepts for every software engineer."
                        },
                        {
                            title: "Big O Notation Guide",
                            url: "https://www.youtube.com/results?search_query=big+o+notation+explained",
                            type: "video",
                            description: "Learn how to analyze time and space complexity."
                        }
                    ]
                }]);
            }
            setLoading(false);
        };

        fetchResources();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Curating your personalized library...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Learning Resources</h2>
                <p className="text-slate-500">
                    Curated materials based on your practice history.
                </p>
            </div>

            {topicResources.map((section, idx) => (
                <div key={idx} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Layers className="h-5 w-5 text-indigo-500" />
                        <h3 className="text-xl font-semibold text-slate-700">{section.topic}</h3>
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600">
                            {section.resources.length} Resources
                        </Badge>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {section.resources.map((resource, i) => (
                            <Card key={i} className="group cursor-pointer transition-all hover:shadow-md hover:border-indigo-200">
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-start justify-between text-lg">
                                            <span className="text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {resource.title}
                                            </span>
                                            {resource.type === "video" ? (
                                                <Youtube className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            ) : (
                                                <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{resource.description}</p>
                                        <div className="flex items-center text-xs font-medium text-indigo-600">
                                            Open Resource <ExternalLink className="ml-1 h-3 w-3" />
                                        </div>
                                    </CardContent>
                                </a>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
