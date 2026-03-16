/**
 * Génère le HTML de la newsletter pour envoi par email.
 * Compatible clients mail (table-based, inline styles).
 */
import type { EmailBlock } from "@/lib/db";

function resolveImageUrl(url: string, baseUrl: string): string {
  if (!url) return "";
  // Data URL (image encodée en base64 depuis l'admin) → on renvoie tel quel
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = baseUrl.replace(/\/$/, "");
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
}

export function blocksToHtml(
  blocks: EmailBlock[],
  accentColor: string,
  baseUrl: string = "https://asnl.fr"
): string {
  const parts: string[] = [];

  for (const block of blocks) {
    if (block.type === "logo") {
      const src = resolveImageUrl(block.url || "/logo.jpeg", baseUrl);
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td align="center" style="padding: 24px 0;">
            <img src="${src}" alt="Logo" width="80" height="80" style="display:block;max-width:80px;height:auto;" />
          </td></tr>
        </table>
      `);
    } else if (block.type === "heading") {
      const size = block.level === 2 ? "24px" : "30px";
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 8px 0 16px; font-family: Arial, sans-serif; font-size: ${size}; font-weight: 800; color: #ffffff; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.05em;">
            ${escapeHtml(block.content)}
          </td></tr>
        </table>
      `);
    } else if (block.type === "text") {
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 8px 0; font-family: Arial, sans-serif; font-size: 14px; color: #e5e5e5; line-height: 1.6;">
            ${escapeHtml(block.content).replace(/\n/g, "<br />")}
          </td></tr>
        </table>
      `);
    } else if (block.type === "image") {
      const src = block.url ? resolveImageUrl(block.url, baseUrl) : "https://via.placeholder.com/600x200?text=Image";
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 16px 0;">
            <img src="${src}" alt="${escapeHtml(block.alt || "")}" width="600" style="max-width: 100%; height: auto; display: block; border-radius: 8px;" />
          </td></tr>
        </table>
      `);
    } else if (block.type === "divider") {
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 24px 0; border-top: 1px solid rgba(255,255,255,0.14);"></td></tr>
        </table>
      `);
    } else if (block.type === "button") {
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 16px 0;">
            <a href="${escapeHtml(block.url)}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 28px; background-color: ${accentColor}; color: #ffffff !important; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.12em;">
              ${escapeHtml(block.label)}
            </a>
          </td></tr>
        </table>
      `);
    } else if (block.type === "html") {
      parts.push(block.content || "");
    }
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter ASNL</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#0A0A0A" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#111111" style="max-width: 100%; background-color: #111111; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 40px rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.06);">
          <tr>
            <td style="padding: 32px 24px;">
              ${parts.join("")}
            </td>
          </tr>
        </table>
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 100%;">
          <tr>
            <td align="center" style="padding: 24px 20px; font-size: 11px; color: #666666; font-family: Arial, sans-serif;">
              AS Nancy Lorraine — Newsletter<br />
              Si vous ne souhaitez plus recevoir ces emails, ignorez pour l'instant (désabonnement à venir).
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
