import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // Protected routes (jahan login zaroori hai)
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/deposit",
    "/withdrawal",
    "/transactions",
    "/referrals",
    "/plans",
    "/support",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdmin = pathname.startsWith("/admin");

  // Agar protected route hai aur session nahi hai → login pe bhejein
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Agar admin route hai aur session mein role admin nahi → login pe bhejein
  if (isAdmin && (!session || session.role !== "admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/deposit/:path*",
    "/withdrawal/:path*",
    "/transactions/:path*",
    "/referrals/:path*",
    "/plans/:path*",
    "/support/:path*",
  ],
};
