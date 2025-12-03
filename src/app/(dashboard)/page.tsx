"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { SkillRadar } from "@/components/dashboard/SkillRadar";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TopicDistribution } from "@/components/dashboard/TopicDistribution";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signup");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) return null; // Prevent flash while redirecting

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user.email?.split('@')[0] || 'Student'}</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkillRadar />
        <ProgressChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <RecentActivity />
            <TopicDistribution />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-sm h-fit">
          <h3 className="text-lg font-semibold">Next Goal</h3>
          <p className="mt-2 text-indigo-100">
            Master <strong>Sliding Window</strong> patterns.
          </p>
          <div className="mt-6">
            <button className="w-full rounded-md bg-white py-2 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
