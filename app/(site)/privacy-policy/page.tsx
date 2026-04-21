import { Shield, Mail, Phone } from "lucide-react";
import { CONTACT, SITE } from "@/lib/config";

export const metadata = {
  title: "Privacy Policy | Radhe Packers and Movers",
  description:
    "Read Radhe Packers and Movers' Privacy Policy — how we collect, use, and protect your personal information.",
};

const lastUpdated = "1 April 2025";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly when you submit a moving inquiry, create an account, or contact us. This includes your name, phone number, email address, and move details (pickup city, destination, house size, moving date).",
      "We automatically collect certain technical information when you use our platform: IP address, browser type, device type, pages visited, and time spent on pages. This helps us improve the platform.",
      "We do not collect sensitive personal data such as Aadhaar numbers, PAN, financial account details, or biometric data.",
    ],
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      "To connect you with verified packers and movers vendors and facilitate the booking process.",
      "To send you quotes, booking confirmations, and service-related communications via SMS, WhatsApp, and email.",
      "To improve our platform, personalise your experience, and develop new features.",
      "To comply with legal obligations and resolve disputes.",
      "We will never use your personal data for unsolicited marketing without your consent.",
    ],
  },
  {
    id: "sharing",
    title: "3. Sharing of Information",
    content: [
      "We share your move details (name, phone, pickup/drop locations) with the specific vendor(s) you are matched with — only after you request quotes or confirm a booking.",
      "We do not sell, rent, or trade your personal information to any third party.",
      "We may share aggregated, anonymised data with partners for research or analytics purposes. This data cannot be used to identify you.",
      "We may disclose information if required by law, court order, or government authority.",
    ],
  },
  {
    id: "data-storage",
    title: "4. Data Storage & Security",
    content: [
      "Your data is stored on secure servers in India. We use industry-standard encryption (TLS/SSL) for data in transit and AES-256 encryption for data at rest.",
      "Access to personal data is restricted to authorised personnel only, on a need-to-know basis.",
      "We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion at any time (see Section 7).",
      "While we implement strong security measures, no system is 100% secure. We encourage you to use a strong password and keep your account credentials confidential.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    content: [
      "We use cookies and similar technologies to keep you logged in, remember your preferences, and analyse platform usage.",
      "Essential cookies: required for the platform to function (e.g., session management). Cannot be disabled.",
      "Analytics cookies: help us understand how visitors use the platform (e.g., Google Analytics). You may opt out via your browser settings.",
      "You can control cookies through your browser settings. Disabling cookies may affect some platform features.",
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: [
      "Under applicable Indian law (including the Digital Personal Data Protection Act, 2023), you have the right to:",
      "• Access: Request a copy of the personal data we hold about you.",
      "• Correction: Ask us to correct inaccurate or incomplete data.",
      "• Erasure: Request deletion of your personal data, subject to legal obligations.",
      "• Withdrawal of consent: Withdraw consent for processing at any time (this does not affect prior processing).",
      "• Grievance redressal: Lodge a complaint with our Grievance Officer (see Section 8).",
    ],
  },
  {
    id: "data-deletion",
    title: "7. Account & Data Deletion",
    content: [
      `To request deletion of your account and personal data, email us at ${CONTACT.email} with the subject line "Data Deletion Request".`,
      "We will process your request within 30 days. Some data may be retained for up to 7 years where required by law (e.g., GST records, dispute resolution logs).",
    ],
  },
  {
    id: "grievance",
    title: "8. Grievance Officer",
    content: [
      "In accordance with the Information Technology Act, 2000 and applicable rules, the name and contact details of our Grievance Officer are:",
      `Name: Grievance Officer, ${SITE.name}`,
      `Email: ${CONTACT.email}`,
      `Phone: ${CONTACT.phoneDisplay}`,
      "We will acknowledge your grievance within 24 hours and resolve it within 30 days.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. The 'Last updated' date at the top of this page will reflect any changes.",
      "For material changes, we will notify registered users via email at least 7 days before the changes take effect.",
      "Continued use of the platform after changes constitutes your acceptance of the revised policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-midnight-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <Shield size={12} /> Legal
          </div>
          <h1 className="display text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-midnight-300">
            Last updated: <strong className="text-white">{lastUpdated}</strong>
          </p>
          <p className="mt-4 text-midnight-400 text-sm leading-relaxed">
            We take your privacy seriously. This policy explains what data we collect, how we use it,
            and the controls you have over your information.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">

          {/* TABLE OF CONTENTS — sticky */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-midnight-400 mb-3 px-3">
                Contents
              </div>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-midnight-600 hover:bg-slate-100 hover:text-midnight-900 transition"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          {/* SECTIONS */}
          <div className="space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl font-extrabold text-midnight-900 mb-4 pb-3 border-b border-slate-100">
                  {s.title}
                </h2>
                <div className="space-y-3">
                  {s.content.map((p, i) => (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed ${
                        p.startsWith("•") ? "pl-4 text-midnight-600" : "text-midnight-600"
                      }`}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* FOOTER NOTE */}
            <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 text-sm text-midnight-600">
              <div className="font-bold text-midnight-900 mb-2">Questions about your data?</div>
              <p className="mb-4">
                Reach out to us — we respond to all privacy queries within 24 hours.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-900 text-white text-xs font-bold hover:bg-midnight-700 transition"
                >
                  <Mail size={13} /> {CONTACT.email}
                </a>
                <a
                  href={`tel:${CONTACT.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-midnight-700 text-xs font-bold hover:bg-slate-100 transition"
                >
                  <Phone size={13} /> {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
