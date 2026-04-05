import type { DraftTemplateStep, WizardProfile } from "./types";

const PH = {
  resume: "/peer-help?type=resume_review&openRequest=1",
  career: "/peer-help?type=career_advice&openRequest=1",
  mock: "/peer-help?type=mock_interview&openRequest=1",
  dir: "/directory",
  jobs: "/internship",
} as const;

export const CAREER_TEMPLATES: Record<string, DraftTemplateStep[]> = {
  it_support: [
    {
      key: "foundations",
      title: "Learn support fundamentals",
      description:
        "OS basics, networking vocabulary, ticketing mindset, and how to debug calmly with users.",
      details:
        "Free: Google IT Support cert overview, CompTIA A+ study roadmap (you don’t need to pass before applying). Practice writing clear ticket updates.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "cred",
      title: "Build proof you can troubleshoot",
      description:
        "Document 3 small projects: home lab, VM setup, or helping a nonprofit with setup issues.",
      details:
        "Put outcomes in bullets (what broke, what you checked, how you fixed it). This becomes interview material.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Target helpdesk / IT support roles",
      description:
        "Apply to MSPs, internal IT, ed-tech, and hardware vendors — they hire entry support often.",
      details:
        "Customize one line per company (why them). Track applications in a sheet with date and follow-up.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Prep support-style interviews",
      description:
        "Practice customer scenarios, prioritization when everything is urgent, and how you learn new tools.",
      details:
        "Record yourself answering “Tell me about a time you fixed something under pressure.”",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Show up where hiring managers are",
      description:
        "Join one community (Discord, local meetup, or alumni) and ask for referrals politely after contributing.",
      details:
        "PUENTE directory: find peers in IT or adjacent roles for informational chats — not cold asks on day one.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  sales_sdr: [
    {
      key: "mindset",
      title: "Learn the SDR playbook",
      description:
        "Outbound vs inbound, ICP, sequences, and how meetings get booked — 30 min of structured reading daily.",
      details:
        "Watch 2–3 breakdowns of cold call recordings. Write your own 30-second opener in your voice.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "artifacts",
      title: "Create a tiny portfolio",
      description:
        "Draft 3 email variants, 2 call openers, and a LinkedIn snippet that shows curiosity about one industry.",
      details:
        "Hiring managers want signal you can communicate clearly. Keep samples in a doc you can share.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply in volume with focus",
      description:
        "Pick one niche (e.g. B2B SaaS SMB) for 2 weeks so your messaging stays coherent.",
      details:
        "Aim for consistent daily outreach once hired — start practicing discipline now with applications + follow-ups.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Run mock discovery calls",
      description:
        "Practice asking questions, handling objections, and closing for a next step — not pitching features.",
      details:
        "Pair with a peer: 15 min they play buyer, you run discovery, swap feedback.",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "referrals",
      title: "Earn warm intros",
      description:
        "Map 10 people who know someone in sales; send short updates on what you’re targeting.",
      details:
        "Use directory filters to find members in revenue roles — ask for 15-minute advice, not a job on first touch.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  recruiting: [
    {
      key: "basics",
      title: "Understand full-cycle vs sourcing",
      description:
        "Learn stages: intake, sourcing, screen, loop coordination, offer. Pick which side excites you.",
      details:
        "Read one company’s career page and reverse-engineer how they present roles — that’s recruiting craft.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "tools",
      title: "Get comfortable with tools + compliance basics",
      description:
        "ATS concepts, boolean search, scheduling, and keeping candidate experience respectful.",
      details:
        "Try free tutorials on LinkedIn Recruiter-lite concepts and scheduling etiquette.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Target coordinator / sourcer roles",
      description:
        "Agencies and high-growth startups often hire coordinators without prior recruiting degrees.",
      details:
        "Emphasize organization, stakeholder comms, and any customer-facing experience.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "stories",
      title: "Prep behavioral stories",
      description:
        "Conflict with a stakeholder, juggling priorities, and protecting candidate dignity under pressure.",
      details:
        "Recruiting interviews are heavy on judgment and communication — practice aloud.",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "community",
      title: "Join talent communities",
      description:
        "Follow 2–3 practitioners, comment thoughtfully, and DM one ask for advice per week max.",
      details:
        "Directory: find peers who listed HR-adjacent or ops interests for informational chats.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  digital_marketing: [
    {
      key: "channel",
      title: "Pick one channel to go deep",
      description:
        "SEO, paid social, lifecycle email, or content — shallow on all five reads junior; depth wins.",
      details:
        "Spend a week auditing one brand’s funnel: ads → landing → email follow-up. Write 5 insights.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "proof",
      title: "Publish proof of work",
      description:
        "A 1-page case study, a small campaign write-up, or a growth experiment doc with metrics.",
      details:
        "Even hypothetical + honest constraints beats an empty portfolio.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply to growth/marketing associate roles",
      description:
        "Startups and agencies value execution — show you can ship, measure, and iterate.",
      details:
        "Tailor bullets to their stack (HubSpot, GA4, Meta Ads) when you have exposure.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Practice marketing interviews",
      description:
        "Metric tradeoffs, campaign retros, and how you’d prioritize a backlog of ideas.",
      details:
        "Ask a peer to grill you on “What would you do in 30 days?” for their favorite product.",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Find peers in marketing",
      description:
        "Warm intros beat cold apps — use community to learn who’s hiring before roles post.",
      details:
        "Filter directory by interests and school; offer to help with a small task before asking for referrals.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  project_coordinator: [
    {
      key: "basics",
      title: "Learn PMO basics",
      description:
        "RACI, RAID logs, status reports, risk flags, and stakeholder comms rhythms.",
      details:
        "Pick one methodology name (Agile vs Waterfall) and know when each fits — no need to be certified yet.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "proof",
      title: "Show you can coordinate chaos",
      description:
        "Volunteer to run logistics for an event, student org, or nonprofit project — document outcomes.",
      details:
        "Quantify: attendees, vendors, deadlines hit, budget notes. That’s your interview ammo.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Target coordinator / program assistant roles",
      description:
        "Construction tech, health ops, and implementation teams hire coordinators steadily.",
      details:
        "Keywords: coordinator, implementation, operations, program assistant, PMO analyst.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Prep coordination scenarios",
      description:
        "Late deliverables, conflicting exec asks, and ambiguous scope — show calm process.",
      details:
        "Use STAR stories from school, work, or volunteer contexts.",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Meet people who run projects",
      description:
        "Ask how they track work and what they wish coordinators did more of on day one.",
      details:
        "Directory: find members in ops, CS implementation, or engineering-adjacent roles.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  data_analyst: [
    {
      key: "stack",
      title: "Lock a minimal stack",
      description:
        "SQL + spreadsheets + one viz tool (Sheets/Excel + Looker/Tableau/Power BI intro).",
      details:
        "Complete one guided SQL track and one dataset story: question → query → chart → takeaway.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "portfolio",
      title: "Ship a portfolio project",
      description:
        "Public dataset, clear hypothesis, documented cleaning assumptions, and 3 actionable insights.",
      details:
        "Host on GitHub or Notion with screenshots. Explain limitations honestly.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply to analyst / BI roles",
      description:
        "Include metrics you moved (even in class projects) and tools explicitly in bullets.",
      details:
        "Track job families: business analyst, data analyst, BI analyst, revenue ops analyst.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Practice SQL + case framing",
      description:
        "Walk through how you’d measure success, define metrics, and debug a surprising dip.",
      details:
        "Pair with a peer for live practice — explain your thinking out loud.",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Find analysts in the directory",
      description:
        "Ask how they broke in and what their hiring manager cared about most.",
      details:
        "Keep asks small: one question + gratitude, not a long cold pitch.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  web_development: [
    {
      key: "foundations",
      title: "Solidify web foundations",
      description:
        "HTML/CSS/JS, HTTP, DOM, git basics, and one framework intro (pick one and stay consistent).",
      details:
        "Build a small CRUD or portfolio site deployed to a free host — shipping beats tutorials alone.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "portfolio",
      title: "Polish 2 portfolio projects",
      description:
        "One shows UI craft; one shows logic/API/data. README with setup, tradeoffs, and screenshots.",
      details:
        "Recruiters skim — make the first screen of your README impossible to misunderstand.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply with tailored outreach",
      description:
        "Batch apps but personalize the first line: product + why their stack or mission fits you.",
      details:
        "Track companies, dates, and follow-ups. Referrals still move the needle — use directory thoughtfully.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Technical + behavioral prep",
      description:
        "Practice explaining past projects, debugging aloud, and system design at intern/new-grad depth.",
      details:
        "Do at least one timed mock before your first real loop.",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "community",
      title: "Code with others",
      description:
        "Open source good-first-issues, hack nights, or pair sessions — velocity and feedback compound.",
      details:
        "PUENTE directory: find peers building in public for accountability.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  cybersecurity: [
    {
      key: "path",
      title: "Pick an entry lane",
      description:
        "SOC analyst, GRC, or IT security support — don’t try to learn everything at once.",
      details:
        "Write a one-paragraph target role; reverse-engineer 5 job posts for shared skills.",
      bridgeLabel: "Connect with someone",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "skills",
      title: "Build baseline technical literacy",
      description:
        "Networking, Linux CLI, logs, and phishing triage concepts — hands-on labs beat passive videos.",
      details:
        "Try a free SOC-style lab or home network map. Document what you learned.",
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "creds",
      title: "Plan one credible credential",
      description:
        "Security+ / SSCP path reading / blue-team micro-certs — align credential to your lane.",
      details:
        "If no degree, credentials + labs matter more — pick one and schedule the exam window.",
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Prep security interviews",
      description:
        "Explain incidents calmly, show ethics, and practice translating tech for non-technical stakeholders.",
      details:
        "Mock: “Walk me through how you’d investigate a suspicious login.”",
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Find security-adjacent peers",
      description:
        "Communities and mentors help you avoid noisy fear-mongering and focus employable skills.",
      details:
        "Use directory + peer help for targeted questions — respect people’s time.",
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],
};

const NO_DEGREE_STEP: DraftTemplateStep = {
  key: "no_degree_cred",
  title: "Stack credibility without a 4-year degree (yet)",
  description:
    "Pick one: industry cert, shipped portfolio, or volunteer project with a reference — hiring teams want proof.",
  details:
    "List it on your resume with outcomes. If you’re studying now, say expected completion date and what you’ve already completed.",
  bridgeLabel: "Connect with someone",
  bridgeHref: PH.career,
};

export function draftStepsForCareer(careerId: string): DraftTemplateStep[] {
  const base = CAREER_TEMPLATES[careerId];
  return base ? [...base] : [];
}

export function maybeAppendNoDegreeStep(
  steps: DraftTemplateStep[],
  hasDegree: boolean,
): DraftTemplateStep[] {
  if (hasDegree) return steps;
  const has = steps.some((s) => s.key === NO_DEGREE_STEP.key);
  if (has) return steps;
  return [...steps, NO_DEGREE_STEP];
}

export function filterStepsForExperience(
  steps: DraftTemplateStep[],
  experienceLevel: WizardProfile["experienceLevel"],
): DraftTemplateStep[] {
  return steps.filter((s) => {
    if (!s.beginnerOnly) return true;
    return experienceLevel === "none";
  });
}
