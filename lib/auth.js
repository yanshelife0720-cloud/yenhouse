// 登入驗證邏輯：使用 JWT 存在 HttpOnly Cookie，未登入無法進入後台
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE_NAME = "yh_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "yen-house-dev-secret-change-in-production-please"
);

// 驗證帳號密碼
export async function verifyCredentials(username, password) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return null;
  return { id: admin.id, username: admin.username };
}

// 建立登入 session（寫入 cookie）
export async function createSession(user) {
  const token = await new SignJWT({ uid: user.id, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

// 讀取目前登入者；未登入回傳 null
export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.uid, username: payload.username };
  } catch {
    return null;
  }
}

// 登出
export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}
