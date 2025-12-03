"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isAnalyzing: boolean;
}

export function CodeInput({ value, onChange, onSubmit, isAnalyzing }: CodeInputProps) {
    return (
        <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="font-semibold text-slate-700">Code Submission</h3>
                <div className="flex items-center space-x-2">
                    <select className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none">
                        <option>Java</option>
                        <option>Python</option>
                        <option>C++</option>
                        <option>JavaScript</option>
                    </select>
                </div>
            </div>
            <div className="relative flex-1">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-full w-full resize-none p-4 font-mono text-sm text-slate-800 focus:outline-none"
                    placeholder="// Paste your solution here..."
                    spellCheck={false}
                />
            </div>
            <div className="border-t border-slate-200 p-4 bg-slate-50 rounded-b-lg">
                <button
                    onClick={onSubmit}
                    disabled={isAnalyzing || !value.trim()}
                    className={cn(
                        "w-full rounded-md px-4 py-2 font-medium text-white transition-colors",
                        isAnalyzing || !value.trim()
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                >
                    {isAnalyzing ? "Analyzing..." : "Analyze Solution"}
                </button>
            </div>
        </div>
    );
}
