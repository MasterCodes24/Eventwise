"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PlanSummary = {
  id: string;
  title: string;
  event_type: string;
  city: string | null;
  event_date: string | null;
  guest_count: number | null;
  budget: number | null;
  currency: string | null;
  created_at: string;
};

export default function DashboardClient({
  userEmail,
  initialPlans,
}: {
  userEmail: string;
  initialPlans: PlanSummary[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const deletePlan = async (id: string) => {
    const confirmed = confirm("Delete this plan permanently?");
    if (!confirmed) return;

    await supabase.from("plans").delete().eq("id", id);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Event<span className="text-fuchsia-400">Wise</span> Dashboard
            </h1>
            <p className="mt-1 text-slate-400">{userEmail}</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/new-plan"
              className="rounded-xl bg-fuchsia-600 px-5 py-3 font-semibold hover:bg-fuchsia-500"
            >
              + New Plan
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </div>

        {initialPlans.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">No saved plans yet</h2>
            <p className="mt-2 text-slate-400">
              Create your first wedding, birthday, or community event plan.
            </p>

            <Link
              href="/new-plan"
              className="mt-6 inline-block rounded-xl bg-fuchsia-600 px-6 py-3 font-semibold hover:bg-fuchsia-500"
            >
              Create your first plan
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {initialPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{plan.title}</h3>
                  <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
                    {plan.event_type}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-slate-400">
                  <p>📍 {plan.city || "Location not set"}</p>
                  <p>📅 {plan.event_date || "Date not set"}</p>
                  <p>👥 {plan.guest_count ?? "—"} guests</p>
                  <p>
                    💰 {plan.budget ?? "—"} {plan.currency || ""}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/plan/${plan.id}`}
                    className="flex-1 rounded-xl border border-fuchsia-500 px-4 py-2 text-center text-sm font-semibold text-fuchsia-300 hover:bg-fuchsia-500/10"
                  >
                    Open
                  </Link>

                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="rounded-xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}