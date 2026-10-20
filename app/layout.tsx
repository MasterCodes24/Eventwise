import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventWise — GenAI Event Planning Assistant",
  description:
    "Plan weddings, birthdays, and community events with AI-generated budgets, timelines, vendor checklists, and personalized ideas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}