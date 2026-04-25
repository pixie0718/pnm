import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Radhe Packers and Movers",
  description:
    "Get in touch with Radhe Packers and Movers. Call us, WhatsApp, or fill out the inquiry form. Our team responds within 2 hours — Mon to Sat, 9AM–8PM.",
  alternates: {
    canonical: "https://radhepackersandmovers.com/contact",
  },
  openGraph: {
    title: "Contact Us | Radhe Packers and Movers",
    description:
      "Get in touch with Radhe Packers and Movers. Call us, WhatsApp, or fill out the inquiry form. Our team responds within 2 hours.",
    url: "https://radhepackersandmovers.com/contact",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Radhe Packers and Movers",
    description:
      "Get in touch with Radhe Packers and Movers. Call, WhatsApp, or fill out the inquiry form. Team responds within 2 hours.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
