/**
 * Date and Time utilities for INTERN-UP
 * Standardizes on Asia/Kolkata (IST) timezone and 7-calendar-day program calculation.
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns current timestamp in ISO format (UTC)
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Calculates program start and deadline based on enrollment timestamp.
 * Program duration is exactly 7 calendar days from enrollment.
 */
export function calculateProgramDates(enrollmentDateISO?: string): {
  startDateISO: string;
  deadlineDateISO: string;
} {
  const enrollment = enrollmentDateISO ? new Date(enrollmentDateISO) : new Date();
  
  // Start date
  const start = new Date(enrollment.getTime());
  
  // Exactly 7 calendar days from enrollment (7 * 24 * 60 * 60 * 1000)
  const deadline = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    startDateISO: start.toISOString(),
    deadlineDateISO: deadline.toISOString(),
  };
}

/**
 * Formats an ISO date string into a user-friendly string in Asia/Kolkata timezone.
 * Example: "19 Oct 2026, 04:30 PM IST" or "19 October 2026"
 */
export function formatISTDate(
  isoDateString: string,
  options?: {
    includeTime?: boolean;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
  }
): string {
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    if (options?.includeTime) {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: IST_TIMEZONE,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date) + ' IST';
    }

    return new Intl.DateTimeFormat('en-IN', {
      timeZone: IST_TIMEZONE,
      day: 'numeric',
      month: options?.dateStyle === 'short' ? 'short' : 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoDateString;
  }
}

/**
 * Calculates remaining days and whether the enrollment has expired.
 */
export function getEnrollmentTimeStatus(deadlineISO: string): {
  isExpired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  displayStatus: string;
} {
  try {
    const now = new Date();
    const deadline = new Date(deadlineISO);
    const diffMs = deadline.getTime() - now.getTime();

    if (diffMs <= 0) {
      return {
        isExpired: true,
        daysRemaining: 0,
        hoursRemaining: 0,
        displayStatus: 'Expired',
      };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    let displayStatus = '';
    if (days > 1) {
      displayStatus = `${days} days remaining`;
    } else if (days === 1) {
      displayStatus = `1 day, ${hours} hours remaining`;
    } else {
      displayStatus = `${hours} hours remaining (Ends today)`;
    }

    return {
      isExpired: false,
      daysRemaining: days,
      hoursRemaining: hours,
      displayStatus,
    };
  } catch {
    return {
      isExpired: false,
      daysRemaining: 7,
      hoursRemaining: 0,
      displayStatus: '7 days remaining',
    };
  }
}
