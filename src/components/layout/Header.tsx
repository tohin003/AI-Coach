"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
    const { user, signOut } = useAuth();

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

                {user ? (
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-slate-700">{user.email?.split('@')[0]}</p>
                            <p className="text-xs text-slate-500">Pro Member</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 border border-slate-200">
                                        {/* Using the custom logo as requested */}
                                        <AvatarImage src="/user-logo.jpg" alt="User Profile" className="object-cover" />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                            {user.email?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.email?.split('@')[0]}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
