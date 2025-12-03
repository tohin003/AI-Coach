import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "OpenAI API Key is missing" }), { status: 500 });
        }

        const systemPrompt = `You are a helpful coding coach assistant.
        The user is asking questions about their code or your analysis.
        
        Context:
        - User's Code: ${context.code}
        - Your Analysis: ${JSON.stringify(context.analysis)}
        
        Answer their questions clearly and concisely. If they ask for code changes, provide snippets.`;

        const { text } = await generateText({
            model: openai("gpt-4o"),
            system: systemPrompt,
            messages: messages,
        });

        return new Response(JSON.stringify({ message: text }), { status: 200 });
    } catch (error) {
        console.error("Chat failed:", error);
        return new Response(JSON.stringify({ error: "Chat failed" }), { status: 500 });
    }
}
