import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
                       req.nextUrl.pathname.startsWith("/register");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isUserPage = req.nextUrl.pathname.startsWith("/dashboard") ||
                       req.nextUrl.pathname.startsWith("/plans") ||
                       req.nextUrl.pathname.startsWith("/deposit") ||
                       req.nextUrl.pathname.startsWith("/withdrawal") ||
                       req.nextUrl.pathname.startsWith("/referrals") ||
                       req.nextUrl.pathname.startsWith("/transactions") ||
                       req.nextUrl.pathname.startsWith("/support");

    // Agar user logged in nahi hai aur admin page par jana chahta hai
    if (!isAuth && isAdminPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Agar user logged in nahi hai aur user page par jana chahta hai
    if (!isAuth && isUserPage) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Agar user logged in hai aur auth page par jana chahta hai (login/register)
    if (isAuth && isAuthPage) {
      // Agar admin hai toh admin dashboard par bhejo
      if (token?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      // Warna user dashboard par bhejo
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Agar user logged in hai aur admin page par jana chahta hai lekin admin nahi hai
    if (isAuth && isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Middleware handle karega
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/plans/:path*",
    "/deposit/:path*",
    "/withdrawal/:path*",
    "/referrals/:path*",
    "/transactions/:path*",
    "/support/:path*",
    "/login",
    "/register",
  ],
};