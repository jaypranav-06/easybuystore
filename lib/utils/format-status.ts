/**
 * Formats order status to a user-friendly string
 * @param status - The status string to format
 * @returns The formatted status string
 */
export function formatStatus(status: string | null | undefined): string {
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

  return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
