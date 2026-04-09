import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShiftIndia — Move Anywhere in India, Fast, Safe & Transparent",
  description:
    "India's most trusted packers & movers marketplace. Compare prices from verified vendors instantly. Live tracking, damage protection, lowest price guarantee.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
