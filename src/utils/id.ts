/**
 * Generate a unique ID for projects, tiles, etc.
 * Uses timestamp + random string for uniqueness
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

