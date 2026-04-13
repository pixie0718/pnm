import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* pb-20 gives clearance above the mobile bottom tab bar */}
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
