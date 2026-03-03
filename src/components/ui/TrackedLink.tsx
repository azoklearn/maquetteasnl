"use client";

import { trackTicketingClick, trackShopClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  trackingCategory?: "ticketing" | "shop" | "partner";
  trackingSource?: string;
  matchLabel?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function TrackedLink({
  href,
  children,
  className,
  trackingCategory = "ticketing",
  trackingSource = "unknown",
  matchLabel,
  target = "_blank",
  rel = "noopener noreferrer nofollow",
  "aria-label": ariaLabel,
}: TrackedLinkProps) {
  function handleClick() {
    if (trackingCategory === "ticketing") {
      trackTicketingClick(trackingSource, matchLabel);
    } else if (trackingCategory === "shop") {
      trackShopClick(trackingSource);
    }
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      className={cn(className)}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
