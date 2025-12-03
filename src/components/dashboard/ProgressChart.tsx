"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";

export function ProgressChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            // Fetch last 7 days of analyses
            const { data: analyses } = await supabase
                .from("analyses")
                .select("rating, created_at")
                .order("created_at", { ascending: true });

            if (analyses && analyses.length > 0) {
                // Group by day (simple implementation)
                const grouped = analyses.reduce((acc: any, curr: any) => {
                    const date = new Date(curr.created_at).toLocaleDateString("en-US", { weekday: 'short' });
                    if (!acc[date]) acc[date] = { name: date, score: 0, count: 0 };
                    acc[date].score += curr.rating;
                    acc[date].count += 1;
                    return acc;
                }, {});

                const formattedData = Object.values(grouped).map((item: any) => ({
                    name: item.name,
                    score: Math.round(item.score / item.count),
                }));
                setData(formattedData);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[300px] w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center">
                <p className="text-slate-400">Loading progress...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-[300px] w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center">
                <p className="text-slate-400">No progress data yet. Start coding!</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-[300px] w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
            <h3 className="mb-4 font-semibold text-slate-700">Weekly Progress</h3>
            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20, // Adjust for Y-axis labels
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#6366f1"
                            strokeWidth={3}
                            activeDot={{ r: 8, fill: "#4f46e5" }}
                            dot={{ fill: "#6366f1", strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
