import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Radhe Packers and Movers",
  description: "Login to your Radhe Packers and Movers account to track your bookings and manage your moves.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
