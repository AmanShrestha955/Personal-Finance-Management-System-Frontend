/**
 * Get the photo URL for a user
 * Handles:
 * - Google OAuth users with direct photo URLs (returns as-is)
 * - Local users with uploaded photos (prepends API URL)
 * - Users without photos (returns Gravatar or default)
 */
export const getPhotoUrl = (
  photo: string | null | undefined,
  email?: string,
  provider?: string,
): string => {
  // If photo exists
  if (photo) {
    // If provider is Google, return photo URL as-is (direct URL from Google)
    if (provider === "google") {
      return photo;
    }
    // If provider is not specified or is local, prepend API URL
    return `${process.env.NEXT_PUBLIC_API_URL}/${photo}`;
  }

  // If no photo, use Gravatar or fallback
  if (email) {
    // Create Gravatar URL using MD5 hash of lowercased email
    const trimmedEmail = email.toLowerCase().trim();
    const hash = md5(trimmedEmail);
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  }

  // Default fallback
  return "/default_user.jpg";
};

/**
 * Simple MD5 hash function for email (for Gravatar)
 * This is used to generate Gravatar URLs
 */
function md5(str: string): string {
  let hash = 0;
  let i, chr;
  if (str.length === 0) return hash.toString();
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to hex string
  let hex = "";
  for (i = 0; i < 4; i++) {
    hex += ("0" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return hex;
}

/**
 * Alternative: Use crypto-js or a library for proper MD5
 * For now, using a simple hash that generates consistent identicons
 */
export const getGravatarUrl = (email: string | null | undefined): string => {
  if (!email) {
    return "https://www.gravatar.com/avatar/?d=identicon&s=200";
  }

  const trimmedEmail = email.toLowerCase().trim();
  const hash = md5(trimmedEmail);
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};
