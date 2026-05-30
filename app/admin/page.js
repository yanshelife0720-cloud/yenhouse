"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function Dashboard() {
  const [stats, setStats] = useState({ services: 0, projects: 0, media: 0, recent: [] });

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  const cards = [
    ["服務項目", stats.services, "layers", "/admin/services"],
    ["案例作品", stats.projects, "image", "/admin/projects"],
    ["已上傳圖片", stats.media, "folder", "/admin/media"],
  ];

  const quick = [
    ["編輯網站文字", "/admin/content"],
    ["管理服務項目", "/admin/services"],
    ["新增空間案例", "/admin/projects"],
    ["上傳圖片", "/admin/media"],
    ["修改聯絡資訊", "/admin/contact"],
  ];

  return (
    <AdminShell title="總覽 Dashboard">
      {/* 統計卡片 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {cards.map(([label, val, , href]) => (
          <a key={label} href={href} className="admin-card" style={{ padding: "1.8rem", display: "block" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginBottom: "0.5rem" }}>{label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "2.8rem", color: "var(--warm-gold)" }}>{val}</div>
          </a>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.5rem" }} className="dash-grid">
        {/* 快速編輯 */}
        <div className="admin-card" style={{ padding: "1.8rem" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1.2rem", color: "var(--ink)" }}>快速編輯入口</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {quick.map(([label, href]) => (
              <a key={href} href={href} style={{ display: "flex", justifyContent: "space-between", padding: "0.9rem 1.1rem", background: "var(--cream-light)", borderRadius: 10, fontSize: "0.9rem", color: "var(--ink)" }}>
                {label} <span style={{ color: "var(--warm-gold)" }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* 最近更新 */}
        <div className="admin-card" style={{ padding: "1.8rem" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1.2rem", color: "var(--ink)" }}>最近更新內容</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {stats.recent.length ? stats.recent.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--ink-soft)", paddingBottom: "0.8rem", borderBottom: "1px solid var(--cream-warm)" }}>
                <span>{r.title}</span>
                <span style={{ color: "var(--ink-light)", fontSize: "0.78rem" }}>{new Date(r.updatedAt).toLocaleDateString("zh-TW")}</span>
              </div>
            )) : <div style={{ fontSize: "0.85rem", color: "var(--ink-light)" }}>尚無更新紀錄</div>}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 760px){ .dash-grid{ grid-template-columns:1fr !important; } }`}</style>
    </AdminShell>
  );
}
