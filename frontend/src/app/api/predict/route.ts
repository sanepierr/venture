import { NextRequest, NextResponse } from "next/server";
import { predict } from "@/lib/scoring";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lat, lng } = body as { lat?: number; lng?: number };
    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "lat and lng required" },
        { status: 400 }
      );
    }
    const result = predict(lat, lng);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
