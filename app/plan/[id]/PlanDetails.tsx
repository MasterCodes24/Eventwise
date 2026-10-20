"use client";

import Link from "next/link";

export default function PlanDetails({ plan }: { plan: any }) {
  const p = plan.plan_data;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="text-fuchsia-400 hover:underline">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">{p.eventTitle}</h1>
        <p className="mt-2 text-slate-300">{p.summary}</p>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Budget Plan</h2>

          {p.budget.map((item: any, i: number) => (
            <div key={i} className="mb-3 rounded-xl bg-slate-800 p-4">
              <div className="flex justify-between font-semibold">
                <span>{item.category}</span>
                <span>
                  {item.amount} ({item.percentage}%)
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">{item.notes}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Planning Timeline</h2>

          {p.timeline.map((phase: any, i: number) => (
            <div key={i} className="mb-4 rounded-xl bg-slate-800 p-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{phase.period}</h3>
                <span className="text-sm text-fuchsia-300">
                  {phase.priority}
                </span>
              </div>

              <ul className="mt-2 list-disc pl-5 text-slate-300">
                {phase.tasks.map((task: string, j: number) => (
                  <li key={j}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Vendor Checklist</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {p.vendors.map((vendor: any, i: number) => (
              <div key={i} className="rounded-xl bg-slate-800 p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{vendor.vendorType}</h3>
                  <span className="text-sm text-emerald-300">
                    {vendor.estimatedCost}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  {vendor.whyNeeded}
                </p>

                <p className="mt-2 text-xs uppercase tracking-wide text-fuchsia-300">
                  {vendor.bookingPriority}
                </p>

                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  {vendor.questions.map((q: string, j: number) => (
                    <li key={j}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Personalized Ideas</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Budget-Friendly", p.ideas.budgetFriendly],
              ["Balanced", p.ideas.balanced],
              ["Premium", p.ideas.premium],
            ].map(([title, items]: any, i: number) => (
              <div key={i} className="rounded-xl bg-slate-800 p-4">
                <h3 className="font-semibold text-fuchsia-300">{title}</h3>

                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  {items.map((item: string, j: number) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Risks</h2>

            <ul className="list-disc pl-5 text-slate-300">
              {p.risks.map((risk: string, i: number) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">Day-of Schedule</h2>

            <ul className="space-y-2 text-slate-300">
              {p.dayOfSchedule.map((item: any, i: number) => (
                <li key={i}>
                  <span className="font-semibold text-white">
                    {item.time}:
                  </span>{" "}
                  {item.activity} — {item.owner}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}