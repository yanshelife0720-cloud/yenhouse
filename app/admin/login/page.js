"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "登入失敗");
      }
    } catch {
      setError("連線錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="warm-glow-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="soft-blur-orb" style={{ width: 350, height: 350, background: "var(--gold-soft)", top: "15%", right: "15%" }} />
      <div className="glass" style={{ width: "100%", maxWidth: 420, borderRadius: 28, padding: "3rem 2.5rem", position: "relative", zIndex: 2, boxShadow: "var(--shadow-medium)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <Logo size={56} />
        </div>
        <div style={{ textAlign: "center", fontSize: "0.75rem", letterSpacing: "0.3em", color: "var(--warm-gold)", marginBottom: "2.5rem" }}>
          後台管理系統
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label className="admin-label">帳號</label>
          <input className="admin-input" value={username} onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="請輸入帳號" />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label className="admin-label">密碼</label>
          <input className="admin-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="請輸入密碼" />
        </div>

        {error && <div style={{ color: "#b5654a", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

        <button className="admin-btn" onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem", opacity: loading ? 0.6 : 1 }}>
          {loading ? "登入中..." : "登 入"}
        </button>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--ink-light)" }}>
          預設帳號 admin · 密碼 admin123
        </div>
      </div>
    </div>
  );
}
