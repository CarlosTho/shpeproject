import {
  INTERNSHIPS_CACHE_TAG,
  INTERNSHIPS_REVALIDATE_SECONDS,
} from "./constants";
import type { InternshipListing } from "./types";

const README_URL =
  "https://raw.githubusercontent.com/SimplifyJobs/Summer2026-Internships/dev/README.md";

export { README_URL };

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractInnerTablesAndRows(html: string): string[] {
  const rows: string[] = [];
  const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = trRe.exec(html)) !== null) {
    const inner = m[1] ?? "";
    if (/<th\b/i.test(inner)) continue;
    rows.push(inner);
  }
  return rows;
}

function extractTds(trInner: string): string[] {
  const tds: string[] = [];
  const tdRe = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = tdRe.exec(trInner)) !== null) {
    tds.push(m[1] ?? "");
  }
  return tds;
}

function parseCompanyCell(
  html: string,
): { name: string; url: string | null } {
  const aMatch = html.match(
    /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i,
  );
  if (aMatch) {
    return { url: aMatch[1]!, name: stripHtml(aMatch[2]!) };
  }
  return { name: stripHtml(html), url: null };
}

function parseApplicationCell(html: string): {
  applyUrl: string | null;
  simplifyUrl: string | null;
} {
  let applyUrl: string | null = null;
  let simplifyUrl: string | null = null;

  const anchorRe =
    /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = anchorRe.exec(html)) !== null) {
    const href = m[1]!;
    const inner = m[2] ?? "";
    if (/alt="Apply"/i.test(inner) && !applyUrl) applyUrl = href;
    if (/alt="Simplify"/i.test(inner) && !simplifyUrl) simplifyUrl = href;
  }

  if (!applyUrl) {
    const fallback = html.match(/<a\s+[^>]*href="([^"]+)"/i);
    if (fallback && !fallback[1]!.includes("simplify.jobs/p/")) {
      applyUrl = fallback[1]!;
    }
  }

  if (!simplifyUrl) {
    const all = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"/gi)];
    for (const [, href] of all) {
      if (href!.includes("simplify.jobs/p/")) {
        simplifyUrl = href!;
        break;
      }
    }
  }

  return { applyUrl, simplifyUrl };
}

function isInternshipSectionHeading(line: string): boolean {
  const t = line.trim();
  if (!t.startsWith("## ")) return false;
  return t.includes("Internship Roles");
}

/** Parses Summer2026-Internships README (HTML <table> rows). */
export function parseSimplifyInternshipsReadme(markdown: string): {
  listings: InternshipListing[];
  error?: string;
} {
  const listings: InternshipListing[] = [];

  const parts = markdown.split(/\n(?=## )/);

  for (const part of parts) {
    const firstLine = part.split("\n")[0] ?? "";
    if (!isInternshipSectionHeading(firstLine)) {
      continue;
    }

    let lastCompany = "";
    let lastCompanyUrl: string | null = null;

    const category = firstLine.replace(/^##\s+/, "").trim();
    const rowInners = extractInnerTablesAndRows(part);

    for (const trInner of rowInners) {
      const tds = extractTds(trInner);
      if (tds.length !== 5) continue;

      const [c0, c1, c2, c3, c4] = tds;
      const companyText = stripHtml(c0!);

      let company: string;
      let companyUrl: string | null;

      if (companyText === "↳" || c0!.includes("↳")) {
        company = lastCompany;
        companyUrl = lastCompanyUrl;
      } else {
        const parsed = parseCompanyCell(c0!);
        company = parsed.name || lastCompany;
        companyUrl = parsed.url;
        if (company && company !== "↳") {
          lastCompany = company;
          lastCompanyUrl = companyUrl;
        }
      }

      if (!company) continue;

      const role = stripHtml(c1!);
      if (!role || /^company$/i.test(role)) continue;

      const { applyUrl, simplifyUrl } = parseApplicationCell(c3!);

      listings.push({
        category,
        company,
        companyUrl,
        role,
        location: stripHtml(c2!),
        applyUrl,
        simplifyUrl,
        age: stripHtml(c4!),
      });
    }
  }

  return { listings };
}

export async function fetchSimplifyReadmeText(): Promise<string> {
  const res = await fetch(README_URL, {
    next: {
      revalidate: INTERNSHIPS_REVALIDATE_SECONDS,
      tags: [INTERNSHIPS_CACHE_TAG],
    },
    headers: { Accept: "text/plain" },
  });
  if (!res.ok) {
    throw new Error(`README fetch failed: ${res.status}`);
  }
  return res.text();
}
