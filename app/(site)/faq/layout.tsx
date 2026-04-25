import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Radhe Packers and Movers",
  description:
    "Get answers to common questions about booking packers and movers, pricing, payment, damage protection, cancellation policy, and live tracking on Radhe Packers and Movers.",
  alternates: {
    canonical: "https://radhepackersandmovers.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Radhe Packers and Movers",
    description:
      "Get answers to common questions about booking packers and movers, pricing, payment, damage protection, and more.",
    url: "https://radhepackersandmovers.com/faq",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Radhe Packers and Movers",
    description:
      "Answers to common questions about booking, pricing, payment, damage protection, and tracking your move.",
    images: ["/og-image.jpg"],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
