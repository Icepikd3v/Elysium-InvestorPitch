import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals + static assets + API routes + login page
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    /\.(png|jpg|jpeg|webp|svg|ico|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Protect ONLY the pitch homepage "/"
  if (pathname !== "/") return NextResponse.next();

  const authed = req.cookies.get("elysium_investor_auth")?.value === "1";
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", "/");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
