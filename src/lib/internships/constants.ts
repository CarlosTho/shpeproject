/** Passed to `revalidateTag` so “Refresh” can pull the latest README immediately. */
export const INTERNSHIPS_CACHE_TAG = "simplify-internships";

/**
 * How often cached listings auto-refresh (seconds). Lower = fresher, more GitHub traffic.
 * 120 ≈ every 2 minutes; GitHub raw CDN is fine with occasional reads.
 */
export const INTERNSHIPS_REVALIDATE_SECONDS = 120;
