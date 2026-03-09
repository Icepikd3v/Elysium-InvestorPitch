// src/app/login/page.js
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// HOLD (Kori go-live pending): keep terms gate code built but disabled for now.
// Re-enable by switching this back to:
// process.env.NEXT_PUBLIC_ENABLE_INVESTOR_TERMS_GATE === "true"
const TERMS_GATE_ENABLED = false;

function safeFromParam(raw) {
  // Prevent open redirects: only allow internal paths
  if (!raw || typeof raw !== "string") return "/";
  if (!raw.startsWith("/")) return "/";
  // Optional: block weird protocol-like strings
  if (raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginPage() {
  const router = useRouter();
  const [termsStatus, setTermsStatus] = useState(
    TERMS_GATE_ENABLED ? "pending" : "accepted",
  );

  const [from, setFrom] = useState("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const acceptTerms = () => {
    setTermsStatus("accepted");
  };

  const rejectTerms = () => {
    setTermsStatus("rejected");
  };

  // Read ?from=... safely (without useSearchParams to avoid Vercel prerender error)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const f = params.get("from") || "/";
      setFrom(safeFromParam(f));
    } catch {
      setFrom("/");
    }
  }, []);

  // If already logged in and they visit /login, bounce them to destination.
  useEffect(() => {
    if (TERMS_GATE_ENABLED && termsStatus !== "accepted") return;

    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!cancelled && res.ok) {
          router.replace(from || "/");
          router.refresh();
        }
      } catch {
        // ignore
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router, from, termsStatus]);

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
        router.replace(from || "/"); // Redirect to main pitch page (or original route)
        router.refresh();
        return;
      }

      setError(data.error || "Invalid credentials. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (TERMS_GATE_ENABLED && termsStatus === "rejected") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6 text-black">
        <div className="max-w-xl rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Access Unavailable
          </h1>
          <p className="mt-3 text-sm text-black/70">
            Access is restricted because the terms and conditions were rejected.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-black  font-semibold text-center mb-2">
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-black/20 bg-white px-5 py-3 text-sm text-black placeholder:text-black/40 caret-black selection:bg-black/10 focus:border-black/40 focus:ring-0 outline-none transition"
              placeholder="investor@elysium-digitalglobal.com"
              required
              autoFocus
              autoComplete="username"
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
              autoComplete="current-password"
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
            className={`w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black/90"
            }`}
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-black/50">
          Credentials provided under NDA. Do not share. Contact Samuel for
          access.
        </p>
      </div>

      {TERMS_GATE_ENABLED && termsStatus === "pending" ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 py-10">
          <div className="w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-5 shadow-2xl md:p-7">
            <div className="mx-auto max-h-[56vh] overflow-auto rounded-2xl border border-black/10">
              <Image
                src="/illustrations/InvestorPopup.png"
                alt="Investor terms and conditions"
                width={1400}
                height={1800}
                className="h-auto w-full"
                priority
              />
            </div>

            <p className="mt-5 text-center text-sm font-medium text-black/85 md:text-base">
              I have read and understand the terms and conditions and accept
              them.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={acceptTerms}
                className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                ACCEPT
              </button>
              <button
                type="button"
                onClick={rejectTerms}
                className="rounded-full border border-black/20 bg-white px-7 py-3 text-sm font-semibold text-black/80 hover:border-black/35"
              >
                REJECT
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
