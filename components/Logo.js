// 燕舍 Logo — SVG 矢量繪製，不失真，精品品牌感
// 由一隻簡約燕子線條 + 中文「燕舍」+ 英文「YEN HOUSE」組成
export default function Logo({ size = 40, color = "#3a342b", accent = "#c4a06a", showText = true, light = false }) {
  const main = light ? "#fffdf9" : color;
  const sub = light ? "rgba(255,253,249,0.7)" : "#948b7c";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="燕舍 logo">
        {/* 圓形微光底 */}
        <circle cx="24" cy="24" r="23" stroke={accent} strokeWidth="0.8" opacity="0.5" />
        {/* 屋頂線條 */}
        <path d="M12 26 L24 14 L36 26" stroke={main} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* 燕子飛翔線條 */}
        <path d="M17 30 Q24 26 31 30 Q24 33 24 38 Q24 33 17 30 Z" fill={accent} opacity="0.9" />
        <path d="M24 14 L24 19" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {showText && (
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 500, letterSpacing: "0.15em", color: main }}>
            燕舍
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.35em", color: sub, marginTop: "1px" }}>
            YEN HOUSE
          </div>
        </div>
      )}
    </div>
  );
}
