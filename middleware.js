// Middleware：攔截 /admin 下所有頁面，未登入導向登入頁
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "yen-house-dev-secret-change-in-production-please"
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 登入頁本身不攔截
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 其餘 /admin 路徑需驗證
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("yh_session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
