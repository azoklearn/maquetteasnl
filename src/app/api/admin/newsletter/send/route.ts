import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/session";
import { getNewsletterConfig, getNewsletterSubscribers } from "@/lib/db";
import { blocksToHtml } from "@/lib/newsletter-email";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60s pour envois en lot

function unauthorized() {
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NEWSLETTER_FROM || "ASNL <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY non configurée. Ajoutez-la dans .env.local" },
      { status: 500 }
    );
  }

  try {
    const [config, subscribers] = await Promise.all([
      getNewsletterConfig(),
      getNewsletterSubscribers(),
    ]);

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "Aucun abonné à la newsletter" },
        { status: 400 }
      );
    }

    const blocks = config.emailBlocks ?? [];
    const subject = config.emailSubject ?? "Newsletter ASNL";
    const accentColor = config.accentColor ?? "#fd0000";
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://asnl.fr");

    const html = blocksToHtml(blocks, accentColor, baseUrl, {
      bgColor: config.emailBgColor,
      cardBgColor: config.emailCardBgColor,
      textColor: config.emailTextColor,
      headingColor: config.emailHeadingColor,
    });

    const resend = new Resend(apiKey);

    // Envoi par lots de 100 (limite Resend)
    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const emails = batch.map((s) => ({
        from: fromEmail,
        to: s.email,
        subject,
        html,
      }));

      const { data, error } = await resend.batch.send(emails);

      if (error) {
        console.error("[newsletter/send] Resend error:", error);
        failed += batch.length;
      } else {
        sent += batch.length;
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (e) {
    console.error("[newsletter/send]", e);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
