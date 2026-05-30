import { NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();
  const user = await verifyCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }
  await createSession(user);
  return NextResponse.json({ ok: true });
}
