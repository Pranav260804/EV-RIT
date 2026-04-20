/**
 * Regional pricing utilities for the EV-RIT Marketplace ecosystem.
 */

// Native currency mapping standards
const CURRENCY_MAP: Record<string, string> = {
  IN: "INR",
  AU: "AUD",
  US: "USD",
};

/**
 * Resolves regional pricing from a JSONB prices object incorporating automated fallback bounds.
 * Falls back through IN -> US -> AU. Returns an empty string if entirely unresolvable.
 */
export function formatCurrency(prices: Record<string, number> | null | undefined, targetCode: string = "IN"): string {
  if (!prices) return "";

  // Defined fallback chain matching prompt instructions
  const fallbacks = [targetCode.toUpperCase(), "IN", "US", "AU"];
  let resolvedPrice: number | undefined = undefined;
  let resolvedCode: string | undefined = undefined;

  for (const code of fallbacks) {
    if (prices[code] !== undefined && prices[code] !== null) {
      resolvedPrice = prices[code];
      resolvedCode = code;
      break;
    }
  }

  // Hide the UI entirely if resolution crashes internally (avoids rendering $0.00 ghosts)
  if (resolvedPrice === undefined || resolvedCode === undefined) {
    return ""; 
  }

  const currency = CURRENCY_MAP[resolvedCode] || "INR";
  
  // Enforce correct localized comma separations (e.g., Lakhs/Crores for India vs standard Western grouping)
  const locale = resolvedCode === "IN" ? "en-IN" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(resolvedPrice);
}

/**
 * Infers the active user's regional origin directly from native browser properties.
 * Defaults securely to "IN" if client-bound objects are unreachable (SSR contexts).
 */
export function getUserRegionCode(): string {
  // Prevent SSR object crashes explicitly
  if (typeof window === "undefined" || !navigator) {
    return "IN"; 
  }

  // Probe the primary language declaration (Format usually expects 'en-US', 'en-IN', 'en-AU')
  if (navigator.language && navigator.language.includes("-")) {
    const parts = navigator.language.split("-");
    const inferredCode = parts[parts.length - 1].toUpperCase();
    
    // Validate supported whitelist
    if (["IN", "AU", "US"].includes(inferredCode)) {
      return inferredCode;
    }
  }

  // Default fail-safe
  return "IN";
}
