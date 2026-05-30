import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const rows = await prisma.project.findMany({ orderBy: { sort: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const d = await req.json();
  const count = await prisma.project.count();
  const row = await prisma.project.create({
    data: {
      title: d.title || "新案例", summary: d.summary || "", beforeImage: d.beforeImage || null,
      afterImage: d.afterImage || null, category: d.category || "住宅空間",
      sort: d.sort ?? count + 1, visible: d.visible ?? true,
    },
  });
  return NextResponse.json(row);
}
