import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  resolveAdvisorPhotoUrl,
  type AdvisorPhotoFields,
} from "@/lib/mappers/member-advisor";
import { Icon } from "./Icon";

const sizeClasses = {
  52: {
    box: "h-[52px] w-[52px]",
    icon: "h-6 w-6",
  },
  40: {
    box: "h-10 w-10",
    icon: "h-5 w-5",
  },
} as const;

export type AdvisorAvatarProps = {
  advisor?: AdvisorPhotoFields | null;
  name?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
};

/** Figma Private Office / curated CTA — circular advisor photo or fallback icon. */
export function AdvisorAvatar({
  advisor,
  name,
  size = 52,
  className,
}: AdvisorAvatarProps) {
  const photoUrl = resolveAdvisorPhotoUrl(advisor);
  const dims = sizeClasses[size];

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-white",
        dims.box,
        className,
      )}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name ? name : "Advisor"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <Icon name="user" className={dims.icon} />
      )}
    </span>
  );
}
