import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { del } from "@vercel/blob";

export async function DELETE(req, { params }) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });
  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (media?.url && process.env.BLOB_READ_WRITE_TOKEN) {
    try { await del(media.url); } catch {}
  }
  await prisma.media.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
