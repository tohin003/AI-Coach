import { Problem, SkillCategory } from "./types";

const PROBLEM_DATABASE: Problem[] = [
    { id: "1", title: "Two Sum", difficulty: "Easy", category: "Arrays", patterns: ["hash map"] },
    { id: "15", title: "3Sum", difficulty: "Medium", category: "Arrays", patterns: ["two pointers"] },
    { id: "200", title: "Number of Islands", difficulty: "Medium", category: "Graphs", patterns: ["dfs", "bfs"] },
    { id: "70", title: "Climbing Stairs", difficulty: "Easy", category: "DP", patterns: ["memoization"] },
    { id: "3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Strings", patterns: ["sliding window"] },
];

export function getRecommendations(gaps: SkillCategory[]): Problem[] {
    // Filter problems that match the gaps
    const recommendations = PROBLEM_DATABASE.filter((p) => gaps.includes(p.category));

    // If no specific gaps found or no matching problems, return a mix
    if (recommendations.length === 0) {
        return PROBLEM_DATABASE.slice(0, 3);
    }

    return recommendations;
}
