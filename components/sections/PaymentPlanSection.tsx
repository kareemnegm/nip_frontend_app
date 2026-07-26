"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { paymentPlanCardColors, type PaymentPlanGroup } from "@/lib/off-plan/detail";

/**
 * Payment plan cards with a plan switcher. The backend can return several named
 * plans (e.g. "Payment Plan 1", "60/40 Post-Handover"); the switcher only shows
 * when there is more than one, so single-plan projects look unchanged.
 */
export function PaymentPlanSection({
  title,
  plans,
  className,
}: {
  title: string;
  plans: PaymentPlanGroup[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (plans.length === 0) return null;

  const activePlan = plans[activeIndex] ?? plans[0];
  const showSwitcher = plans.length > 1;

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-heading-h1 uppercase text-brand">{title}</h2>
        {showSwitcher ? (
          // Same segmented control as the listing toolbar's grid/list toggle.
          <div className="flex flex-wrap overflow-hidden rounded-[var(--radius-field)] border border-border-default">
            {plans.map((plan, index) => (
              <button
                key={`${plan.title}-${index}`}
                type="button"
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "inline-flex h-9 items-center justify-center px-4 py-1.5 text-label-semibold font-semibold transition-colors",
                  index === activeIndex
                    ? "bg-brand text-white"
                    : "bg-white text-brand hover:bg-sapphire-50",
                )}
              >
                {plan.title}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {activePlan.steps.map((step, index) => (
          <article
            key={`${step.percentage}-${step.label}-${index}`}
            className={cn(
              "flex flex-col items-start gap-4 rounded-[var(--radius-card)] px-7 py-6 text-white",
              paymentPlanCardColors[index % paymentPlanCardColors.length],
            )}
          >
            {step.caption ? (
              <p
                className={cn(
                  "text-body-xs",
                  index === 0 ? "text-sapphire-100" : "text-sapphire-200",
                )}
              >
                {step.caption}
              </p>
            ) : (
              <span aria-hidden />
            )}
            <p className="text-stat-value font-bold">{step.percentage}</p>
            <p className="text-label-semibold font-semibold">{step.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
