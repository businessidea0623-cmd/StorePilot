/**
 * Pakistan Locale and Timezone Formatters
 * Currency: PKR (Rs.)
 * Timezone: Asia/Karachi (PKT, UTC+05:00)
 * Locale: en-PK
 */

export const PK_TIMEZONE = 'Asia/Karachi';
export const PK_LOCALE = 'en-PK';

/**
 * Formats a monetary number into Pakistani Rupees: Rs. 1,500.00
 */
export function formatPKR(amount: number | undefined | null): string {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  
  const formattedNumber = new Intl.NumberFormat(PK_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  return `Rs. ${formattedNumber}`;
}

/**
 * General currency formatter with PKR default
 */
export function formatCurrency(
  amount: number | undefined | null,
  currencyCode: string = 'PKR'
): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  if (currencyCode.toUpperCase() === 'PKR') {
    return formatPKR(num);
  }

  // Preserve other currencies if external Shopify store is connected in USD/EUR etc.
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(num);
  } catch {
    return `${currencyCode} ${num.toFixed(2)}`;
  }
}

/**
 * Formats a date into readable Pakistan-friendly format: 23 Oct 2026
 */
export function formatPKDate(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(PK_LOCALE, {
    timeZone: PK_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a date & time in Pakistan Standard Time (PKT, 12-hour format): 23 Oct 2026, 04:15 PM PKT
 */
export function formatPKDateTime(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  const datePart = new Intl.DateTimeFormat(PK_LOCALE, {
    timeZone: PK_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat(PK_LOCALE, {
    timeZone: PK_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${datePart}, ${timePart} PKT`;
}

/**
 * Formats time in Pakistan Standard Time (12-hour format): 04:15 PM PKT
 */
export function formatPKTime(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(PK_LOCALE, {
    timeZone: PK_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
