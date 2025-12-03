import { CheckCircle, Circle, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    title: string;
    description: string;
    status: "completed" | "current" | "upcoming";
    date: string;
}

const steps: Step[] = [
    {
        id: "1",
        title: "Week 1: Array Manipulation",
        description: "Master Two Pointers and Sliding Window techniques.",
        status: "completed",
        date: "Oct 1 - Oct 7",
    },
    {
        id: "2",
        title: "Week 2: Hashing & Maps",
        description: "Deep dive into Hash Maps and Sets for O(1) lookups.",
        status: "current",
        date: "Oct 8 - Oct 14",
    },
    {
        id: "3",
        title: "Week 3: Linked Lists",
        description: "Traversal, reversal, and cycle detection algorithms.",
        status: "upcoming",
        date: "Oct 15 - Oct 21",
    },
    {
        id: "4",
        title: "Week 4: Trees & DFS",
        description: "Recursive traversal and binary tree properties.",
        status: "upcoming",
        date: "Oct 22 - Oct 28",
    },
];

export function Timeline() {
    return (
        <div className="relative space-y-8 pl-8 before:absolute before:left-3.5 before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
            {steps.map((step, index) => (
                <div key={step.id} className="relative">
                    <div
                        className={cn(
                            "absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white",
                            step.status === "completed"
                                ? "border-green-500 text-green-500"
                                : step.status === "current"
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-slate-300 text-slate-300"
                        )}
                    >
                        {step.status === "completed" ? (
                            <CheckCircle className="h-4 w-4" />
                        ) : (
                            <Circle className={cn("h-4 w-4", step.status === "current" && "fill-indigo-600")} />
                        )}
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800">{step.title}</h3>
                            <span className="text-xs font-medium text-slate-500">{step.date}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                        {step.status === "current" && (
                            <div className="mt-4">
                                <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
                                    Continue Learning
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
