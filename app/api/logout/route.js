import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";

export async function POST() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  await destroySession();
  return NextResponse.json({ ok: true });
}
