import { NextRequest, NextResponse } from "next/server";

const users: Array<{ id: string; email: string; password: string; name: string; createdAt: string }> = [];

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };
    users.push(user);

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}