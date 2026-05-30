"use client";

import { useState } from "react";

export default function ImagePicker({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) onChange(d.url);
      else setErr(d.error || "上傳失敗");
    } catch {
      setErr("上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ width: 90, height: 90, borderRadius: 12, overflow: "hidden", background: "var(--cream-warm)", border: "1px solid var(--beige)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {value ? <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.7rem", color: "var(--ink-light)" }}>無圖片</span>}
        </div>
        <div style={{ flex: 1 }}>
          <label className="admin-btn-ghost" style={{ display: "inline-block", cursor: "pointer", marginBottom: "0.5rem" }}>
            {uploading ? "上傳中..." : "選擇圖片上傳"}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} disabled={uploading} />
          </label>
          {value && <button className="admin-btn-danger" onClick={() => onChange("")} style={{ marginLeft: "0.5rem" }}>移除</button>}
          {err && <div style={{ fontSize: "0.78rem", color: "#b5654a", marginTop: "0.4rem" }}>{err}</div>}
        </div>
      </div>
    </div>
  );
}
