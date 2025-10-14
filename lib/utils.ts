import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
