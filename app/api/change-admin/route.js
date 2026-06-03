import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (key !== "yenhouse2026") {
    return NextResponse.json({
      error: "需要金鑰才能執行"
    }, { status: 401 });
  }

  try {
    const newUsername = "yanshe.life0720";
    const newPassword = "c9695451";
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.admin.deleteMany({});

    await prisma.admin.create({
      data: { username: newUsername, password: hashed },
    });

    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>燕舍 - 帳號更新完成</title><style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;background:#f5f0e8;color:#3a342b;line-height:1.8}h1{color:#c4a06a}.box{background:#fff;padding:20px;border-radius:12px;margin-top:20px}.warn{background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;margin:15px 0;border-radius:6px}</style></head><body><h1>🔐 管理員帳號已更新</h1><div class="box"><p>✅ 帳號：<strong>${newUsername}</strong></p><p>✅ 密碼：已更新</p><p>✅ 舊的 admin 帳號已刪除</p></div><div class="warn">⚠️ <strong>請立刻刪除 app/api/change-admin 資料夾以保安全！</strong></div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
