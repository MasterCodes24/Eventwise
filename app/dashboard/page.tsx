import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

async function DashboardContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h2 className="text-xl font-semibold">Please log in</h2>
        <p className="mt-2 text-slate-400">
          You need to log in to view your saved plans.
        </p>
      </div>
    );
  }

  const { data: plans, error } = await supabase
    .from("plans")
    .select(
      "id, title, event_type, city, event_date, guest_count, budget, currency, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Dashboard plans error:", error);
  }

  return (
    <DashboardClient userEmail={user.email ?? ""} initialPlans={plans ?? []} />
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Suspense
          fallback={
            <p className="text-slate-400">Loading your dashboard...</p>
          }
        >
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}