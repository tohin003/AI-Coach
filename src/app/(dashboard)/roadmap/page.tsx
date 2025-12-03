"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock, Map } from "lucide-react";
import { motion } from "framer-motion";

interface RoadmapStep {
    title: string;
    description: string;
    status: "completed" | "in-progress" | "locked";
}

interface RoadmapData {
    current_level: string;
    next_milestone: string;
    steps: RoadmapStep[];
}

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await fetch("/api/roadmap");
                if (res.ok) {
                    const data = await res.json();
                    setRoadmap(data);
                }
            } catch (error) {
                console.error("Failed to fetch roadmap", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Generating your personalized roadmap...</div>;
    }

    if (!roadmap) {
        return <div className="p-8 text-center text-slate-500">Could not load roadmap.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Learning Roadmap</h2>
                    <p className="text-slate-500">Your personalized path to mastery</p>
                </div>
                <Badge className="bg-indigo-600 text-lg px-4 py-1">{roadmap.current_level}</Badge>
            </div>

            <Card className="border-indigo-100 bg-indigo-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center text-indigo-900">
                        <Map className="mr-2 h-5 w-5" />
                        Next Milestone: {roadmap.next_milestone}
                    </CardTitle>
                </CardHeader>
            </Card>

            <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:h-full before:w-[2px] before:bg-slate-200">
                {roadmap.steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        <div className="absolute -left-8 top-1 bg-white p-1">
                            {step.status === "completed" ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : step.status === "in-progress" ? (
                                <Circle className="h-6 w-6 fill-indigo-100 text-indigo-600" />
                            ) : (
                                <Lock className="h-6 w-6 text-slate-300" />
                            )}
                        </div>
                        <Card className={`border-slate-200 ${step.status === 'locked' ? 'opacity-60' : ''}`}>
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-slate-800">{step.title}</h3>
                                <p className="text-sm text-slate-600">{step.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
