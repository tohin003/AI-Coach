import { ExternalLink, PlayCircle, FileText } from "lucide-react";

interface Resource {
    id: string;
    title: string;
    type: "video" | "article";
    duration: string;
    author: string;
    url: string;
    thumbnail?: string;
}

const resources: Resource[] = [
    {
        id: "1",
        title: "Mastering Two Pointers",
        type: "video",
        duration: "15 min",
        author: "NeetCode",
        url: "#",
    },
    {
        id: "2",
        title: "Understanding Hash Maps Internals",
        type: "article",
        duration: "10 min read",
        author: "GeeksForGeeks",
        url: "#",
    },
    {
        id: "3",
        title: "Dynamic Programming Patterns",
        type: "video",
        duration: "45 min",
        author: "FreeCodeCamp",
        url: "#",
    },
];

export function ResourceList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
                <div
                    key={resource.id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                    <div className="flex h-32 items-center justify-center bg-slate-100">
                        {resource.type === "video" ? (
                            <PlayCircle className="h-12 w-12 text-slate-400 group-hover:text-indigo-600" />
                        ) : (
                            <FileText className="h-12 w-12 text-slate-400 group-hover:text-indigo-600" />
                        )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                        <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">
                            {resource.title}
                        </h3>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                            <span>{resource.author}</span>
                            <span>{resource.duration}</span>
                        </div>
                        <div className="mt-4 flex flex-1 items-end">
                            <a
                                href={resource.url}
                                className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                View Resource <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
