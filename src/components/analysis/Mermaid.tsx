"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "inherit",
});

interface MermaidProps {
    chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && chart) {
            mermaid.contentLoaded();
            const render = async () => {
                try {
                    const { svg } = await mermaid.render(
                        `mermaid-${Math.random().toString(36).substr(2, 9)}`,
                        chart
                    );
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error("Mermaid render error:", error);
                    if (ref.current) {
                        ref.current.innerHTML = "<p class='text-red-500 text-sm'>Failed to render chart</p>";
                    }
                }
            };
            render();
        }
    }, [chart]);

    return <div ref={ref} className="flex justify-center p-4" />;
}
