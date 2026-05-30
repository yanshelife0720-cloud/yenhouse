"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const load = () => fetch("/api/media").then((r) => r.json()).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  async function upload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setErr("");
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) { const d = await res.json(); setErr(d.error || "上傳失敗"); }
    }
    setUploading(false);
    load();
  }

  async function remove(id) {
    if (!confirm("確定刪除此圖片？")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell title="媒體檔案管理">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>上傳的圖片可在服務、案例編輯時選用。</p>
        <label className="admin-btn" style={{ cursor: "pointer" }}>
          {uploading ? "上傳中..." : "+ 上傳圖片"}
          <input type="file" accept="image/*" multiple onChange={upload} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>
      {err && <div style={{ color: "#b5654a", fontSize: "0.85rem", marginBottom: "1rem" }}>{err}</div>}

      {items.length === 0 ? (
        <div className="admin-card" style={{ padding: "4rem", textAlign: "center", color: "var(--ink-light)", fontSize: "0.9rem" }}>
          尚無圖片，點擊右上角上傳。
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
          {items.map((m) => (
            <div key={m.id} className="admin-card" style={{ overflow: "hidden" }}>
              <div style={{ aspectRatio: "1/1", background: "var(--cream-warm)" }}>
                <img src={m.url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "0.7rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0.5rem" }}>{m.name}</div>
                <button className="admin-btn-danger" onClick={() => remove(m.id)} style={{ width: "100%" }}>刪除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
