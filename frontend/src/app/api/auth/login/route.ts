import { NextRequest, NextResponse } from "next/server";

const users: Array<{ id: string; email: string; password: string; name: string; createdAt: string }> = [];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}