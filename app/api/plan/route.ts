import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `
You are EventWise, an expert GenAI event-planning assistant.

Create practical, personalized, budget-aware plans for weddings,
birthdays, and community events.

Rules:
- Use the user's event type, city, date, guest count, budget, food needs,
  style, and priorities.
- Give realistic estimated costs in the user's currency.
- Provide actionable tasks with deadlines.
- Include vendor categories and questions to ask vendors.
- Offer low-cost, balanced, and premium idea options.
- Do not invent confirmed vendor prices.
- Return only valid JSON.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      eventType,
      city,
      eventDate,
      guestCount,
      budget,
      currency = "INR",
      vibe,
      foodPreference,
      extraNotes,
    } = body;

    if (!eventType || !city || !eventDate || !guestCount || !budget) {
      return NextResponse.json(
        {
          error:
            "Please provide event type, city, date, guest count, and budget.",
        },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing. Add GEMINI_API_KEY to .env.local." },
        { status: 500 }
      );
    }

    const userPrompt = `
Plan a ${eventType} in ${city} on ${eventDate}.

Details:
- Guest count: ${guestCount}
- Total budget: ${budget} ${currency}
- Vibe/style: ${vibe || "Not specified"}
- Food preference: ${foodPreference || "Not specified"}
- Additional requirements: ${extraNotes || "None"}

Return JSON with exactly this structure:
{
  "eventTitle": "string",
  "summary": "2-3 sentence event summary",
  "budget": [
    {
      "category": "string",
      "amount": number,
      "percentage": number,
      "notes": "string"
    }
  ],
  "timeline": [
    {
      "period": "string",
      "tasks": ["string"],
      "priority": "High | Medium | Low"
    }
  ],
  "vendors": [
    {
      "vendorType": "string",
      "whyNeeded": "string",
      "estimatedCost": number,
      "questions": ["string"],
      "bookingPriority": "Book first | Book early | Book later"
    }
  ],
  "ideas": {
    "budgetFriendly": ["string"],
    "balanced": ["string"],
    "premium": ["string"]
  },
  "risks": ["string"],
  "dayOfSchedule": [
    {
      "time": "string",
      "activity": "string",
      "owner": "string"
    }
  ]
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Failed to generate event plan. Please try again.",
        },
        { status: response.status }
      );
    }

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let plan;

    try {
      plan = JSON.parse(rawText);
    } catch {
      console.error("Invalid JSON from Gemini:", rawText);
      return NextResponse.json(
        { error: "AI returned an invalid plan. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("EventWise API error:", error);
    return NextResponse.json(
      { error: "Failed to generate event plan. Please try again." },
      { status: 500 }
    );
  }
}