import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const rows = await prisma.content.findMany({ orderBy: [{ group: "asc" }, { sort: "asc" }] });
  return NextResponse.json(rows);
}

export async function PUT(req) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const updates = await req.json(); // [{key, value}, ...]
  await Promise.all(updates.map((u) => prisma.content.update({ where: { key: u.key }, data: { value: u.value } })));
  return NextResponse.json({ ok: true });
}
