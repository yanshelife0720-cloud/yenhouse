"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";

const NAV = [
  ["/admin", "總覽", "grid"],
  ["/admin/content", "內容管理", "text"],
  ["/admin/services", "服務項目", "layers"],
  ["/admin/projects", "案例作品", "image"],
  ["/admin/media", "媒體檔案", "folder"],
  ["/admin/contact", "聯絡資訊", "link"],
];

function NavIcon({ name }) {
  const p = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid: <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    text: <svg {...p}><path d="M4 6h16M4 12h16M4 18h10" /></svg>,
    layers: <svg {...p}><path d="M12 3 2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" /></svg>,
    image: <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
    folder: <svg {...p}><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>,
    link: <svg {...p}><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5" /></svg>,
  };
  return icons[name];
}

export default function AdminShell({ children, title }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-body" style={{ minHeight: "100vh", display: "flex" }}>
      {/* 側邊欄 */}
      <aside style={{
        width: 250, background: "var(--ink)", color: "var(--cream)", padding: "2rem 0",
        display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 100,
        transform: open ? "translateX(0)" : undefined, transition: "transform 0.3s",
      }} className={open ? "admin-sidebar-open" : "admin-sidebar"}>
        <div style={{ padding: "0 1.8rem 2rem" }}>
          <Logo size={36} light />
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem", padding: "0 1rem" }}>
          {NAV.map(([href, label, icon]) => {
            const active = pathname === href;
            return (
              <a key={href} href={href} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem 1rem", borderRadius: 10,
                fontSize: "0.9rem", color: active ? "var(--white-warm)" : "rgba(245,240,232,0.6)",
                background: active ? "rgba(196,160,106,0.18)" : "transparent", transition: "all 0.2s",
              }}>
                <span style={{ color: active ? "var(--gold-soft)" : "inherit" }}><NavIcon name={icon} /></span>
                {label}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: "1rem" }}>
          <a href="/" target="_blank" style={{ display: "block", padding: "0.7rem 1rem", fontSize: "0.85rem", color: "rgba(245,240,232,0.6)", borderRadius: 10 }}>↗ 查看前台網站</a>
          <button onClick={logout} style={{ width: "100%", textAlign: "left", padding: "0.7rem 1rem", fontSize: "0.85rem", color: "rgba(245,240,232,0.6)", background: "none", border: "none", borderRadius: 10 }}>登出</button>
        </div>
      </aside>

      {/* 主內容 */}
      <main className="admin-main" style={{ flex: 1, marginLeft: 250, padding: "2.5rem 3rem", maxWidth: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button className="admin-menu-btn" onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", fontSize: "1.4rem" }}>☰</button>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", color: "var(--ink)" }}>{title}</h1>
          </div>
        </div>
        {children}
      </main>

      <style>{`
        @media (max-width: 880px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-main { margin-left: 0 !important; padding: 1.5rem !important; }
          .admin-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
