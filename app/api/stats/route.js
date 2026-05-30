import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const [services, projects, media] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.media.count(),
  ]);
  const recent = await prisma.service.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { title: true, updatedAt: true } });
  return NextResponse.json({ services, projects, media, recent });
}
