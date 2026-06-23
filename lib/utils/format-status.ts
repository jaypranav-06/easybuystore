/**
 * ORDER STATUS FORMATTING UTILITY
 *
 * This file provides a utility function to convert technical order status codes
 * into user-friendly labels for display in the UI.
 *
 * Purpose:
 * - Database stores statuses as lowercase codes (e.g., "pending", "processing")
 * - UI displays human-readable labels (e.g., "Payment Pending", "Paid - Preparing for Delivery")
 */

/**
 * FORMAT STATUS
 *
 * Converts a technical order status code to a user-friendly display string.
 *
 * Status Mappings:
 * - pending → "Payment Pending"
 * - processing → "Paid - Preparing for Delivery"
 * - shipped → "Shipped"
 * - completed → "Delivered"
 * - cancelled → "Cancelled"
 * - failed → "Payment Failed"
 *
 * Fallback Behavior:
 * If status doesn't match any mapping, capitalizes the first letter
 * (e.g., "unknown" → "Unknown")
 *
 * @param status - The status code from the database (can be null/undefined)
 * @returns User-friendly formatted status string, or empty string if status is null/undefined
 *
 * @example
 * formatStatus("pending") // Returns "Payment Pending"
 * formatStatus("shipped") // Returns "Shipped"
 * formatStatus("PROCESSING") // Returns "Paid - Preparing for Delivery" (case insensitive)
 * formatStatus(null) // Returns ""
 */
export function formatStatus(status: string | null | undefined): string {
  // Handle null/undefined cases
  if (!status) return '';

  // Map technical statuses to user-friendly labels
  const statusMap: Record<string, string> = {
    'pending': 'Payment Pending',
    'processing': 'Paid - Preparing for Delivery',
    'shipped': 'Shipped',
    'completed': 'Delivered',
    'cancelled': 'Cancelled',
    'failed': 'Payment Failed',
  };

  // Convert to lowercase for case-insensitive lookup
  // If status exists in map, use mapped value; otherwise capitalize first letter
  return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
