"use client";

import { GA4_MEASUREMENT_ID } from "./constants";
import type { TrackingEvent } from "@/types";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// ─── GA4 ─────────────────────────────────────────────────────────────────────

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA4_MEASUREMENT_ID, { page_path: url });
}

export function trackEvent({ category, action, label, value }: TrackingEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ─── Billetterie CTA ─────────────────────────────────────────────────────────

export function trackTicketingClick(source: string, matchLabel?: string) {
  trackEvent({
    category: "Billetterie",
    action: "click_cta_ticketing",
    label: matchLabel ? `${source} - ${matchLabel}` : source,
  });

  // Meta Pixel Standard Event
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_category: "Billetterie",
      content_name: matchLabel ?? source,
    });
  }

  // Push GTM dataLayer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "ticketing_cta_click",
      cta_source: source,
      match_label: matchLabel ?? null,
    });
  }
}

export function trackNewsletterSignup(email?: string) {
  trackEvent({ category: "Engagement", action: "newsletter_signup", label: email });
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", { content_name: "Newsletter ASNL" });
  }
}

export function trackShopClick(source: string) {
  trackEvent({ category: "Boutique", action: "click_shop", label: source });
}
