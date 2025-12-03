export interface UserProfile {
    id: string;
    name: string;
    skills: SkillMap;
    history: SubmissionHistory[];
}

export type SkillCategory =
    | "Arrays"
    | "Strings"
    | "LinkedLists"
    | "Trees"
    | "Graphs"
    | "DP"
    | "Sorting"
    | "Searching";

export interface SkillMap {
    [key: string]: number; // 0 to 100
}

export interface SubmissionHistory {
    id: string;
    problemId: string;
    problemTitle: string;
    timestamp: string;
    score: number;
    status: "success" | "error" | "warning";
    feedback: AnalysisResult;
}

export interface AnalysisResult {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detectedPatterns: string[];
    complexity: {
        time: string;
        space: string;
    };
}

export interface Problem {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: SkillCategory;
    patterns: string[];
}
