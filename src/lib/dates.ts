/**
 * Date utilities for Vintage Vibe Events.
 *
 * All date calculations for event booking strictly reference the destination
 * timezone (Asia/Kolkata, IST UTC+5:30) to prevent off-by-one errors across
 * international client browsers or UTC server environments.
 */

export const EVENT_TIMEZONE = "Asia/Kolkata";

/**
 * Returns the current calendar date in the destination timezone formatted as YYYY-MM-DD.
 */
export function getTodayDateString(
  timeZone: string = EVENT_TIMEZONE,
  now: Date = new Date()
): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Returns tomorrow's calendar date in the destination timezone formatted as YYYY-MM-DD.
 * Used for dynamic `min` datepicker boundaries.
 */
export function getTomorrowDateString(
  timeZone: string = EVENT_TIMEZONE,
  now: Date = new Date()
): string {
  const todayStr = getTodayDateString(timeZone, now);
  const [year, month, day] = todayStr.split("-").map((v) => parseInt(v, 10));
  // Create UTC date to advance 1 calendar day cleanly across month/year/leap boundaries
  const tomorrowUtc = new Date(Date.UTC(year, month - 1, day + 1));
  const tYear = tomorrowUtc.getUTCFullYear();
  const tMonth = String(tomorrowUtc.getUTCMonth() + 1).padStart(2, "0");
  const tDay = String(tomorrowUtc.getUTCDate()).padStart(2, "0");
  return `${tYear}-${tMonth}-${tDay}`;
}

export interface DateValidationResult {
  valid: boolean;
  normalizedDate?: string;
  error?: string;
}

/**
 * Validates whether an event date string is strictly in the future (tomorrow or later)
 * relative to the destination timezone.
 * Supports standard ISO (YYYY-MM-DD) and common localized (DD-MM-YYYY) input formats.
 * Empty or unsupplied values are considered valid because event date is optional.
 */
export function isValidFutureEventDate(
  dateStr: string | null | undefined,
  timeZone: string = EVENT_TIMEZONE,
  now: Date = new Date()
): DateValidationResult {
  if (!dateStr || !dateStr.trim()) {
    return { valid: true };
  }

  const trimmed = dateStr.trim();

  let year: number;
  let month: number;
  let day: number;

  const ymdMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:T.*)?$/);
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);

  if (ymdMatch) {
    year = parseInt(ymdMatch[1], 10);
    month = parseInt(ymdMatch[2], 10);
    day = parseInt(ymdMatch[3], 10);
  } else if (dmyMatch) {
    day = parseInt(dmyMatch[1], 10);
    month = parseInt(dmyMatch[2], 10);
    year = parseInt(dmyMatch[3], 10);
  } else {
    return {
      valid: false,
      error: "Please enter a valid date in YYYY-MM-DD or DD-MM-YYYY format.",
    };
  }

  // Calendar validity check (e.g. rejects Feb 31, month 13, etc.)
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return {
      valid: false,
      error: "The provided date does not exist on the calendar.",
    };
  }

  const normalized = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const todayInKolkata = getTodayDateString(timeZone, now);

  // ISO date strings YYYY-MM-DD compare chronologically with lexical comparisons
  if (normalized <= todayInKolkata) {
    return {
      valid: false,
      error: "Event date must be in the future (tomorrow or later).",
    };
  }

  return { valid: true, normalizedDate: normalized };
}
