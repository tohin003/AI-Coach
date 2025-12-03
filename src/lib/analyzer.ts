import { AnalysisResult, SkillCategory } from "./types";

// Mock patterns to detect based on keywords
const PATTERNS = {
    "two pointers": ["left", "right", "while (left < right)", "start", "end"],
    "sliding window": ["window", "start", "end", "max_len", "current_sum"],
    "hash map": ["Map", "HashMap", "dict", "lookup", "frequency"],
    "bfs": ["Queue", "queue", "level", "visited"],
    "dfs": ["recursion", "stack", "visited", "depth"],
};

export function analyzeCode(code: string, language: string): AnalysisResult {
    // Simple keyword-based heuristic for the demo
    const detectedPatterns: string[] = [];
    Object.entries(PATTERNS).forEach(([pattern, keywords]) => {
        if (keywords.some((k) => code.includes(k))) {
            detectedPatterns.push(pattern);
        }
    });

    // Randomize score slightly for realism
    const baseScore = 70;
    const randomFactor = Math.floor(Math.random() * 20);
    const score = Math.min(100, baseScore + randomFactor + (detectedPatterns.length * 5));

    const strengths = [
        "Code structure is readable",
        detectedPatterns.length > 0
            ? `Correctly identified ${detectedPatterns[0]} pattern`
            : "Basic logic seems sound",
    ];

    const weaknesses = [];
    if (detectedPatterns.length === 0) {
        weaknesses.push("Could not identify a standard optimal pattern");
    }
    if (!code.includes("if") || !code.includes("return")) {
        weaknesses.push("Missing edge case handling or return statements");
    }
    if (code.length < 50) {
        weaknesses.push("Solution seems too short, check for completeness");
    }

    const recommendations = [
        "Review time complexity analysis",
        "Check for boundary conditions (empty input, null)",
    ];

    return {
        score,
        strengths,
        weaknesses,
        recommendations,
        detectedPatterns,
        complexity: {
            time: "O(n)", // Mock
            space: "O(1)", // Mock
        },
    };
}

export function detectKnowledgeGaps(history: AnalysisResult[]): SkillCategory[] {
    // Mock logic: if recent average score is low, flag as gap
    // For now, just return a static list for the demo
    return ["DP", "Graphs"];
}
