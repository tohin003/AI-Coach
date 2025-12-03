"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4"];

export function TopicDistribution() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: submissions } = await supabase
                .from("submissions")
                .select("topic");

            if (submissions) {
                const topicCounts: Record<string, number> = {};
                submissions.forEach((sub) => {
                    const topic = sub.topic || "Other";
                    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
                });

                const chartData = Object.entries(topicCounts).map(([name, value]) => ({
                    name,
                    value,
                }));

                setData(chartData);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center min-h-[300px]">
                <p className="text-slate-400">Loading topics...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center min-h-[300px]">
                <p className="text-slate-400">No topic data yet.</p>
            </div>
        );
    }

    return (
        <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-700">Topic Distribution</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
