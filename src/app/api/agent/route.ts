import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, geminiApiKey, categories, skills } = body;

    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        actionType: 'unknown',
        reason: 'no_api_key_configured',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are the intelligence agent for "Personal Tracker" (an app tracking categorized bookmarks, YouTube watch lists, college labs vs AI hackathons, and skills).
Analyze the user's natural language request and determine the exact action to execute.
Categories available: ${JSON.stringify(categories || [])}
Existing skills: ${JSON.stringify(skills || [])}

Rules:
1. "save_youtube": When user pastes or mentions a YouTube URL or video. Decide if it's "to_watch" or "watched", extract title/channel/summary.
2. "save_website": When user pastes a website link. Categorize it appropriately into one of the categories. Generate concise title and tags.
3. "log_milestone": When user reports a finished college lab, assignment, hackathon, or project.
   CRITICAL DISTINCTION:
   - If made in college, coursework, lab, exam, written by hand from scratch -> authorship = "handcrafted" (awards Craftsman XP).
   - If made with AI, prompt engineering, cursor, vibe coded, rapid hackathon -> authorship = "assisted" or "ai_generated" (awards Velocity XP, DO NOT count as core hand-written skill).
4. "search": When user asks to find a saved tool or link.
5. "ideate": When user asks for hackathon ideas or what to build.

Return valid JSON with:
{
  "actionType": "save_youtube" | "save_website" | "log_milestone" | "search" | "ideate",
  "payload": { ...appropriate fields... }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ actionType: 'unknown' });
    }

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Agent API Error:', error);
    return NextResponse.json({ actionType: 'unknown', error: error?.message }, { status: 500 });
  }
}
