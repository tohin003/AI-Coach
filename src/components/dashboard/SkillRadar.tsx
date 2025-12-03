"use client";

import { useEffect, useState } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";

export function SkillRadar() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: analyses } = await supabase
                .from("analyses")
                .select(`
                    rating,
                    submissions (
                        topic
                    )
                `);

            if (analyses && analyses.length > 0) {
                // Group by topic
                const grouped = analyses.reduce((acc: any, curr: any) => {
                    const topic = curr.submissions?.topic || "Other";
                    if (!acc[topic]) acc[topic] = { subject: topic, A: 0, count: 0, fullMark: 100 };
                    acc[topic].A += curr.rating;
                    acc[topic].count += 1;
                    return acc;
                }, {});

                const formattedData = Object.values(grouped).map((item: any) => ({
                    subject: item.subject,
                    A: Math.round(item.A / item.count),
                    fullMark: 100,
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
                <p className="text-slate-400">Loading skills...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-[300px] w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center">
                <p className="text-slate-400">No skill data yet.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-[300px] w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
            <h3 className="mb-4 font-semibold text-slate-700">Skill Proficiency</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="My Skills"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#818cf8"
                        fillOpacity={0.5}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
