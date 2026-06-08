"use client";

import { useState } from "react";
import { Icon } from "./ui/Icon";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div key={item.question} className="py-5">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="text-base font-bold text-brand">{item.question}</span>
              <Icon
                name={isOpen ? "check" : "plus"}
                className="h-4 w-4 shrink-0 text-brand"
              />
            </button>
            {isOpen ? (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-secondary">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
