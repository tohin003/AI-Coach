"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, Map, Library, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "AI Coach", href: "/coach", icon: Brain },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Resources", href: "/resources", icon: Library },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-950 text-slate-300">
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <Brain className="h-8 w-8 text-indigo-500" />
                <span className="ml-3 text-lg font-bold text-white tracking-tight">CodeCoach</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-600/10 text-indigo-400"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-800 p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:bg-slate-900 hover:text-white"
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:bg-slate-900 hover:text-red-400 mt-1"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
