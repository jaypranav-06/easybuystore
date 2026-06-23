/**
 * CURRENCY FORMATTING UTILITIES
 *
 * This file provides utility functions for formatting prices in Sri Lankan Rupees (LKR).
 * Ensures consistent currency display across the entire application.
 */

/**
 * FORMAT PRICE
 *
 * Formats a numeric price value as Sri Lankan Rupees with proper thousand separators.
 *
 * Features:
 * - Adds "Rs" prefix (Sri Lankan Rupees symbol)
 * - Uses en-LK locale for proper formatting
 * - Always shows 2 decimal places
 * - Adds commas for thousands (e.g., 1,000.00)
 *
 * @param price - The price to format (can be number or string)
 * @returns Formatted price string (e.g., "Rs 1,234.56")
 *
 * @example
 * formatPrice(1234.5) // Returns "Rs 1,234.50"
 * formatPrice("999") // Returns "Rs 999.00"
 */
export function formatPrice(price: number | string): string {
  // Convert string to number if needed
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Format with commas for thousands and 2 decimal places
  return `Rs ${numPrice.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * FORMAT PRICE RANGE
 *
 * Formats both original and discounted prices for products on sale.
 * Returns an object with both prices formatted.
 *
 * Use Case:
 * Display original price (crossed out) and sale price for discounted products.
 *
 * @param originalPrice - Original price before discount
 * @param discountPrice - Discounted price (optional, if product is on sale)
 * @returns Object with formatted original and optional discount price
 *
 * @example
 * // Product on sale
 * formatPriceRange(2000, 1500)
 * // Returns { original: "Rs 2,000.00", discount: "Rs 1,500.00" }
 *
 * // Product not on sale
 * formatPriceRange(2000)
 * // Returns { original: "Rs 2,000.00" }
 */
export function formatPriceRange(
  originalPrice: number | string,
  discountPrice?: number | string | null
): { original: string; discount?: string } {
  const original = formatPrice(originalPrice);

  // If discount price exists, format and include it
  if (discountPrice) {
    return {
      original,
      discount: formatPrice(discountPrice),
    };
  }

  // No discount, return only original price
  return { original };
}
