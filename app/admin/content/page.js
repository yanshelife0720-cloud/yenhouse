"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

const GROUP_NAMES = { hero: "Hero 首頁區塊", about: "關於燕舍", why: "為什麼選擇燕舍", cta: "免費諮詢 CTA", general: "其他" };

export default function ContentPage() {
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setRows).catch(() => {});
  }, []);

  function update(key, value) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, value } : r)));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows.map((r) => ({ key: r.key, value: r.value }))),
    });
    setSaving(false);
    setMsg(res.ok ? "✓ 已儲存，前台已同步更新" : "儲存失敗");
    setTimeout(() => setMsg(""), 3000);
  }

  const groups = {};
  for (const r of rows) (groups[r.group] = groups[r.group] || []).push(r);

  return (
    <AdminShell title="內容管理">
      <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "2rem" }}>可編輯網站所有文字內容，儲存後前台立即同步。</p>

      {Object.entries(groups).map(([g, items]) => (
        <div key={g} className="admin-card" style={{ padding: "1.8rem", marginBottom: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1.3rem", color: "var(--warm-gold)" }}>{GROUP_NAMES[g] || g}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {items.map((r) => (
              <div key={r.key}>
                <label className="admin-label">{r.label}</label>
                {r.value.length > 60 ? (
                  <textarea className="admin-input" rows={4} value={r.value} onChange={(e) => update(r.key, e.target.value)} style={{ resize: "vertical" }} />
                ) : (
                  <input className="admin-input" value={r.value} onChange={(e) => update(r.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "sticky", bottom: "1rem" }}>
        <button className="admin-btn" onClick={save} disabled={saving}>{saving ? "儲存中..." : "儲存變更"}</button>
        {msg && <span style={{ fontSize: "0.88rem", color: "#5a8a5a" }}>{msg}</span>}
      </div>
    </AdminShell>
  );
}
