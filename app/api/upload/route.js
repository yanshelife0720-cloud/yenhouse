import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req) {
  if (!(await getSession())) return NextResponse.json({ error: "未授權" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!file) return NextResponse.json({ error: "沒有檔案" }, { status: 400 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "尚未設定圖片儲存（BLOB_READ_WRITE_TOKEN）。請參考部署說明設定 Vercel Blob。" }, { status: 500 });
  }

  const filename = `${Date.now()}-${file.name}`;
  const blob = await put(filename, file, { access: "public" });

  const media = await prisma.media.create({
    data: { url: blob.url, name: file.name, size: file.size || 0 },
  });

  return NextResponse.json(media);
}
