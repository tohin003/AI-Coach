"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

export function RecentActivity() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("analyses")
                .select(`
                    id,
                    rating,
                    correctness,
                    created_at,
                    submissions (
                        problem_title,
                        topic,
                        difficulty
                    )
                `)
                .order("created_at", { ascending: false })
                .limit(5);

            if (data) {
                setActivities(data);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center min-h-[200px]">
                <p className="text-slate-400">Loading activity...</p>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-center min-h-[200px]">
                <p className="text-slate-400">No recent activity.</p>
            </div>
        );
    }

    return (
        <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-700">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity) => {
                    const isSuccess = activity.rating >= 70;
                    const problemTitle = activity.submissions?.problem_title || "Unknown Problem";
                    const difficulty = activity.submissions?.difficulty || "Medium";
                    const timeAgo = new Date(activity.created_at).toLocaleDateString();

                    return (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0"
                        >
                            <div className="flex items-center space-x-3">
                                {isSuccess ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-slate-800">{problemTitle}</p>
                                        <Badge variant="outline" className={
                                            difficulty === "Easy" ? "text-green-600 bg-green-50 border-green-200" :
                                                difficulty === "Medium" ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
                                                    "text-red-600 bg-red-50 border-red-200"
                                        }>
                                            {difficulty}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {timeAgo}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        isSuccess
                                            ? "bg-green-100 text-green-800"
                                            : "bg-amber-100 text-amber-800"
                                    )}
                                >
                                    {activity.rating}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
