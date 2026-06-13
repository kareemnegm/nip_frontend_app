"use client";

import { useState } from "react";
import { Icon } from "./ui/Icon";
import { cn } from "@/lib/cn";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div key={item.question} className="py-6">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <span className="text-[17px] font-bold leading-[22px] text-brand">
                {item.question}
              </span>
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-field)] border border-line bg-white text-brand transition-transform",
                  isOpen && "rotate-180",
                )}
              >
                <Icon name="chevronDown" className="h-4 w-4" />
              </span>
            </button>
            {isOpen ? (
              <p className="mt-4 max-w-[640px] text-body-md leading-[22px] text-ink-secondary">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
