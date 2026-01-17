import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  // Always allow the login page
  if (pathname === "/login") return NextResponse.next();

  // Always allow Next internals + API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Always allow public files + common static asset paths
  // (IMPORTANT: /illustrations, /images, /assets, etc.)
  if (
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/illustrations") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/.well-known") ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|woff|woff2|ttf)$/.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("nda_session")?.value;

  // Not authenticated -> redirect to login
  if (session !== "authenticated") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";

    // Preserve where they were trying to go (including querystring)
    loginUrl.searchParams.set("from", pathname + (search || ""));

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
