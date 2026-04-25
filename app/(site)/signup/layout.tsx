import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Radhe Packers and Movers",
  description: "Create your Radhe Packers and Movers account to track bookings and manage your moves.",
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
