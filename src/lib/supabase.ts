import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Supabase Environment Variables missing!");
        // Return a dummy client or null to prevent crash, but better to throw a handled error
        // For now, let's return a dummy object that matches the shape if possible, 
        // or just let it throw but with a clear message.
        // Actually, createBrowserClient throws if args are missing.
        // We'll return null and handle it in the consumer? No, that breaks TS.
        // We'll throw a clear error.
        throw new Error("Supabase URL or Key is missing. Check .env.local");
    }

    return createBrowserClient(url, key);
}
