/**
 * Génère le HTML de la newsletter pour envoi par email.
 * Compatible clients mail (table-based, inline styles).
 */
import type { EmailBlock } from "@/lib/db";

function resolveImageUrl(url: string, baseUrl: string): string {
  if (!url) return "";
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
      const size = block.level === 2 ? "24px" : "32px";
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 8px 0 16px; font-family: Arial, sans-serif; font-size: ${size}; font-weight: bold; color: #0A0A0A; line-height: 1.2;">
            ${escapeHtml(block.content)}
          </td></tr>
        </table>
      `);
    } else if (block.type === "text") {
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 8px 0; font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
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
          <tr><td style="padding: 24px 0; border-top: 1px solid #e5e5e5;"></td></tr>
        </table>
      `);
    } else if (block.type === "button") {
      parts.push(`
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding: 16px 0;">
            <a href="${escapeHtml(block.url)}" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 28px; background-color: ${accentColor}; color: #ffffff !important; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
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
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 32px;">
              ${parts.join("")}
            </td>
          </tr>
        </table>
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 100%;">
          <tr>
            <td align="center" style="padding: 24px 20px; font-size: 12px; color: #999;">
              AS Nancy Lorraine — Newsletter
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
