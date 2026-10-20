# 🎉 EventWise — GenAI Event Planning Assistant

**EventWise** is a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events. Users enter their event details, and EventWise generates a personalized, budget-aware plan including a timeline, vendor checklist, creative ideas, risks, and a day-of schedule.

🔗 **Live Demo:** [Add your Vercel URL here]  
🧠 **Built for:** PromptWars  

---

## ✨ Features

- **AI-powered event planning** for weddings, birthdays, community events, engagements, and anniversaries.
- **Personalized budgets** based on event type, city, guest count, total budget, and preferences.
- **Countdown timelines** with prioritized tasks and deadlines.
- **Vendor checklists** with estimated costs, booking priorities, and questions to ask vendors.
- **Personalized ideas** in budget-friendly, balanced, and premium tiers.
- **Risk alerts** for common planning mistakes and last-minute issues.
- **Day-of schedule** with activities, timings, and owners.
- **User accounts** using email and password authentication.
- **Personal dashboard** where users can view, open, and delete saved plans.
- **Secure per-user data** using Supabase Row Level Security.

---

## 🧠 GenAI Services Utilized

### Google Gemini API

**Service used:** Google Gemini API  
**Model used:** `gemini-3.8-flash`  
**Where it is used:** `app/api/plan/route.ts`  
**Purpose:** Event plan generation

EventWise uses the Gemini `generateContent` API to convert a user’s natural-language event brief into a structured event plan.

The user provides details such as:

- Event type
- City
- Event date
- Guest count
- Total budget
- Preferred vibe/theme
- Food preferences
- Additional requirements

Gemini then returns structured JSON containing:

- Event title and summary
- Budget categories and estimated allocations
- Planning timeline
- Vendor checklist
- Budget-friendly, balanced, and premium ideas
- Planning risks
- Day-of schedule

The application uses `responseMimeType: "application/json"` so Gemini returns valid JSON, which is parsed and displayed in the EventWise dashboard.

**Example prompt sent to Gemini:**

```text
Plan a Wedding in Pune on 2026-12-12.

Details:
- Guest count: 200
- Total budget: 800000 INR
- Vibe/style: Traditional-modern
- Food preference: Vegetarian
- Additional requirements: Photography, décor, DJ, marigold theme
```

**Example Gemini output categories:**

```json
{
  "eventTitle": "Royal Marigold Wedding",
  "budget": [],
  "timeline": [],
  "vendors": [],
  "ideas": {},
  "risks": [],
  "dayOfSchedule": []
}
```

### How GenAI adds value

Instead of giving users a static event-planning template, EventWise generates a plan that adapts to the user’s actual budget, location, guest count, cultural preferences, and event type. For example, a ₹75,000 birthday plan will receive different recommendations from a ₹10 lakh wedding plan.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, TypeScript |
| Styling | Tailwind CSS v4 |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Security | Supabase Row Level Security |
| GenAI | Google Gemini API |
| Deployment | Vercel |
| Version Control | GitHub |

---

## 🏗️ Architecture

```text
User
 ↓ Event details
Next.js Frontend
 ↓ POST /api/plan
Next.js API Route
 ↓ Gemini generateContent API
Google Gemini
 ↓ Structured JSON plan
Next.js Dashboard
 ↓ Save plan
Supabase PostgreSQL
 ↓ User-specific plans
Personal Dashboard
```

---

## 📁 Project Structure

```text
eventwise/
├── app/
│   ├── api/
│   │   └── plan/
│   │       └── route.ts             # Gemini-powered plan generation API
│   ├── dashboard/
│   │   ├── page.tsx                 # Protected dashboard page
│   │   └── DashboardClient.tsx      # Dashboard UI
│   ├── login/
│   │   └── page.tsx                 # Email/password login
│   ├── new-plan/
│   │   └── page.tsx                 # Create and save AI event plans
│   ├── plan/
│   │   └── [id]/
│   │       ├── page.tsx             # Open a saved plan
│   │       └── PlanDetails.tsx      # Full plan view
│   ├── signup/
│   │   └── page.tsx                 # Email/password signup
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Landing page
├── lib/
│   └── supabase/
│       ├── client.ts                # Supabase browser client
│       ├── middleware.ts            # Session refresh helper
│       └── server.ts                # Supabase server client
├── proxy.ts                         # Route protection
├── next.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Supabase account
- Google AI Studio account
- Vercel account

### 1. Clone the repository

```bash
git clone [https://github.com/YOUR_USERNAME/eventwise.git](https://github.com/YOUR_USERNAME/eventwise.git)
cd eventwise
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase

Create a table named `plans` in the Supabase SQL Editor:

```sql
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_type text not null,
  city text,
  event_date date,
  guest_count int,
  budget numeric,
  currency text default 'INR',
  plan_data jsonb not null,
  created_at timestamptz default now()
);

alter table public.plans enable row level security;

create policy "Users can view their own plans"
on public.plans for select
using (auth.uid() = user_id);

create policy "Users can insert their own plans"
on public.plans for insert
with check (auth.uid() = user_id);

create policy "Users can update their own plans"
on public.plans for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own plans"
on public.plans for delete
using (auth.uid() = user_id);
```

### 5. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📝 How to Use

1. Open EventWise.
2. Sign up using your email and password.
3. Go to the dashboard.
4. Click **+ New Plan**.
5. Enter your event details.
6. Click **Generate AI Plan**.
7. Review the generated budget, timeline, vendors, ideas, risks, and schedule.
8. Click **Save to My Dashboard**.
9. Return anytime to view or delete saved plans.

---

## 🔐 Security

- Passwords are handled securely by Supabase Auth.
- Every plan is linked to the logged-in user’s `user_id`.
- Supabase Row Level Security ensures users can access only their own plans.
- API keys are stored as environment variables and are never exposed in the frontend.

---

## 🌟 Future Scope

- AI-generated mood boards and invitation designs.
- RSVP tracking and guest meal preferences.
- Vendor quote comparison and payment tracking.
- Collaborative planning for families and event committees.
- WhatsApp sharing for checklists and schedules.
- Location-aware vendor discovery.
- Budget-vs-actual expense tracking.

---

## 👤 Author

**Mohammed Muin Imran Sawant**  

🔗 GitHub: [MasterCodes24](https://github.com/MasterCodes24)  
🔗 LinkedIn: www.linkedin.com/in/mohammed-muin-i-sawant-2515b7397

---

## 📄 License

This project was created for PromptWars.
