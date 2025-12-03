import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                    <Bell className="h-5 w-5" />
                </Button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center space-x-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-700">John Doe</p>
                        <p className="text-xs text-slate-500">Pro Member</p>
                    </div>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">JD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
