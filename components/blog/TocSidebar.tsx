"use client";

import { useEffect, useRef, useState } from "react";
import { List } from "lucide-react";
import type { TocItem } from "@/lib/toc";

export default function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24 w-64 shrink-0 hidden xl:block">
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <List size={15} className="text-saffron-500" />
          <span className="text-xs font-bold text-midnight-700 uppercase tracking-wider">
            Table of Contents
          </span>
        </div>
        <ol className="space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: item.level === 2 ? 0 : item.level === 3 ? "0.875rem" : "1.75rem" }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(item.id);
                }}
                className={`block text-sm py-1 pr-1 leading-snug transition-colors rounded ${
                  activeId === item.id
                    ? "text-saffron-600 font-semibold"
                    : "text-midnight-500 hover:text-midnight-900"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
