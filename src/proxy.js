import { NextResponse } from "next/server";

export function proxy() {
  // InvestorPitch is now public; NDA popup on the page handles acknowledgement.
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
