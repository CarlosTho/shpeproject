"use server";

import { revalidateTag } from "next/cache";
import { INTERNSHIPS_CACHE_TAG } from "@/lib/internships/constants";

/** Clears cached README + parsed listings so the next load fetches GitHub again. */
export async function refreshInternshipsFromGithub() {
  revalidateTag(INTERNSHIPS_CACHE_TAG, "max");
}
