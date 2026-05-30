import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const rows = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}
