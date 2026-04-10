import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    return NextResponse.json({ 
      success: true, 
      message: "Verify API is Online",
      received: data 
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}