import "./globals.css";

export const metadata = {
  title: "燕舍 Yen House｜極致造就生活品質",
  description: "燕舍是結合包租代管、空間優化、AI空間渲染提案與短影音曝光的現代空間生活品牌。極致造就生活品質。",
  keywords: "燕舍, Yen House, 包租代管, 空間優化, AI空間渲染, 室內設計, 精品住宅",
  openGraph: {
    title: "燕舍 Yen House｜極致造就生活品質",
    description: "現代空間生活品牌 — 包租代管｜空間優化｜AI空間提案｜短影音曝光",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
