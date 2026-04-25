import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://radhepackersandmovers.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Radhe Packers and Movers — Your Trusted Move",
  description:
    "India's most trusted packers & movers. Safe, reliable, and transparent moving services across India. Get instant quotes and live tracking.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Radhe Packers and Movers",
    title: "Radhe Packers and Movers — Your Trusted Move",
    description:
      "India's most trusted packers & movers. Safe, reliable, and transparent moving services across India. Get instant quotes and live tracking.",
    url: BASE_URL,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Radhe Packers and Movers — Your Trusted Move",
    description:
      "India's most trusted packers & movers. Safe, reliable, and transparent moving services across India. Get instant quotes and live tracking.",
    images: ["/og-image.jpg"],
  },
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
