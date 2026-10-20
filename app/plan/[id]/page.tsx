import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import PlanDetails from "./PlanDetails";

async function PlanContent({ id }: { id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h2 className="text-xl font-semibold">Please log in</h2>
        <p className="mt-2 text-slate-400">
          You need to log in to view this plan.
        </p>
      </div>
    );
  }

  const { data: plan, error } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !plan) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h2 className="text-xl font-semibold">Plan not found</h2>
        <p className="mt-2 text-slate-400">
          This plan may have been deleted or belongs to another account.
        </p>
      </div>
    );
  }

  return <PlanDetails plan={plan} />;
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <Suspense
          fallback={<p className="text-slate-400">Loading event plan...</p>}
        >
          <PlanContent id={id} />
        </Suspense>
      </div>
    </main>
  );
}