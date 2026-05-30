"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import ImagePicker from "@/components/ImagePicker";

const ICONS = [["key", "鑰匙"], ["layout", "版面"], ["sparkles", "星光"], ["video", "影片"], ["home", "房屋"]];

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/services").then((r) => r.json()).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  function newItem() {
    setEditing({ title: "", summary: "", detail: "", icon: "home", imageUrl: "", sort: items.length + 1, visible: true });
  }

  async function save() {
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/services" : `/api/services/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { setEditing(null); load(); flash("✓ 已儲存"); }
  }

  async function remove(id) {
    if (!confirm("確定刪除此服務項目？")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load(); flash("✓ 已刪除");
  }

  async function toggle(it) {
    await fetch(`/api/services/${it.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...it, visible: !it.visible }) });
    load();
  }

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 2500); }

  return (
    <AdminShell title="服務項目管理">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>可新增、編輯、排序服務項目，控制是否顯示於前台。</p>
        <button className="admin-btn" onClick={newItem}>+ 新增服務</button>
      </div>
      {msg && <div style={{ color: "#5a8a5a", fontSize: "0.88rem", marginBottom: "1rem" }}>{msg}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {items.map((it) => (
          <div key={it.id} className="admin-card" style={{ padding: "1.3rem 1.5rem", display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "var(--cream-warm)", flexShrink: 0 }}>
              {it.imageUrl ? <img src={it.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, color: "var(--ink)" }}>{it.title}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>{it.summary}</div>
            </div>
            <button onClick={() => toggle(it)} style={{ fontSize: "0.78rem", padding: "0.3rem 0.8rem", borderRadius: 100, border: "none", cursor: "pointer", background: it.visible ? "rgba(90,138,90,0.12)" : "var(--cream-warm)", color: it.visible ? "#5a8a5a" : "var(--ink-light)" }}>
              {it.visible ? "● 顯示中" : "○ 已隱藏"}
            </button>
            <button className="admin-btn-ghost" onClick={() => setEditing(it)}>編輯</button>
            <button className="admin-btn-danger" onClick={() => remove(it.id)}>刪除</button>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(58,52,43,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "2rem" }} onClick={() => setEditing(null)}>
          <div className="admin-card" style={{ width: "100%", maxWidth: 560, padding: "2rem", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>{editing.id ? "編輯服務" : "新增服務"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label className="admin-label">標題</label><input className="admin-input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><label className="admin-label">簡介</label><input className="admin-input" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
              <div><label className="admin-label">詳細內容</label><textarea className="admin-input" rows={3} value={editing.detail} onChange={(e) => setEditing({ ...editing, detail: e.target.value })} /></div>
              <div>
                <label className="admin-label">Icon</label>
                <select className="admin-input" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                  {ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <ImagePicker label="服務圖片" value={editing.imageUrl} onChange={(url) => setEditing({ ...editing, imageUrl: url })} />
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}><label className="admin-label">排序</label><input className="admin-input" type="number" value={editing.sort} onChange={(e) => setEditing({ ...editing, sort: parseInt(e.target.value) || 0 })} /></div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", marginTop: "1.8rem" }}>
                  <input type="checkbox" checked={editing.visible} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} /> 顯示於前台
                </label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.8rem", justifyContent: "flex-end" }}>
              <button className="admin-btn-ghost" onClick={() => setEditing(null)}>取消</button>
              <button className="admin-btn" onClick={save}>儲存</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
