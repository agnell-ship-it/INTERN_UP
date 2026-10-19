/**
 * Validation utilities for INTERN-UP
 */

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }
  return { isValid: true };
}

export function isValidGitHubUrl(url: string): {
  isValid: boolean;
  message?: string;
} {
  if (!url || typeof url !== 'string') {
    return { isValid: false, message: 'GitHub URL is required.' };
  }

  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return { isValid: false, message: 'URL must use secure HTTPS protocol.' };
    }

    const host = parsed.hostname.toLowerCase();
    if (host !== 'github.com' && host !== 'www.github.com' && host !== 'gist.github.com') {
      return {
        isValid: false,
        message: 'Must be a valid GitHub URL (e.g., https://github.com/username/project).',
      };
    }

    const pathname = parsed.pathname.replace(/^\/|\/$/g, '');
    const parts = pathname.split('/');
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      return {
        isValid: false,
        message: 'Please provide a direct repository or project link (e.g., https://github.com/username/repo-name).',
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL.' };
  }
}

export function isValidLinkedInUrl(url: string): {
  isValid: boolean;
  message?: string;
} {
  if (!url || typeof url !== 'string') {
    return { isValid: false, message: 'LinkedIn URL is required.' };
  }

  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return { isValid: false, message: 'URL must use secure HTTPS protocol.' };
    }

    const host = parsed.hostname.toLowerCase();
    if (!host.endsWith('linkedin.com')) {
      return {
        isValid: false,
        message: 'Must be a valid LinkedIn URL (e.g., https://www.linkedin.com/posts/...).',
      };
    }

    const path = parsed.pathname.toLowerCase();
    const hasPostPath =
      path.includes('/posts/') ||
      path.includes('/feed/update/') ||
      path.includes('/pulse/') ||
      path.includes('/post/');

    if (!hasPostPath && path.length < 5) {
      return {
        isValid: false,
        message: 'Please provide the direct URL to your public LinkedIn announcement post.',
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL.' };
  }
}

export function isValidUpiReference(ref: string): {
  isValid: boolean;
  message?: string;
} {
  if (!ref || typeof ref !== 'string') {
    return { isValid: false, message: 'Payment reference or UTR is required.' };
  }

  const clean = ref.trim();
  if (clean.length < 6) {
    return {
      isValid: false,
      message: 'Payment reference/UTR must be at least 6 characters.',
    };
  }

  // Letters, numbers, hyphens allowed
  const refRegex = /^[A-Za-z0-9\-_]{6,35}$/;
  if (!refRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Payment reference should contain only letters, numbers, and hyphens.',
    };
  }

  return { isValid: true };
}
