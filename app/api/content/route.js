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
  const updates = await req.json();
  await Promise.all(
    updates.map((u) =>
      prisma.content.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value, group: "hero", label: u.key, sort: 99 },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
