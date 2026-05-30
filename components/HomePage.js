"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

// 服務 icon
function ServiceIcon({ name }) {
  const common = { width: 32, height: 32, fill: "none", stroke: "#c4a06a", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    key: <svg {...common}><circle cx="8" cy="8" r="5" /><path d="M11.5 11.5 L21 21 M17 17 l3 0 M19 19 l0 -3" /></svg>,
    layout: <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9 h18 M9 21 V9" /></svg>,
    sparkles: <svg {...common}><path d="M12 3 l1.8 5.2 5.2 1.8 -5.2 1.8 -1.8 5.2 -1.8 -5.2 -5.2 -1.8 5.2 -1.8 Z" /><path d="M19 14 l0.6 1.8 1.8 0.6 -1.8 0.6 -0.6 1.8 -0.6 -1.8 -1.8 -0.6 1.8 -0.6 Z" /></svg>,
    video: <svg {...common}><rect x="3" y="5" width="14" height="14" rx="2" /><path d="M17 9 l4 -2 v10 l-4 -2 Z" /></svg>,
    home: <svg {...common}><path d="M4 11 L12 4 L20 11 M6 10 V20 H18 V10" /></svg>,
  };
  return icons[name] || icons.home;
}

// 觀察進場動畫
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HomePage({ data }) {
  const { content, services, projects, contact } = data;
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("全部");
  const heroRef = useRef(null);

  const c = (key, fallback) => content[key] || fallback;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.3}px)`;
        heroRef.current.style.opacity = Math.max(0, 1 - y / 600);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useReveal();

  const cats = ["全部", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = activeCat === "全部" ? projects : projects.filter((p) => p.category === activeCat);

  const lineUrl = contact.line || "#";

  return (
    <>
      {/* Loading 動畫 */}
      {loading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "var(--cream)", animation: "fadeOut 0.8s ease 1.4s forwards",
        }}>
          <div style={{ animation: "drawIn 1.4s cubic-bezier(0.16,1,0.3,1)" }}>
            <Logo size={64} />
          </div>
          <div style={{ marginTop: "1.5rem", fontSize: "0.7rem", letterSpacing: "0.4em", color: "var(--warm-gold)", animation: "drawIn 1.6s ease" }}>
            極致造就生活品質
          </div>
        </div>
      )}

      {/* ═══ Navbar ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "0.9rem 2rem" : "1.4rem 2rem",
        background: scrolled ? "rgba(255,253,249,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(230,220,203,0.6)" : "1px solid transparent",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Logo size={36} />
        <div className="nav-links" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {[["關於燕舍", "#about"], ["服務項目", "#services"], ["案例分享", "#projects"], ["為什麼選擇燕舍", "#why"], ["聯絡我們", "#contact"]].map(([label, href]) => (
            <a key={href} href={href} style={{ fontSize: "0.9rem", letterSpacing: "0.05em", color: "var(--ink-soft)", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--warm-gold)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--ink-soft)")}>
              {label}
            </a>
          ))}
          <a href={lineUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: "0.65rem 1.6rem", fontSize: "0.85rem" }}>
            立即諮詢
          </a>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", fontSize: "1.5rem", color: "var(--ink)" }}>
          ☰
        </button>
      </nav>

      {/* 手機選單 */}
      {menuOpen && (
        <div className="mobile-menu glass" style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "75%", zIndex: 1001,
          padding: "5rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem",
        }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", fontSize: "1.5rem" }}>✕</button>
          {[["關於燕舍", "#about"], ["服務項目", "#services"], ["案例分享", "#projects"], ["為什麼選擇燕舍", "#why"], ["聯絡我們", "#contact"]].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{ fontSize: "1.1rem", color: "var(--ink)" }}>{label}</a>
          ))}
        </div>
      )}

      {/* ═══ 1. Hero ═══ */}
      <header className="warm-glow-bg" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="soft-blur-orb" style={{ width: 400, height: 400, background: "var(--gold-soft)", top: "10%", right: "5%", animation: "floatSlow 9s ease-in-out infinite" }} />
        <div className="soft-blur-orb" style={{ width: 300, height: 300, background: "var(--wood)", bottom: "10%", left: "0%", animation: "float 11s ease-in-out infinite" }} />
        <div ref={heroRef} style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 2rem", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <div className="eyebrow reveal visible" style={{ marginBottom: "1.5rem" }}>YEN HOUSE · 燕舍</div>
              <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)", lineHeight: 1.25, marginBottom: "1.5rem", animation: "drawIn 1.2s ease 1.5s both" }}>
                {c("hero_title", "極致造就生活品質")}
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--ink-soft)", letterSpacing: "0.08em", marginBottom: "2.5rem", animation: "drawIn 1.4s ease 1.8s both" }}>
                {c("hero_subtitle", "包租代管｜空間優化｜AI空間提案｜短影音曝光")}
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", animation: "drawIn 1.6s ease 2.1s both" }}>
                <a href="#about" className="btn-ghost">{c("hero_btn1", "了解燕舍")}</a>
                <a href={lineUrl} target="_blank" rel="noreferrer" className="btn-primary">{c("hero_btn2", "立即諮詢")}</a>
              </div>
            </div>
            <div className="hero-img" style={{ position: "relative", animation: "float 8s ease-in-out infinite" }}>
              <div className="glass" style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "4/5", boxShadow: "var(--shadow-medium)" }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg, #f0e9dd, #e6dccb 50%, #d9cbb3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ textAlign: "center", color: "var(--taupe)" }}>
                    <Logo size={56} showText={false} />
                    <div style={{ marginTop: "1rem", fontSize: "0.75rem", letterSpacing: "0.3em" }}>高級空間照片</div>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", marginTop: "0.3rem", opacity: 0.7 }}>後台上傳 Hero 圖片後顯示</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--taupe)", animation: "float 2.5s ease-in-out infinite" }}>
          向下滑動 ↓
        </div>
      </header>

      {/* ═══ 2. 關於燕舍 ═══ */}
      <section id="about" className="section">
        <div className="about-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "1.2rem" }}>ABOUT</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginBottom: "1.8rem" }}>{c("about_title", "關於燕舍")}</h2>
            <p style={{ fontSize: "1.05rem", color: "var(--ink-soft)", lineHeight: 2 }}>{c("about_text", "燕舍不是傳統房仲，而是專注於提升空間價值與生活品質的現代空間品牌。")}</p>
            <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
              {["專業", "細膩", "溫暖", "負責", "極致", "質感"].map((k) => (
                <div key={k} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--warm-gold)" }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass" style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "1/1", boxShadow: "var(--shadow-medium)" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #faf7f1, #e6dccb)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--taupe)", fontSize: "0.75rem", letterSpacing: "0.25em" }}>
              關於燕舍圖片
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. 四大服務 ═══ */}
      <section id="services" className="warm-glow-bg" style={{ padding: "6rem 0" }}>
        <div className="section" style={{ padding: "1rem 2rem" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>SERVICES</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>四大服務項目</h2>
          </div>
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {(services.length ? services : []).map((s, i) => (
              <div key={s.id} className="glass reveal service-card" style={{
                borderRadius: 20, padding: "2.5rem 1.8rem", textAlign: "center",
                transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)", transitionDelay: `${i * 0.08}s`, cursor: "pointer",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-12px)"; e.currentTarget.style.boxShadow = "var(--shadow-medium)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-soft)"; }}>
                <div style={{ width: 70, height: 70, margin: "0 auto 1.5rem", borderRadius: "50%", background: "rgba(196,160,106,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)", lineHeight: 1.8 }}>{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. 空間案例 ═══ */}
      <section id="projects" className="section">
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="eyebrow" style={{ marginBottom: "1rem" }}>PORTFOLIO</div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>空間案例分享</h2>
        </div>
        <div className="reveal" style={{ display: "flex", gap: "0.8rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" }}>
          {cats.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding: "0.5rem 1.4rem", borderRadius: 100, fontSize: "0.85rem", letterSpacing: "0.05em",
              border: "1px solid " + (activeCat === cat ? "var(--warm-gold)" : "var(--beige)"),
              background: activeCat === cat ? "var(--warm-gold)" : "transparent",
              color: activeCat === cat ? "white" : "var(--ink-soft)", transition: "all 0.3s",
            }}>{cat}</button>
          ))}
        </div>
        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="glass" style={{ borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-soft)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", aspectRatio: "2/1.3" }}>
                  <div style={{ background: "linear-gradient(135deg,#e6dccb,#d9cbb3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--taupe)", fontSize: "0.7rem", letterSpacing: "0.2em", position: "relative" }}>
                    <span style={{ position: "absolute", top: 8, left: 8, fontSize: "0.6rem", background: "rgba(58,52,43,0.5)", color: "white", padding: "2px 8px", borderRadius: 4 }}>BEFORE</span>
                    Before
                  </div>
                  <div style={{ background: "linear-gradient(135deg,#faf7f1,#f0e9dd)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--taupe)", fontSize: "0.7rem", letterSpacing: "0.2em", position: "relative" }}>
                    <span style={{ position: "absolute", top: 8, right: 8, fontSize: "0.6rem", background: "var(--warm-gold)", color: "white", padding: "2px 8px", borderRadius: 4 }}>AFTER</span>
                    After
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>{p.title}</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>{p.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. 為什麼選擇燕舍 ═══ */}
      <section id="why" className="warm-glow-bg" style={{ padding: "6rem 0" }}>
        <div className="section" style={{ padding: "1rem 2rem" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>WHY YEN HOUSE</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>{c("why_title", "為什麼選擇燕舍？")}</h2>
          </div>
          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem" }}>
            {[
              ["提升出租效率", "專業代管，提高出租率與穩定度"],
              ["提升空間價值", "空間優化設計，提高租金與價值"],
              ["AI 視覺提案", "AI 渲染分析，預見空間可行性"],
              ["專業整合服務", "一站式服務，省時省力更安心"],
              ["高品質空間規劃", "皇尚打造設計，提升生活品質"],
              ["品牌化出租思維", "打造品牌免費，提升物件競爭力"],
            ].map(([title, desc], i) => (
              <div key={title} className="reveal" style={{ textAlign: "center", transitionDelay: `${i * 0.06}s` }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--warm-gold)", opacity: 0.5, marginBottom: "0.5rem" }}>
                  0{i + 1}
                </div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}>{title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. CTA ═══ */}
      <section id="contact" className="section" style={{ textAlign: "center" }}>
        <div className="glass reveal" style={{ borderRadius: 32, padding: "5rem 2rem", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-medium)" }}>
          <div className="soft-blur-orb" style={{ width: 300, height: 300, background: "var(--gold-soft)", top: "-10%", left: "50%", transform: "translateX(-50%)" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginBottom: "1rem" }}>{c("cta_title", "歡迎與燕舍聊聊您的空間")}</h2>
            <p style={{ fontSize: "1rem", color: "var(--ink-soft)", marginBottom: "2.5rem" }}>{c("cta_subtitle", "讓我們一起，創造更美好的生活與價值")}</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href={lineUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ background: "linear-gradient(135deg,#06c755,#05a847)", boxShadow: "0 8px 30px rgba(6,199,85,0.3)" }}>
                {c("cta_btn1", "LINE 立即諮詢")}
              </a>
              <a href={"mailto:" + (contact.email || "")} className="btn-ghost">{c("cta_btn2", "免費空間評估")}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer style={{ background: "var(--ink)", color: "var(--cream)", padding: "4rem 2rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem", alignItems: "flex-start" }}>
          <div>
            <Logo size={40} light />
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "rgba(245,240,232,0.6)", maxWidth: 280 }}>極致造就生活品質。現代空間生活品牌。</p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" style={{ color: "rgba(245,240,232,0.7)", fontSize: "0.85rem" }}>Instagram</a>}
            {contact.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" style={{ color: "rgba(245,240,232,0.7)", fontSize: "0.85rem" }}>Facebook</a>}
            {contact.threads && <a href={contact.threads} target="_blank" rel="noreferrer" style={{ color: "rgba(245,240,232,0.7)", fontSize: "0.85rem" }}>Threads</a>}
            {contact.line && <a href={contact.line} target="_blank" rel="noreferrer" style={{ color: "rgba(245,240,232,0.7)", fontSize: "0.85rem" }}>LINE</a>}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "2.5rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(245,240,232,0.12)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.75rem", color: "rgba(245,240,232,0.4)" }}>
          <span>© 2026 燕舍 Yen House. All rights reserved.</span>
          <span>{contact.email} · {contact.phone}</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid, .about-grid { grid-template-columns: 1fr !important; }
          .hero-img { display: none; }
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .projects-grid, .why-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .menu-btn { display: block !important; }
        }
        @media (max-width: 560px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
