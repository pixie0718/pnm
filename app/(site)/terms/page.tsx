import Link from "next/link";
import { FileText, AlertCircle, Phone, Mail } from "lucide-react";
import { CONTACT } from "@/lib/config";

export const metadata = {
  title: "Terms & Conditions | ShiftIndia",
  description: "Read ShiftIndia's Terms & Conditions — governing your use of the platform, bookings, payments, damage protection, and more.",
};

const lastUpdated = "1 April 2025";

const sections = [
  {
    id: "definitions",
    title: "1. Definitions",
    content: [
      `"ShiftIndia" refers to ShiftIndia Technologies Pvt. Ltd., a company incorporated under the Companies Act, 2013, with its registered office in Mumbai, India.`,
      `"Platform" refers to the ShiftIndia website (shiftindia.in), mobile application, and any related services.`,
      `"Customer" means any individual or entity that uses the Platform to obtain relocation services.`,
      `"Vendor" means a packers & movers business registered and verified on the Platform.`,
      `"Booking" means a confirmed engagement between a Customer and a Vendor through the Platform.`,
      `"Inquiry" means a non-binding request for quotes submitted by a Customer.`,
    ],
  },
  {
    id: "acceptance",
    title: "2. Acceptance of Terms",
    content: [
      `By accessing or using the Platform, you agree to be bound by these Terms & Conditions ("Terms"), our Privacy Policy, and any additional guidelines posted on the Platform.`,
      `If you do not agree with any part of these Terms, you must not use the Platform.`,
      `ShiftIndia reserves the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the revised Terms. We will notify registered users of material changes via email.`,
    ],
  },
  {
    id: "platform-role",
    title: "3. Role of ShiftIndia",
    content: [
      `ShiftIndia operates as a marketplace that connects Customers with independent, third-party Vendors. We are not a moving company and do not directly provide relocation services.`,
      `ShiftIndia is not a party to the service agreement between Customer and Vendor. The Vendor is solely responsible for the actual delivery of moving services.`,
      `ShiftIndia's obligations are limited to: (a) facilitating the matching of Customers with Vendors; (b) administering the quote and booking process; (c) administering the damage protection program; and (d) mediating disputes where applicable.`,
      `ShiftIndia verifies Vendors at the time of onboarding but cannot guarantee that Vendors will meet expectations in every engagement. Customer reviews and ratings are the best ongoing indicator of Vendor quality.`,
    ],
  },
  {
    id: "bookings",
    title: "4. Bookings & Payments",
    content: [
      `A Booking is confirmed only when the Customer accepts a Vendor's quote on the Platform and the Vendor confirms availability.`,
      `All prices quoted are inclusive of GST unless explicitly stated otherwise. ShiftIndia charges no platform fee to Customers.`,
      `Advance payments, if requested by the Vendor, are processed through ShiftIndia's escrow mechanism. Advance amounts are released to the Vendor only after the Customer confirms successful delivery or after the resolution of any dispute.`,
      `The balance payment is due upon delivery at the Customer's destination. ShiftIndia accepts UPI, credit/debit cards, net banking, and cash (at Customer's discretion).`,
      `In the event of any billing dispute, the Customer must raise a complaint within 48 hours of delivery. Disputes raised after 48 hours may not be eligible for escrow protection.`,
    ],
  },
  {
    id: "cancellation",
    title: "5. Cancellation & Rescheduling",
    content: [
      `Customers may cancel a confirmed Booking subject to the following policy:`,
      `• Cancellation 48+ hours before moving date: Full refund of any advance paid.`,
      `• Cancellation 24–48 hours before: 25% of advance amount retained by Vendor.`,
      `• Cancellation less than 24 hours before: Up to 50% of advance amount retained.`,
      `• Cancellation on moving day: Vendor may charge up to 100% of quoted price.`,
      `Rescheduling is free if requested 48+ hours before the moving date, subject to Vendor availability. A rescheduling fee of ₹299–₹999 may apply for requests made within 48 hours.`,
      `If a Vendor cancels a confirmed Booking, the Customer receives: (a) a full refund of any advance paid; (b) priority matching with an equivalent replacement Vendor; and (c) ₹2,000 compensation if no replacement is arranged within 4 hours.`,
    ],
  },
  {
    id: "damage",
    title: "6. Damage Protection",
    content: [
      `Every Booking made through the Platform includes complimentary damage protection up to ₹5,00,000 (Rupees Five Lakhs) per move ("Damage Protection Program").`,
      `The Damage Protection Program covers physical damage to household goods occurring during loading, transit, and unloading by the Vendor.`,
      `The following are excluded from damage protection: (a) items packed by the Customer themselves; (b) pre-existing damage; (c) items declared as fragile but not given special handling instructions; (d) electronics and appliances with pre-existing faults; (e) jewellery, cash, documents, and items of extraordinary value unless specially declared.`,
      `To raise a claim: (a) photograph the damaged item(s) before further unpacking; (b) submit a claim through your Account within 24 hours of delivery; (c) our claims team will acknowledge within 4 working hours.`,
      `Valid claims are processed within 72 working hours. ShiftIndia's decision on damage claims is final, subject to applicable law.`,
    ],
  },
  {
    id: "prohibited",
    title: "7. Prohibited Items",
    content: [
      `The following items may NOT be transported through the Platform under any circumstances:`,
      `• Hazardous materials: LPG cylinders, petrol, chemicals, explosives, ammunition.`,
      `• Illegal items: Narcotics, counterfeit goods, prohibited substances.`,
      `• Live animals or plants.`,
      `• Human remains.`,
      `• Perishable food items.`,
      `The following items may be transported only with prior written declaration and Vendor consent:`,
      `• Artworks, antiques, or collectibles valued over ₹1,00,000.`,
      `• Jewellery, gold, or items of significant monetary value.`,
      `• Sensitive documents, passports, or legal instruments.`,
      `ShiftIndia and the Vendor disclaim all liability for any prohibited items transported without declaration.`,
    ],
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content: [
      `ShiftIndia's total aggregate liability to any Customer for any claim arising out of or related to these Terms or the Platform shall not exceed the greater of: (a) the total amount paid by the Customer for the specific Booking giving rise to the claim; or (b) ₹10,000.`,
      `ShiftIndia shall not be liable for: (a) indirect, incidental, or consequential damages; (b) loss of data or business; (c) Vendor's failure to perform; (d) force majeure events including floods, strikes, government orders, or road closures.`,
      `Nothing in these Terms limits ShiftIndia's liability for death or personal injury caused by its own negligence, or for fraud or fraudulent misrepresentation.`,
    ],
  },
  {
    id: "dispute",
    title: "9. Dispute Resolution",
    content: [
      `In the event of a dispute between a Customer and a Vendor, the parties agree to first attempt resolution through ShiftIndia's mediation process.`,
      `To initiate mediation, contact ShiftIndia at hello@shiftindia.in within 7 days of the dispute arising. ShiftIndia will respond within 2 business days.`,
      `If mediation fails, disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra, India.`,
      `These Terms are governed by the laws of the Republic of India, including the Consumer Protection Act, 2019, and the Information Technology Act, 2000.`,
    ],
  },
  {
    id: "privacy",
    title: "10. Privacy",
    content: [
      `Your use of the Platform is governed by our Privacy Policy, which is incorporated by reference into these Terms.`,
      `By using the Platform, you consent to the collection and use of your information as described in the Privacy Policy.`,
      `ShiftIndia will never sell your personal information to third parties. Vendor contact details are shared only as necessary to facilitate your confirmed Booking.`,
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: [
      `For questions about these Terms, please contact:`,
      `ShiftIndia Technologies Pvt. Ltd.`,
      `Email: legal@shiftindia.in`,
      `Phone: ${CONTACT.phoneDisplay} (Toll Free)`,
      `Address: 5th Floor, One BKC, Bandra Kurla Complex, Mumbai 400051, Maharashtra, India.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-midnight-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <FileText size={12} /> Legal
          </div>
          <h1 className="display text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-midnight-300">
            Last updated: <strong className="text-white">{lastUpdated}</strong>
          </p>
          <div className="mt-6 p-4 bg-saffron-500/20 border border-saffron-500/30 rounded-xl text-sm text-saffron-300 flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            Please read these terms carefully before using ShiftIndia. By using our platform, you agree to these terms.
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">

          {/* TABLE OF CONTENTS — sticky */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-midnight-400 mb-3 px-3">Contents</div>
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
              <div className="font-bold text-midnight-900 mb-2">Have questions about these terms?</div>
              <p className="mb-4">Our legal team is happy to clarify anything. Reach us at:</p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:legal@shiftindia.in" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-900 text-white text-xs font-bold hover:bg-midnight-700 transition">
                  <Mail size={13} /> legal@shiftindia.in
                </a>
                <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-midnight-700 text-xs font-bold hover:bg-slate-100 transition">
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
