import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ONEI_HOST = "onei.lk";
const ONEI_PROXY_HOSTS = new Set([
  "images.weserv.nl",
  "wsrv.nl",
  "proxy.duckduckgo.com",
]);
const WESERV_PROXY_BASE = "https://images.weserv.nl/?default=1&url=";

function normalizeHost(value: string) {
  return value.replace(/^www\./i, "");
}

function shouldBypassProxy(url: URL) {
  if (normalizeHost(url.hostname) !== ONEI_HOST) {
    return false;
  }

  const path = url.pathname.toLowerCase();

  if (path.startsWith("/wp-content/themes/")) {
    return true;
  }

  const extension = path.split(".").pop();

  return extension === "svg";
}

function buildOneiProxyUrl(target: URL) {
  if (normalizeHost(target.hostname) !== ONEI_HOST) {
    return undefined;
  }

  if (shouldBypassProxy(target)) {
    return target.href;
  }

  const upstream = `ssl:${normalizeHost(target.hostname)}${target.pathname}${target.search}`;
  return `${WESERV_PROXY_BASE}${encodeURIComponent(upstream)}`;
}

/**
 * Normalize product image URLs and transparently proxy providers that block hotlinking.
 */
export function resolveProductImageUrl(source?: string | null) {
  if (!source) {
    return undefined;
  }

  try {
    const parsed = new URL(source);
    const normalizedHost = normalizeHost(parsed.hostname);

    if (normalizedHost === ONEI_HOST) {
      return buildOneiProxyUrl(parsed) ?? parsed.href;
    }

    if (ONEI_PROXY_HOSTS.has(normalizedHost)) {
      const paramKey = normalizedHost === "proxy.duckduckgo.com" ? "u" : "url";
      const target = parsed.searchParams.get(paramKey);

      if (target) {
        try {
          const resolvedTarget = (() => {
            if (target.startsWith("ssl:")) {
              return new URL(`https://${target.replace(/^ssl:/i, "")}`);
            }

            if (target.startsWith("http://") || target.startsWith("https://")) {
              return new URL(target);
            }

            return new URL(`https://${target}`);
          })();

          return buildOneiProxyUrl(resolvedTarget) ?? resolvedTarget.href;
        } catch {
          return parsed.href;
        }
      }
    }

    return parsed.href;
  } catch {
    // Non-absolute URLs fall back to the original value.
    return source;
  }
}

/**
 * Format a number as Sri Lankan Rupees (Rs.)
 * @param amount - Amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatSLCurrency(
  amount: number, 
  options: { 
    notation?: 'standard' | 'compact',
    minimumFractionDigits?: number,
    maximumFractionDigits?: number,
    compactDisplay?: 'short' | 'long'
  } = {}
): string {
  const { 
    notation = 'standard',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    compactDisplay = 'short'
  } = options;

  // Use Intl.NumberFormat to handle formatting
  const formatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    currencyDisplay: 'narrowSymbol', // Use Rs. symbol
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
    compactDisplay
  });

  // Format and return
  return formatter.format(amount);
}
