import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.NEXTAUTH_SECRET || "albarkah-dev-secret-key-change-me";
const KEY = new TextEncoder().encode(SECRET);
const COOKIE_NAME = "albarkah_session";

async function getRole(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, KEY);
    return (payload.role as string) ?? "user";
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/plans") || pathname.startsWith("/deposit") || pathname.startsWith("/withdrawal") || pathname.startsWith("/referrals") || pathname.startsWith("/transactions")) {
    if (!role) return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!role) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "admin") return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/plans/:path*",
    "/deposit/:path*",
    "/withdrawal/:path*",
    "/referrals/:path*",
    "/transactions/:path*",
    "/admin/:path*",
  ],
};
