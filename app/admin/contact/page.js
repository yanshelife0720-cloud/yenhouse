"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

const FIELDS = [
  ["line", "LINE 連結", "https://line.me/..."],
  ["instagram", "Instagram 連結", "https://instagram.com/..."],
  ["facebook", "Facebook 連結", "https://facebook.com/..."],
  ["threads", "Threads 連結", "https://threads.net/@..."],
  ["email", "Email", "hello@yenhouse.com"],
  ["phone", "電話", "0912-345-678"],
];

export default function ContactPage() {
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/contact").then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setMsg(res.ok ? "✓ 已儲存，前台已同步" : "儲存失敗");
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <AdminShell title="聯絡資訊管理">
      <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)", marginBottom: "2rem" }}>編輯聯絡資訊與社群連結，前台 CTA 按鈕與頁尾會連到這些資料。</p>

      <div className="admin-card" style={{ padding: "2rem", maxWidth: 560 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {FIELDS.map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input className="admin-input" value={data[key] || ""} placeholder={placeholder} onChange={(e) => setData({ ...data, [key]: e.target.value })} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1.8rem" }}>
          <button className="admin-btn" onClick={save} disabled={saving}>{saving ? "儲存中..." : "儲存變更"}</button>
          {msg && <span style={{ fontSize: "0.88rem", color: "#5a8a5a" }}>{msg}</span>}
        </div>
      </div>
    </AdminShell>
  );
}
