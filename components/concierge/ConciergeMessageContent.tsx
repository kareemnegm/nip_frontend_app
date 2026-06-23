"use client";

import Markdown from "react-markdown";
import { cn } from "@/lib/cn";

type ConciergeMessageContentProps = {
  content: string;
  className?: string;
};

export function ConciergeMessageContent({
  content,
  className,
}: ConciergeMessageContentProps) {
  return (
    <div className={cn(className)}>
      <Markdown
        components={{
        p: ({ children }) => (
          <p className="mb-2 last:mb-0">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-ink">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">
            {children}
          </ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        h1: ({ children }) => (
          <p className="mb-2 font-semibold text-ink">{children}</p>
        ),
        h2: ({ children }) => (
          <p className="mb-2 font-semibold text-ink">{children}</p>
        ),
        h3: ({ children }) => (
          <p className="mb-1 font-semibold text-ink">{children}</p>
        ),
      }}
      >
        {content}
      </Markdown>
    </div>
  );
}
