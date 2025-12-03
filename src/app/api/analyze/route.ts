import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { COACH_SYSTEM_PROMPT } from "@/lib/prompts";

// Schema for the structured output
const analysisSchema = z.object({
    rating: z.number().min(0).max(100).describe("Score out of 100 based on correctness and efficiency"),
    correctness_status: z.string().describe("Short status e.g., 'Correct', 'Inefficient', 'Buggy'"),
    critique: z.string().describe("A concise paragraph evaluating the user's code"),
    strengths: z.array(z.string()).describe("List of 2-3 things the user did well"),
    weaknesses: z.array(z.string()).describe("List of 2-3 areas for improvement"),
    topic: z.string().describe("The primary algorithmic topic e.g. 'Arrays', 'DP'"),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).describe("Estimated difficulty level"),
    problem_title: z.string().describe("A short, descriptive title for the problem solved"),
    user_approach: z.string().describe("Brief explanation of the approach used by the user"),
    optimized_approach: z.string().describe("Brief explanation of the optimal approach"),
    optimized_code: z.string().describe("The full optimized code solution"),
    visualization: z.string().describe("Mermaid.js diagram definition. MUST use quoted labels e.g. A['Label']"),
    similar_problems: z.array(z.object({
        name: z.string().describe("Name of the problem"),
        link: z.string().describe("URL to the problem (LeetCode/HackerRank)"),
        difficulty: z.string().describe("Difficulty level (Easy/Medium/Hard)")
    })).describe("List of 3 similar coding problems for practice"),
});

export async function POST(req: Request) {
    try {
        const { code, language } = await req.json();

        // Check if API key is present
        if (!process.env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "OpenAI API Key is missing" }), { status: 500 });
        }

        const result = await generateObject({
            model: openai("gpt-4o"),
            system: COACH_SYSTEM_PROMPT,
            prompt: `Language: ${language}\n\nCode:\n${code}`,
            schema: analysisSchema,
        });

        return new Response(JSON.stringify(result.object), { status: 200 });
    } catch (error) {
        console.error("Analysis failed:", error);
        return new Response(JSON.stringify({ error: "Analysis failed" }), { status: 500 });
    }
}

