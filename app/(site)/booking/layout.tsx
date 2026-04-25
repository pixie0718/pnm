import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Packers & Movers | Radhe Packers and Movers",
  description:
    "Book verified packers and movers online. Get instant quotes, choose your inventory, add insurance, and submit your inquiry in minutes. Safe and transparent moving across India.",
  alternates: {
    canonical: "https://radhepackersandmovers.com/booking",
  },
  openGraph: {
    title: "Book Packers & Movers | Radhe Packers and Movers",
    description:
      "Book verified packers and movers online. Get instant quotes, choose your inventory, add insurance, and submit your inquiry in minutes.",
    url: "https://radhepackersandmovers.com/booking",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Packers & Movers | Radhe Packers and Movers",
    description:
      "Book verified packers and movers online. Get instant quotes, choose your inventory, and submit your inquiry in minutes.",
    images: ["/og-image.jpg"],
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
