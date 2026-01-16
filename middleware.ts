import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/investor", "/"];
// If you want ONLY the investor pitch page protected, change to: ["/"] or ["/investor"] based on your route.
// If your pitch page IS the homepage "/", keep "/".

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals + static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  // Allow login page so we don't create a redirect loop
  if (pathname.startsWith("/login")) return NextResponse.next();

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p),
  );

  if (!isProtected) return NextResponse.next();

  const authed = req.cookies.get("elysium_investor_auth")?.value === "1";
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
