import type { Metadata } from "next";
import { Almarai, Tajawal, Montserrat } from "next/font/google";
import "../globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "لوحة التحكم | روافد سبأ",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${almarai.variable} ${tajawal.variable} ${montserrat.variable}`}
    >
      <body className="antialiased bg-cream">{children}</body>
    </html>
  );
}
