import { NextRequest, NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/demo-users";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}