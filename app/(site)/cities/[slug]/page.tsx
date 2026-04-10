import { redirect } from "next/navigation";
import { getAllCitySlugs } from "@/lib/content";

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export default function OldCityPage({ params }: { params: { slug: string } }) {
  redirect(`/packers-and-movers-in-${params.slug}`);
}
