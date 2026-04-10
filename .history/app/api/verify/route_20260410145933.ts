import { NextResponse } from "next/server";

// Mock Database of Medicine Safety
const MEDICINE_DB = [
  { name: "Paracetamol", status: "Safe", warning: "None" },
  { name: "Codeine", status: "Caution", warning: "Addictive potential" },
  { name: "BannedSubstanceX", status: "BANNED", warning: "Illegal in this region" }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const foundMed = MEDICINE_DB.find(m => m.name.toLowerCase() === body.medicine.toLowerCase());

    if (foundMed) {
      return NextResponse.json({ 
        success: true, 
        message: `Status: ${foundMed.status} | Warning: ${foundMed.warning}` 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Medicine not in local database. Analyzing via AI..." 
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }
}