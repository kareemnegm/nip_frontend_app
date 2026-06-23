"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div
            key={item.id ?? item.question}
            className={cn(
              "border-b border-basalt-100",
              isOpen ? "flex flex-col gap-3 py-5" : "py-5",
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center gap-2 text-start"
            >
              <span className="flex-1 text-[15px] font-semibold leading-[22px] tracking-[-0.01em] text-brand">
                {item.question}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-body-lg leading-7 text-accent"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="text-start text-body-sm leading-[18px] text-ink-tertiary">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
