import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "राधे Packers and Movers — Your Trusted Move",
  description:
    "India's most trusted packers & movers. Safe, reliable, and transparent moving services across India. Get instant quotes and live tracking.",
  icons: {
    icon: "/P & M.png",
    apple: "/P & M.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/P & M.png" type="image/png" />
        <link rel="apple-touch-icon" href="/P & M.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
