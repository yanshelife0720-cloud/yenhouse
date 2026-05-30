"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import ImagePicker from "@/components/ImagePicker";

const CATS = ["住宅空間", "商業空間", "租屋改造"];

export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/projects").then((r) => r.json()).then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  function newItem() {
    setEditing({ title: "", summary: "", beforeImage: "", afterImage: "", category: "住宅空間", sort: items.length + 1, visible: true });
  }

  async function save() {
    const isNew = !editing.id;
    const res = await fetch(isNew ? "/api/projects" : `/api/projects/${editing.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { setEditing(null); load(); flash("✓ 已儲存"); }
  }

  async function remove(id) {
    if (!confirm("確定刪除此案例？")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load(); flash("✓ 已刪除");
  }

  async function toggle(it) {
    await fetch(`/api/projects/${it.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...it, visible: !it.visible }) });
    load();
  }

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 2500); }

  return (
    <AdminShell title="案例作品管理">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>可新增案例、上傳 Before / After 圖片，控制前台顯示。</p>
        <button className="admin-btn" onClick={newItem}>+ 新增案例</button>
      </div>
      {msg && <div style={{ color: "#5a8a5a", fontSize: "0.88rem", marginBottom: "1rem" }}>{msg}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.2rem" }}>
        {items.map((it) => (
          <div key={it.id} className="admin-card" style={{ overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", aspectRatio: "2/1", background: "var(--cream-warm)" }}>
              <div style={{ position: "relative", background: "var(--beige)" }}>
                {it.beforeImage ? <img src={it.beforeImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "0.7rem", color: "var(--ink-light)" }}>Before</div>}
              </div>
              <div style={{ position: "relative" }}>
                {it.afterImage ? <img src={it.afterImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "0.7rem", color: "var(--ink-light)" }}>After</div>}
              </div>
            </div>
            <div style={{ padding: "1.2rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--warm-gold)", marginBottom: "0.3rem" }}>{it.category}</div>
              <div style={{ fontWeight: 500, color: "var(--ink)", marginBottom: "0.3rem" }}>{it.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--ink-soft)", marginBottom: "1rem" }}>{it.summary}</div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button onClick={() => toggle(it)} style={{ fontSize: "0.72rem", padding: "0.25rem 0.7rem", borderRadius: 100, border: "none", cursor: "pointer", background: it.visible ? "rgba(90,138,90,0.12)" : "var(--cream-warm)", color: it.visible ? "#5a8a5a" : "var(--ink-light)" }}>{it.visible ? "● 顯示" : "○ 隱藏"}</button>
                <button className="admin-btn-ghost" style={{ padding: "0.3rem 0.9rem", fontSize: "0.8rem" }} onClick={() => setEditing(it)}>編輯</button>
                <button className="admin-btn-danger" onClick={() => remove(it.id)}>刪除</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(58,52,43,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "2rem" }} onClick={() => setEditing(null)}>
          <div className="admin-card" style={{ width: "100%", maxWidth: 560, padding: "2rem", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>{editing.id ? "編輯案例" : "新增案例"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label className="admin-label">案例標題</label><input className="admin-input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><label className="admin-label">案例簡介</label><textarea className="admin-input" rows={2} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
              <div>
                <label className="admin-label">分類標籤</label>
                <select className="admin-input" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <ImagePicker label="Before 圖片" value={editing.beforeImage} onChange={(url) => setEditing({ ...editing, beforeImage: url })} />
              <ImagePicker label="After 圖片" value={editing.afterImage} onChange={(url) => setEditing({ ...editing, afterImage: url })} />
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
