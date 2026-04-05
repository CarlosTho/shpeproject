import { unstable_cache } from "next/cache";
import {
  INTERNSHIPS_CACHE_TAG,
  INTERNSHIPS_REVALIDATE_SECONDS,
} from "./constants";
import {
  fetchSimplifyReadmeText,
  parseSimplifyInternshipsReadme,
} from "./parse-readme";
import type { InternshipListing } from "./types";

export type InternshipsResult =
  | { ok: true; listings: InternshipListing[] }
  | { ok: false; listings: []; error: string };

async function loadInternshipsUncached(): Promise<InternshipsResult> {
  try {
    const text = await fetchSimplifyReadmeText();
    const { listings } = parseSimplifyInternshipsReadme(text);
    return {
      ok: true,
      listings,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, listings: [], error: message };
  }
}

export const getInternships = unstable_cache(
  loadInternshipsUncached,
  ["simplify-summer-2026-internships"],
  {
    revalidate: INTERNSHIPS_REVALIDATE_SECONDS,
    tags: [INTERNSHIPS_CACHE_TAG],
  },
);
