import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/super-admin") && token?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (
      path.startsWith("/admin") &&
      token?.role !== "admin" &&
      token?.role !== "super_admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/books/:path*",
    "/bookmarks/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
  ],
};
