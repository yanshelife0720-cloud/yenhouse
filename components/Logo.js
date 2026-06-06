export default function Logo({ size = 40, showText = true, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src="/logo.png"
        alt="燕舍 YEN HOUSE logo"
        width={size * 3}
        height={size}
        style={{ objectFit: "contain", filter: light ? "brightness(0) invert(1)" : "none" }}
      />
    </div>
  );
}
