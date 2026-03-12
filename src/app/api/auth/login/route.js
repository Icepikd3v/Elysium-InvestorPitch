import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const INVESTOR_EMAIL = "investor@elysiummall.com";
const INVESTOR_PASSWORD = "Elysium26!";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const inputEmail = email.trim().toLowerCase();

    if (inputEmail === INVESTOR_EMAIL && password === INVESTOR_PASSWORD) {
      const cookieStore = await cookies();

      cookieStore.set("nda_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
