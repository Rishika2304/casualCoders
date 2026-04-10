import { NextResponse } from "next/server";

// Real-world mock database for trusted medicines
const TRUSTED_REGISTRY: Record<string, { name: string; mfg: string; batch: string }> = {
  "8901234567890": { name: "Amoxicillin 500mg", mfg: "Cipla Ltd", batch: "AX-902" },
  "123456789": { name: "Paracetamol BP", mfg: "GSK Pharma", batch: "PR-112" },
  "SAMPLE-QR-001": { name: "Advanced Insulin", mfg: "Novo Nordisk", batch: "IN-440" }
};

export async function POST(req: Request) {
  try {
    const { barcode } = await req.json();

    if (!barcode) {
      return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
    }

    // Simulate network/database lookup latency (makes the UI spinner look like it's working hard!)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const product = TRUSTED_REGISTRY[barcode];

    if (product) {
      return NextResponse.json({
        success: true,
        status: "VERIFIED",
        name: product.name,
        details: product
      });
    }

    // If the barcode is not in our trusted list, flag it!
    return NextResponse.json({
      success: false,
      status: "UNTRUSTED",
      name: `Unrecognized Code: ${barcode}`,
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Server error during verification" }, { status: 500 });
  }
}