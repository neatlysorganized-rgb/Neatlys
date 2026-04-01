export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const email = value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  return email;
}

export function normalizeOptionalName(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const name = value.trim();
  return name ? name : null;
}

export function validatePassword(value: unknown): string | null {
  if (typeof value !== 'string') {
    return 'password is required';
  }

  if (value.length < 8) {
    return 'password must be at least 8 characters';
  }

  return null;
}

export function parsePositiveInteger(value: unknown): number | null {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || !Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function parsePositiveNumber(value: unknown): number | null {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function parseRating(value: unknown): number | null {
  const rating = parsePositiveInteger(value);
  if (rating === null || rating < 1 || rating > 5) {
    return null;
  }

  return rating;
}

export function parseDate(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const date = value.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

export function parseTime(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const time = value.trim();
  return /^\d{2}:\d{2}(:\d{2})?$/.test(time) ? time : null;
}

export function parseNonEmptyText(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const text = value.trim();
  return text ? text : null;
}
