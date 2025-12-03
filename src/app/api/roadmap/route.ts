import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const roadmapSchema = z.object({
    current_level: z.string().describe("Current skill level e.g. Beginner, Intermediate"),
    next_milestone: z.string().describe("The next major goal"),
    steps: z.array(z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum(["completed", "in-progress", "locked"]),
    })).describe("List of steps to reach the milestone"),
});

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        // Fetch recent submissions to understand user context
        const { data: submissions } = await supabase
            .from("submissions")
            .select("topic, problem_title, analyses(rating)")
            .order("created_at", { ascending: false })
            .limit(10);

        if (!submissions || submissions.length === 0) {
            return new Response(JSON.stringify({
                current_level: "Beginner",
                next_milestone: "Solve your first problem",
                steps: [
                    { title: "Learn Arrays", description: "Start with basic array operations.", status: "in-progress" },
                    { title: "Learn Strings", description: "Understand string manipulation.", status: "locked" },
                ]
            }), { status: 200 });
        }

        const context = submissions.map(s =>
            `Problem: ${s.problem_title}, Topic: ${s.topic}, Score: ${s.analyses?.[0]?.rating || 0}`
        ).join("\n");

        const result = await generateObject({
            model: openai("gpt-4o"),
            system: "You are a coding career coach. Generate a personalized learning roadmap based on the student's recent history. Rules:\n1. If the user has a high score (>80) in a topic, mark related steps as 'completed'.\n2. If the user has a low score or recent attempt, mark it as 'in-progress'.\n3. Suggest logical next steps as 'locked' or 'in-progress'.\n4. Be encouraging but realistic.",
            prompt: `Student History:\n${context}\n\nGenerate a roadmap to mastery.`,
            schema: roadmapSchema,
        });

        return new Response(JSON.stringify(result.object), { status: 200 });
    } catch (error) {
        console.error("Roadmap generation failed:", error);
        return new Response(JSON.stringify({ error: "Failed to generate roadmap" }), { status: 500 });
    }
}
