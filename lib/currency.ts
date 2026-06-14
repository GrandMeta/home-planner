/**
 * Indian currency formatting utilities.
 * All values are in INR (Indian Rupees).
 * Format: ₹1.83 Cr / ₹18.3 L / ₹9,599 / ₹9,599/sq.ft
 */

const CRORE = 10_000_000;
const LAKH = 100_000;
const THOUSAND = 1_000;

/**
 * Format a number using Indian grouping (2,2,3 from right).
 * Example: 1832699 → "18,32,699"
 */
export function toIndianNumberString(value: number): string {
  const parts = Math.abs(Math.round(value)).toString().split("");
  const sign = value < 0 ? "-" : "";
  const len = parts.length;
  const result: string[] = [];

  for (let i = 0; i < len; i++) {
    const posFromRight = len - 1 - i;
    result.push(parts[i]);
    if (
      posFromRight > 0 &&
      ((posFromRight === 3) || (posFromRight > 3 && (posFromRight - 3) % 2 === 0))
    ) {
      result.push(",");
    }
  }
  return sign + result.join("");
}

/**
 * Compact Indian currency format.
 * ≥ 1 Cr → "₹1.83 Cr"
 * ≥ 1 L → "₹18.3 L"
 * < 1 L → "₹9,599"
 */
export function formatINR(value: number | null | undefined, compact = true): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  if (value === 0) return "₹0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (!compact || abs < THOUSAND) {
    return `${sign}₹${toIndianNumberString(abs)}`;
  }

  if (abs >= CRORE) {
    const cr = abs / CRORE;
    const formatted = cr >= 100 ? cr.toFixed(0) : cr >= 10 ? cr.toFixed(1) : cr.toFixed(2);
    return `${sign}₹${formatted} Cr`;
  }

  if (abs >= LAKH) {
    const l = abs / LAKH;
    const formatted = l >= 100 ? l.toFixed(0) : l.toFixed(1);
    return `${sign}₹${formatted} L`;
  }

  return `${sign}₹${toIndianNumberString(abs)}`;
}

/**
 * Full Indian number format, no compact.
 * Example: 18326994 → "₹1,83,26,994"
 */
export function formatINRFull(value: number | null | undefined): string {
  return formatINR(value, false);
}

/**
 * Per sq.ft formatting.
 * Example: 9599 → "₹9,599/sq.ft"
 */
export function formatPerSqft(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `₹${toIndianNumberString(Math.round(value))}/sq.ft`;
}

/**
 * Percentage formatting.
 * Example: 12.5 → "12.5%"
 */
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `${value.toFixed(decimals)}%`;
}

/**
 * Sq.ft formatting with commas.
 * Example: 1450 → "1,450 sq.ft"
 */
export function formatSqft(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `${toIndianNumberString(Math.round(value))} sq.ft`;
}

/**
 * Format a date string (ISO) to DD MMM YYYY.
 * Example: "2025-12-31" → "31 Dec 2025"
 */
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Format a date to relative label like "Jun 2026" (possession date style).
 */
export function formatMonthYear(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  } catch {
    return isoDate;
  }
}

/**
 * Convert YouTube / Vimeo share URL to embed URL.
 */
export function toEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;

  // YouTube: youtu.be/ID or youtube.com/watch?v=ID
  const ytShort = rawUrl.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

  const ytWatch = rawUrl.match(/youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;

  const ytEmbed = rawUrl.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (ytEmbed) return rawUrl; // Already embed URL

  // Vimeo: vimeo.com/ID
  const vimeo = rawUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return rawUrl;
}

/**
 * Derive video platform from URL.
 */
export function getVideoPlatform(url: string): "youtube" | "vimeo" | "other" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "other";
}
