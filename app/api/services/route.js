import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const rows = await prisma.service.findMany({ orderBy: { sort: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const d = await req.json();
  const count = await prisma.service.count();
  const row = await prisma.service.create({
    data: {
      title: d.title || "新服務", summary: d.summary || "", detail: d.detail || "",
      icon: d.icon || "home", imageUrl: d.imageUrl || null, sort: d.sort ?? count + 1,
      visible: d.visible ?? true,
    },
  });
  return NextResponse.json(row);
}
