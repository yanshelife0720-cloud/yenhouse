// 前台資料讀取層 — 從資料庫取出所有前台需要的內容
import { prisma } from "./prisma";

export async function getSiteData() {
  try {
    const [contentRows, services, projects, contact] = await Promise.all([
      prisma.content.findMany(),
      prisma.service.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
      prisma.project.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
      prisma.contact.findUnique({ where: { id: "main" } }),
    ]);

    // 把 content 轉成 key-value 物件方便前台取用
    const content = {};
    for (const row of contentRows) content[row.key] = row.value;

    return { content, services, projects, contact: contact || {} };
  } catch (e) {
    // 資料庫尚未連線時回傳預設值，避免頁面崩潰
    return { content: {}, services: [], projects: [], contact: {} };
  }
}
