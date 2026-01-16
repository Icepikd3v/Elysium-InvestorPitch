import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));

  // TODO: move these to env vars later
  const ok = email === "email@example.com" && password === "123456";
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set({
    name: "elysium_investor_auth",
    value: "1",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  return res;
}
