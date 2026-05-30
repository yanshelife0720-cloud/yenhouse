// 資料庫初始化種子 — 建立預設管理員、前台文字、四大服務、範例案例、聯絡資訊
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 開始初始化燕舍資料庫...");

  // 1. 預設管理員 admin / admin123
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: hashed },
  });
  console.log("✅ 管理員帳號建立完成（admin / admin123）");

  // 2. 前台文字內容
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
  console.log("✅ 前台文字內容建立完成");

  // 3. 四大服務
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
    console.log("✅ 四大服務建立完成");
  }

  // 4. 範例案例
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        { title: "老屋翻新・北歐風格", summary: "透過空間優化，老屋變身清新北歐宅", category: "住宅空間", sort: 1 },
        { title: "套房改造・質感提升", summary: "AI 渲染提案，提升出租吸引力", category: "住宅空間", sort: 2 },
        { title: "店面設計・機能優化", summary: "打造商業空間，提升品牌形象", category: "商業空間", sort: 3 },
      ],
    });
    console.log("✅ 範例案例建立完成");
  }

  // 5. 聯絡資訊
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
  console.log("✅ 聯絡資訊建立完成");

  console.log("🎉 燕舍資料庫初始化完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
