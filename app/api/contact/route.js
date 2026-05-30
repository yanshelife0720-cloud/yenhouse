import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const row = await prisma.contact.findUnique({ where: { id: "main" } });
  return NextResponse.json(row || {});
}

export async function PUT(req) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const d = await req.json();
  const row = await prisma.contact.upsert({
    where: { id: "main" },
    update: { line: d.line, instagram: d.instagram, facebook: d.facebook, threads: d.threads, email: d.email, phone: d.phone },
    create: { id: "main", line: d.line || "", instagram: d.instagram || "", facebook: d.facebook || "", threads: d.threads || "", email: d.email || "", phone: d.phone || "" },
  });
  return NextResponse.json(row);
}
