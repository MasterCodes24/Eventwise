import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function AuthButtons() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {user ? (
        <Link
          href="/dashboard"
          className="rounded-xl bg-fuchsia-600 px-8 py-4 font-semibold hover:bg-fuchsia-500"
        >
          Go to Dashboard
        </Link>
      ) : (
        <>
          <Link
            href="/signup"
            className="rounded-xl bg-fuchsia-600 px-8 py-4 font-semibold hover:bg-fuchsia-500"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-700 px-8 py-4 font-semibold hover:bg-slate-800"
          >
            Log In
          </Link>
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-5xl font-bold">
          Event<span className="text-fuchsia-400">Wise</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Your GenAI planning assistant for weddings, birthdays, and community
          events. Get a personalized budget, timeline, vendor checklist, and
          celebration ideas in minutes.
        </p>

        <Suspense
          fallback={
            <div className="mt-10 text-slate-400">Loading...</div>
          }
        >
          <AuthButtons />
        </Suspense>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Smart Budgets",
              text: "Get category-wise budget plans based on your total budget and guest count.",
            },
            {
              title: "Countdown Timelines",
              text: "Know exactly what to do weeks, days, and hours before the event.",
            },
            {
              title: "Vendor Checklists",
              text: "Track vendors, estimated costs, booking priorities, and questions to ask.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}