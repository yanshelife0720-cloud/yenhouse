import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req, { params }) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const d = await req.json();
  const row = await prisma.project.update({
    where: { id: params.id },
    data: {
      title: d.title, summary: d.summary, beforeImage: d.beforeImage,
      afterImage: d.afterImage, category: d.category, sort: d.sort, visible: d.visible,
    },
  });
  return NextResponse.json(row);
}

export async function DELETE(req, { params }) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
