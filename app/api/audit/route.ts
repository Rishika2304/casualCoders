import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "No image" }, { status: 400 });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as a medical billing auditor. Extract:
      1. total_billed (Total number)
      2. recovery_amount (Estimated overcharge number)
      3. summary (Short reason for overcharge)
      Return ONLY pure JSON: {"total_billed":0, "recovery_amount":0, "summary":""}
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
    ]);

    const text = result.response.text();
    // Use Regex to find JSON even if AI adds extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");
    
    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);

  } catch (error) {
    console.error("API Error"); // Keep log short to avoid terminal issues
    return NextResponse.json({ recovery_amount: 0, summary: "Error auditing bill." }, { status: 500 });
  }
}