// src/app/login/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = useMemo(() => {
    // If middleware sent them here, it should include ?from=/whatever
    const f = searchParams.get("from") || "/";
    // Prevent open redirects (only allow internal paths)
    return f.startsWith("/") ? f : "/";
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in and they hit /login, bounce them out.
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) router.replace(from);
      } catch {
        // ignore
      }
    }
    check();
  }, [router, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Redirect to the protected site (usually "/")
        router.replace(from || "/");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Elysium Investor Access
        </h1>
        <p className="text-center text-sm text-black/70 mb-8">
          This area is NDA-protected. Enter your credentials below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black/80 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full rounded-full border border-black/20 bg-white px-5 py-3 text-sm text-black placeholder:text-black/40 caret-black selection:bg-black/10 focus:border-black/40 focus:ring-0 outline-none transition"
              placeholder="investor@elysium-digitalglobal.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black/80 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-black/20 bg-white px-5 py-3 text-sm text-black placeholder:text-black/40 caret-black selection:bg-black/10 focus:border-black/40 focus:ring-0 outline-none transition"
              placeholder="••••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-2xl text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black/90"}`}
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-black/50">
          Credentials provided under NDA. Do not share. Contact Samuel for
          access.
        </p>
      </div>
    </div>
  );
}
