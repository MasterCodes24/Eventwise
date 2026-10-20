"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewPlanPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    eventType: "Wedding",
    city: "",
    eventDate: "",
    guestCount: "",
    budget: "",
    currency: "INR",
    vibe: "",
    foodPreference: "",
    extraNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    setGeneratedPlan(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      setGeneratedPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan) return;

    setSaving(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("plans")
        .insert({
          user_id: user.id,
          title: generatedPlan.eventTitle,
          event_type: form.eventType,
          city: form.city,
          event_date: form.eventDate || null,
          guest_count: Number(form.guestCount),
          budget: Number(form.budget),
          currency: form.currency,
          plan_data: generatedPlan,
        })
        .select("id")
        .single();

      if (error) throw error;

      router.push(`/plan/${data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-fuchsia-400 hover:underline">
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Create a new event plan</h1>
        <p className="mt-2 text-slate-400">
          Enter your event details and EventWise will generate a personalized
          plan.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <select
              name="eventType"
              className="input"
              value={form.eventType}
              onChange={handleChange}
            >
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Community Event</option>
              <option>Engagement</option>
              <option>Anniversary</option>
              <option>Other</option>
            </select>

            <input
              name="city"
              className="input"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            <input
              name="eventDate"
              type="date"
              className="input"
              value={form.eventDate}
              onChange={handleChange}
            />

            <input
              name="guestCount"
              type="number"
              className="input"
              placeholder="Guest count"
              value={form.guestCount}
              onChange={handleChange}
            />

            <input
              name="budget"
              type="number"
              className="input"
              placeholder="Total budget"
              value={form.budget}
              onChange={handleChange}
            />

            <select
              name="currency"
              className="input"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
            </select>

            <input
              name="vibe"
              className="input"
              placeholder="Vibe: traditional, modern, fun, elegant"
              value={form.vibe}
              onChange={handleChange}
            />

            <input
              name="foodPreference"
              className="input"
              placeholder="Food preference"
              value={form.foodPreference}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="extraNotes"
            className="input mt-4 h-28"
            placeholder="Extra details: outdoor venue, cake, DJ, cultural rituals, photography, accessibility needs..."
            value={form.extraNotes}
            onChange={handleChange}
          />

          <button
            onClick={generatePlan}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-fuchsia-600 py-3 font-semibold hover:bg-fuchsia-500 disabled:opacity-50"
          >
            {loading ? "Generating plan..." : "Generate AI Plan"}
          </button>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-300">
              {error}
            </p>
          )}
        </section>

        {generatedPlan && (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">{generatedPlan.eventTitle}</h2>
            <p className="mt-2 text-slate-300">{generatedPlan.summary}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-800 p-4">
                <h3 className="font-semibold">Budget Categories</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  {generatedPlan.budget.map((b: any, i: number) => (
                    <li key={i}>
                      {b.category}: {b.amount} ({b.percentage}%)
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <h3 className="font-semibold">Vendor Types</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                  {generatedPlan.vendors.map((v: any, i: number) => (
                    <li key={i}>{v.vendorType}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={savePlan}
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? "Saving plan..." : "Save to My Dashboard"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}