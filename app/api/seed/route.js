import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (key !== "yenhouse2026") {
    return NextResponse.json({
      error: "需要金鑰才能執行。請在網址後加上 ?key=yenhouse2026"
    }, { status: 401 });
  }

  const log = [];

  try {
    const hashed = await bcrypt.hash("admin123", 10);
    await prisma.admin.upsert({
      where: { username: "admin" },
      update: { password: hashed },
      create: { username: "admin", password: hashed },
    });
    log.push("✅ 管理員帳號建立完成（admin / admin123）");

    const contents = [
      { key: "hero_title", label: "Hero 主標題", value: "極致造就生活品質", group: "hero", sort: 1 },
      { key: "hero_subtitle", label: "Hero 副標題", value: "包租代管｜空間優化｜AI空間提案｜短影音曝光", group: "hero", sort: 2 },
      { key: "hero_btn1", label: "Hero 按鈕一", value: "了解燕舍", group: "hero", sort: 3 },
      { key: "hero_btn2", label: "Hero 按鈕二", value: "立即諮詢", group: "hero", sort: 4 },
      { key: "about_title", label: "關於標題", value: "關於燕舍", group: "about", sort: 1 },
      { key: "about_text", label: "關於介紹", value: "燕舍不是傳統房仲，而是專注於提升空間價值與生活品質的現代空間品牌。我們結合專業、設計與科技，從空間優化到品牌曝光，讓每一個空間都能發揮最大價值，創造更美好的生活與收益。", group: "about", sort: 2 },
      { key: "why_title", label: "為什麼選擇標題", value: "為什麼選擇燕舍？", group: "why", sort: 1 },
      { key: "cta_title", label: "CTA 文案", value: "歡迎與燕舍聊聊您的空間", group: "cta", sort: 1 },
      { key: "cta_subtitle", label: "CTA 副標", value: "讓我們一起，創造更美好的生活與價值", group: "cta", sort: 2 },
      { key: "cta_btn1", label: "CTA 按鈕一", value: "LINE 立即諮詢", group: "cta", sort: 3 },
      { key: "cta_btn2", label: "CTA 按鈕二", value: "免費空間評估", group: "cta", sort: 4 },
    ];
    for (const c of contents) {
      await prisma.content.upsert({ where: { key: c.key }, update: {}, create: c });
    }
    log.push("✅ 前台文字內容建立完成");

    const existingServices = await prisma.service.count();
    if (existingServices === 0) {
      await prisma.service.createMany({
        data: [
          { title: "包租代管", summary: "專業包租代管服務，穩定收租，省心安心", detail: "從招租、簽約、收租到維護管理，提供一站式包租代管服務，讓屋主輕鬆收租、安心託付。", icon: "key", sort: 1 },
          { title: "空間優化", summary: "空間規劃與設計優化，提升空間使用價值", detail: "透過專業空間規劃與軟裝設計，重新定義空間的使用價值，讓每一坪都發揮最大效益。", icon: "layout", sort: 2 },
          { title: "AI空間渲染提案", summary: "AI技術渲染空間提案，預見未來空間樣貌", detail: "運用 AI 渲染技術，在改造前即可預見空間完成後的樣貌，讓決策更有依據、提案更具說服力。", icon: "sparkles", sort: 3 },
          { title: "短影音曝光", summary: "短影音行銷曝光，提升物件曝光度", detail: "結合短影音內容行銷，提升物件能見度與品牌形象，讓好空間被更多人看見。", icon: "video", sort: 4 },
        ],
      });
      log.push("✅ 四大服務建立完成");
    } else {
      log.push("ℹ️ 服務項目已存在，略過");
    }

    const existingProjects = await prisma.project.count();
    if (existingProjects === 0) {
      await prisma.project.createMany({
        data: [
          { title: "老屋翻新・北歐風格", summary: "透過空間優化，老屋變身清新北歐宅", category: "住宅空間", sort: 1 },
          { title: "套房改造・質感提升", summary: "AI 渲染提案，提升出租吸引力", category: "住宅空間", sort: 2 },
          { title: "店面設計・機能優化", summary: "打造商業空間，提升品牌形象", category: "商業空間", sort: 3 },
        ],
      });
      log.push("✅ 範例案例建立完成");
    } else {
      log.push("ℹ️ 案例已存在，略過");
    }

    await prisma.contact.upsert({
      where: { id: "main" },
      update: {},
      create: {
        id: "main",
        line: "https://line.me/",
        instagram: "https://instagram.com/yen_house",
        facebook: "https://facebook.com/yenhouse",
        threads: "https://threads.net/@yen_house",
        email: "hello@yenhouse.com",
        phone: "0912-345-678",
      },
    });
    log.push("✅ 聯絡資訊建立完成");
    log.push("");
    log.push("🎉 全部完成！後台帳號 admin / admin123");
    log.push("⚠️ 請刪除 app/api/seed 資料夾以保安全！");

    return new NextResponse(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>燕舍 初始化完成</title><style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;background:#f5f0e8;color:#3a342b;line-height:1.8}h1{color:#c4a06a}pre{background:#fff;padding:20px;border-radius:12px;white-space:pre-wrap;font-family:inherit}</style></head><body><h1>🎉 燕舍資料庫初始化完成</h1><pre>${log.join("\n")}</pre></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (e) {
    return NextResponse.json({ error: "執行失敗", message: e.message, logSoFar: log }, { status: 500 });
  }
}
