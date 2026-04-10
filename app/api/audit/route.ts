import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    // Phase 2: Mocking the AI response
    // In Phase 3, we will plug the Gemini API Key here
    return NextResponse.json({ 
      analysis: "AI Analysis: Bill looks authentic. No price gouging detected.",
      confidence: 0.98,
      status: "Verified by Gemini AI"
    });
  } catch (error) {
    return NextResponse.json({ error: "AI Audit failed to process image" }, { status: 500 });
  }
}