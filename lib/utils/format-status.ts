/**
 * Capitalizes the first letter of a status string
 * @param status - The status string to format
 * @returns The formatted status with capitalized first letter
 */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
