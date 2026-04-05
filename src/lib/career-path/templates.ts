import type { DraftTemplateStep, FreeResource } from "./types";

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
        "OS basics, networking vocabulary, ticketing mindset, and how to debug calmly under pressure. This is your launchpad — don't skip it.",
      details:
        "Start with Google's IT Support certificate on Coursera (free to audit). Pair it with Professor Messer's free A+ video series on YouTube. Your goal: understand how computers, networks, and tickets connect before you ever touch a job posting.",
      resources: [
        {
          label: "Google IT Support Certificate (Coursera — free audit)",
          url: "https://www.coursera.org/professional-certificates/google-it-support",
          note: "click 'Audit' to access free",
        },
        {
          label: "Professor Messer CompTIA A+ (free YouTube playlist)",
          url: "https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/",
        },
        {
          label: "NetworkChuck — IT fundamentals YouTube",
          url: "https://www.youtube.com/@NetworkChuck",
        },
        {
          label: "r/ITCareerQuestions — community Q&A",
          url: "https://www.reddit.com/r/ITCareerQuestions/",
        },
      ],
      bridgeLabel: "Talk to someone in IT",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "cred",
      title: "Build proof you can troubleshoot",
      description:
        "Document 3 small projects: a home lab, a VM setup, or helping a nonprofit. Turn each into a bullet — what broke, what you checked, how you fixed it. That's your interview ammo.",
      details:
        "Set up VirtualBox (free) with a Linux VM. Use TryHackMe's free intro rooms to practice basic networking and troubleshooting in a guided environment. Screenshot your setups, write a short README for each — this becomes your portfolio.",
      resources: [
        {
          label: "VirtualBox — free VM software",
          url: "https://www.virtualbox.org/",
        },
        {
          label: "TryHackMe — free intro rooms (Pre-Security path)",
          url: "https://tryhackme.com/path/outline/presecurity",
          note: "free tier available",
        },
        {
          label: "TechExams.net — study forums and resources",
          url: "https://www.techexams.net/",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Target helpdesk & IT support roles",
      description:
        "MSPs, internal IT teams, ed-tech companies, and hardware vendors all hire entry-level support regularly. Apply with volume but customize one sentence per company explaining why them.",
      details:
        "Search 'IT Support', 'Help Desk', 'Desktop Support', 'IT Coordinator' on LinkedIn, Indeed, and Glassdoor. Filter for 0–2 years experience. Track every application in a simple spreadsheet: company, date applied, follow-up date. Aim for 5 applications per week minimum.",
      resources: [
        {
          label: "LinkedIn Jobs — IT Support filter",
          url: "https://www.linkedin.com/jobs/search/?keywords=IT%20Support",
        },
        {
          label: "Indeed — Help Desk roles",
          url: "https://www.indeed.com/jobs?q=help+desk+entry+level",
        },
        {
          label: "CompTIA job board",
          url: "https://www.comptia.org/community/it-career-resources",
        },
      ],
      bridgeLabel: "Browse more opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Prep support-style interview scenarios",
      description:
        "Practice customer scenarios, prioritization when everything feels urgent, and how you explain what you learned. Record yourself answering aloud — it changes everything.",
      details:
        "Practice these exact questions: 'Walk me through how you would troubleshoot a computer that won't connect to the internet.' / 'Tell me about a time you fixed something under pressure.' / 'How do you handle a frustrated user?' Use STAR format: Situation, Task, Action, Result.",
      resources: [
        {
          label: "Big Interview — free interview practice",
          url: "https://biginterview.com/",
          note: "free tier available",
        },
        {
          label: "Glassdoor — IT Support interview questions",
          url: "https://www.glassdoor.com/Interview/it-support-interview-questions-SRCH_KO0,10.htm",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Show up where hiring managers are",
      description:
        "Join one community and contribute first — answer a question, share a finding, support someone. Referrals come from relationships, not cold asks.",
      details:
        "The IT community is welcoming to newcomers. Join r/ITCareerQuestions and read the wiki. Attend one free local meetup (Meetup.com, search 'IT' in your city). Connect with 2–3 people on LinkedIn after adding a thoughtful note about something specific they shared. Ask for a 15-minute informational chat, not a job.",
      resources: [
        {
          label: "r/ITCareerQuestions — getting started wiki",
          url: "https://www.reddit.com/r/ITCareerQuestions/wiki/index/",
        },
        {
          label: "Meetup.com — local tech events",
          url: "https://www.meetup.com/topics/tech/",
        },
        {
          label: "LinkedIn — IT professionals to follow",
          url: "https://www.linkedin.com/search/results/people/?keywords=IT+support+manager",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  sales_sdr: [
    {
      key: "mindset",
      title: "Learn the SDR playbook",
      description:
        "Outbound vs inbound, ideal customer profiles, sequences, and how meetings get booked. Spend 30 minutes daily reading — this is a skill you can learn before your first day.",
      details:
        "Start with HubSpot's free Inbound Sales certification. Then study 2–3 cold call recordings on YouTube (search 'cold call breakdown 2024'). Write your own 30-second opener in your natural voice — don't sound like a robot. The best SDRs sound like themselves.",
      resources: [
        {
          label: "HubSpot Inbound Sales Certification (free)",
          url: "https://academy.hubspot.com/courses/inbound-sales",
        },
        {
          label: "30 Minutes to President's Club — cold call episodes",
          url: "https://30mpc.com/",
          note: "free podcast + YouTube",
        },
        {
          label: "RevGenius Slack community — SDR support",
          url: "https://www.revgenius.com/",
          note: "free to join",
        },
        {
          label: "r/sales — ask anything",
          url: "https://www.reddit.com/r/sales/",
        },
      ],
      bridgeLabel: "Talk to someone in sales",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "artifacts",
      title: "Create a small portfolio of sales materials",
      description:
        "Draft 3 email variants, 2 call openers, and a LinkedIn snippet that shows curiosity about one industry. Hiring managers want proof you can communicate clearly.",
      details:
        "Use Hunter.io's free tier to study email patterns. Use Lavender's free plan to score your cold email drafts. Focus your sample materials on one niche (e.g. B2B SaaS for HR teams). Depth beats breadth here — know one segment well, not five vaguely.",
      resources: [
        {
          label: "Hunter.io — email research (free tier)",
          url: "https://hunter.io/",
        },
        {
          label: "Lavender — AI email coaching (free plan)",
          url: "https://www.lavender.ai/",
        },
        {
          label: "HubSpot email templates library",
          url: "https://www.hubspot.com/email-marketing/email-templates",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply with focus and volume",
      description:
        "Pick one niche (e.g. B2B SaaS, fintech, health-tech) for two weeks so your messaging stays sharp. Aim for consistent daily outreach — this is the discipline you'll use every day on the job.",
      details:
        "Use RepVue to research company culture and quota attainment before applying. Search 'SDR', 'BDR', 'Sales Development', 'Business Development Representative' on LinkedIn and Wellfound. Set a daily application goal of 3–5 per day with at least one personalized first line per email. Track everything in a sheet.",
      resources: [
        {
          label: "RepVue — sales culture & quota data",
          url: "https://www.repvue.com/",
          note: "free to browse",
        },
        {
          label: "Wellfound — startup SDR roles",
          url: "https://wellfound.com/jobs",
        },
        {
          label: "LinkedIn Jobs — SDR / BDR roles",
          url: "https://www.linkedin.com/jobs/search/?keywords=SDR%20entry%20level",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Run mock discovery calls",
      description:
        "Practice asking questions, handling objections, and closing for a next step — not pitching features. Sales interviews are performances; practice makes them natural.",
      details:
        "Pair with a friend: 15 minutes they play a skeptical buyer, you run discovery. Then swap feedback. Focus on: asking open-ended questions, staying curious, and getting comfortable with silence after asking something. Objection handling comes second — curiosity comes first.",
      resources: [
        {
          label: "30MPC — objection handling scripts",
          url: "https://30mpc.com/",
        },
        {
          label: "Bravado — sales interview tips community",
          url: "https://www.bravado.co/",
          note: "free to join",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "referrals",
      title: "Earn warm introductions",
      description:
        "Map 10 people who know someone in sales. Contribute value first — share something useful, celebrate their win — then ask for advice. Referrals move applications to the top of the pile.",
      details:
        "Use LinkedIn to find alumni or mutual connections in revenue roles. Send a short, specific message: 'I noticed you transitioned into SaaS sales from [X] — would you share what clicked for you in your first 90 days?' — not 'Can you help me get a job?' Gratitude and specificity get replies.",
      resources: [
        {
          label: "RevGenius — revenue community Slack",
          url: "https://www.revgenius.com/",
        },
        {
          label: "LinkedIn Sales Insights blog",
          url: "https://www.linkedin.com/business/sales/blog/",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  recruiting: [
    {
      key: "basics",
      title: "Understand full-cycle recruiting vs sourcing",
      description:
        "Learn the stages: intake, sourcing, screening, interview coordination, offer. Decide which side excites you most — both are valid entry points.",
      details:
        "Read AIRS free sourcing tutorials to understand boolean search and candidate pipeline basics. Follow the Recruiting Brainfood newsletter — it's free and respected in the industry. Watch 3 episodes of the People Over Perks YouTube show to hear from real practitioners.",
      resources: [
        {
          label: "Recruiting Brainfood newsletter (free)",
          url: "https://recruitingbrainfood.com/",
        },
        {
          label: "People Over Perks — recruiting YouTube channel",
          url: "https://www.youtube.com/@PeopleOverPerks",
        },
        {
          label: "SourceCon — sourcing guides and articles",
          url: "https://www.sourcecon.com/",
          note: "free to read",
        },
        {
          label: "r/recruiting — community Q&A",
          url: "https://www.reddit.com/r/recruiting/",
        },
      ],
      bridgeLabel: "Talk to someone in HR or recruiting",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "tools",
      title: "Get comfortable with tools and compliance basics",
      description:
        "ATS concepts, boolean search, scheduling, and keeping candidate experience respectful. You don't need to be certified — you need to demonstrate you understand the workflow.",
      details:
        "Learn boolean search fundamentals: AND, OR, NOT, quotes, parentheses. Practice on LinkedIn's basic search (free). Study one ATS walkthrough on YouTube (Greenhouse or Lever demos are on their channels). Read a short primer on EEOC basics — knowing compliance shows maturity.",
      resources: [
        {
          label: "Google — Boolean search cheat sheet",
          url: "https://support.google.com/websearch/answer/2466433",
        },
        {
          label: "Greenhouse ATS overview (free YouTube)",
          url: "https://www.youtube.com/results?search_query=greenhouse+ats+tutorial",
        },
        {
          label: "SHRM — free HR and compliance resources",
          url: "https://www.shrm.org/",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Target coordinator and sourcer roles",
      description:
        "Agencies and high-growth startups often hire coordinators without prior recruiting experience. Emphasize organization, communication, and any customer-facing background.",
      details:
        "Search: 'Recruiting Coordinator', 'Sourcer', 'Talent Acquisition Coordinator', 'HR Coordinator'. Staffing agencies (Robert Half, Insight Global) are great for breaking in. Startups on Wellfound often need first-time recruiters. Customize your resume to emphasize: scheduling, stakeholder comms, follow-through.",
      resources: [
        {
          label: "LinkedIn Jobs — Recruiting Coordinator",
          url: "https://www.linkedin.com/jobs/search/?keywords=recruiting%20coordinator",
        },
        {
          label: "Wellfound — HR & talent roles at startups",
          url: "https://wellfound.com/jobs?role=hr",
        },
        {
          label: "Indeed — Talent Acquisition entry level",
          url: "https://www.indeed.com/jobs?q=talent+acquisition+coordinator+entry+level",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "stories",
      title: "Prep behavioral stories for interviews",
      description:
        "Recruiting interviews are heavy on judgment and communication. Prepare stories about: handling competing priorities, protecting candidate dignity under pressure, and navigating a challenging stakeholder.",
      details:
        "Use the STAR format: Situation, Task, Action, Result. Prepare 5 stories that can flex to fit different questions. One conflict story, one organizational story, one 'above and beyond' story, one failure-and-recovery story, one 'working with a difficult person' story. Practice aloud — not just in your head.",
      resources: [
        {
          label: "Big Interview — free STAR method practice",
          url: "https://biginterview.com/",
          note: "free tier available",
        },
        {
          label: "Glassdoor — Recruiting Coordinator interview questions",
          url: "https://www.glassdoor.com/Interview/recruiting-coordinator-interview-questions-SRCH_KO0,22.htm",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "community",
      title: "Join talent communities",
      description:
        "The recruiting world is small and relationship-driven. Follow 2–3 practitioners, comment thoughtfully on their posts, and send one specific ask per week maximum.",
      details:
        "Join the People Over Perks Discord (free). Follow recruiting practitioners on LinkedIn — comment with substance, not just 'great post!' Join r/recruiting and contribute answers to beginner questions. This builds your reputation over time and keeps you learning from people doing the work.",
      resources: [
        {
          label: "People Over Perks Discord (free)",
          url: "https://www.peopleoverperks.com/",
        },
        {
          label: "r/recruiting — active community",
          url: "https://www.reddit.com/r/recruiting/",
        },
        {
          label: "LinkedIn Talent Blog — industry thinking",
          url: "https://www.linkedin.com/business/talent/blog",
          note: "free to read",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  digital_marketing: [
    {
      key: "channel",
      title: "Pick one channel and go deep",
      description:
        "SEO, paid social, lifecycle email, or content — being shallow on five channels reads junior. Depth on one wins. You can expand after you land.",
      details:
        "Start with Google Digital Garage for a free digital marketing certificate. Then pick one channel to specialize in: HubSpot Academy for content/email (free certs), Meta Blueprint for paid social (free), Google Analytics Academy for measurement (free). Spend one week auditing a real brand's funnel in your chosen channel and write 5 insights.",
      resources: [
        {
          label: "Google Digital Garage — free marketing certificate",
          url: "https://learndigital.withgoogle.com/digitalgarage/",
        },
        {
          label: "HubSpot Academy — content, email, inbound (all free)",
          url: "https://academy.hubspot.com/",
        },
        {
          label: "Meta Blueprint — paid social fundamentals (free)",
          url: "https://www.facebook.com/business/learn",
        },
        {
          label: "Google Analytics Academy (free)",
          url: "https://analytics.google.com/analytics/academy/",
        },
        {
          label: "Ahrefs Academy — SEO fundamentals (free)",
          url: "https://ahrefs.com/academy",
        },
      ],
      bridgeLabel: "Talk to someone in marketing",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "proof",
      title: "Publish proof of work",
      description:
        "A 1-page case study, a small campaign write-up, or a growth experiment with metrics. Even hypothetical work with honest constraints beats an empty portfolio.",
      details:
        "Use Canva (free) to make it visual. Use Google Analytics' demo account to practice pulling real data without needing a client. Run a small $5 Instagram or Google ad experiment if possible — even small results show you understand the loop: hypothesis → spend → measure → iterate.",
      resources: [
        {
          label: "Canva — free design for case studies",
          url: "https://www.canva.com/",
        },
        {
          label: "Google Analytics Demo Account (free access)",
          url: "https://support.google.com/analytics/answer/6367342",
        },
        {
          label: "Neil Patel blog — marketing case studies",
          url: "https://neilpatel.com/blog/",
          note: "free",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply to growth and marketing associate roles",
      description:
        "Startups and agencies value execution — show you can ship, measure, and iterate. Tailor your bullets to their specific stack when you have any exposure.",
      details:
        "Search: 'Marketing Coordinator', 'Growth Associate', 'Digital Marketing Specialist', 'Content Marketing'. Mention specific tools in your resume (HubSpot, GA4, Meta Ads Manager, Mailchimp) when you've touched them. Agencies are the fastest way to build breadth — consider them as a launching pad.",
      resources: [
        {
          label: "LinkedIn Jobs — Digital Marketing entry level",
          url: "https://www.linkedin.com/jobs/search/?keywords=digital%20marketing%20coordinator",
        },
        {
          label: "MarketingHire — marketing-specific job board",
          url: "https://www.marketinghire.com/",
        },
        {
          label: "Indeed — Marketing Coordinator",
          url: "https://www.indeed.com/jobs?q=marketing+coordinator+entry+level",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Practice marketing interviews",
      description:
        "Metric trade-offs, campaign retros, and how you'd prioritize a backlog of ideas. Marketing interviews often include a take-home assignment — treat it as a portfolio piece.",
      details:
        "Prepare for: 'Walk me through how you'd launch a campaign with a $500 budget.' / 'How do you decide what to measure?' / 'Tell me about a campaign you ran — what worked and what didn't?' Listen to the Marketing Against the Grain podcast for perspective on how senior marketers think.",
      resources: [
        {
          label: "Marketing Against the Grain podcast (free)",
          url: "https://www.hubspot.com/podcasts/marketing-against-the-grain",
        },
        {
          label: "Glassdoor — Marketing interview questions",
          url: "https://www.glassdoor.com/Interview/marketing-coordinator-interview-questions-SRCH_KO0,21.htm",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Find peers who are hiring or just hired",
      description:
        "Warm intros beat cold applications 10 to 1. Use community to learn who's hiring before roles post. Offer value before asking for anything.",
      details:
        "Join Exit Five — a marketing community with a free tier. Join r/marketing and contribute. Follow 3–5 marketing directors you admire on LinkedIn and comment thoughtfully on their posts (specific observations, not generic). When you DM someone, lead with something specific about their work, not your job search.",
      resources: [
        {
          label: "Exit Five — marketing community (free tier)",
          url: "https://exitfive.com/",
        },
        {
          label: "r/marketing — community Q&A",
          url: "https://www.reddit.com/r/marketing/",
        },
        {
          label: "Traffic Think Tank — SEO community (free resources)",
          url: "https://trafficthinktank.com/",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  project_coordinator: [
    {
      key: "basics",
      title: "Learn project management fundamentals",
      description:
        "RACI, RAID logs, status reports, risk flags, and stakeholder comms rhythms. You don't need a certification yet — but you do need the vocabulary and the mindset.",
      details:
        "Start with Google's free Project Management Certificate on Coursera (audit for free). Then read PMI's free online resources to understand the methodology landscape. Pick one: Agile vs Waterfall. Know when each fits — not just the buzzwords, but the tradeoffs.",
      resources: [
        {
          label: "Google Project Management Certificate (Coursera — free audit)",
          url: "https://www.coursera.org/professional-certificates/google-project-management",
          note: "click 'Audit' for free access",
        },
        {
          label: "PMI free learning resources",
          url: "https://www.pmi.org/learning/library",
        },
        {
          label: "Asana Academy — project management basics (free)",
          url: "https://academy.asana.com/",
        },
        {
          label: "David McLachlan — project management YouTube",
          url: "https://www.youtube.com/@DavidMcLachlan1",
        },
      ],
      bridgeLabel: "Talk to someone in project management",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "proof",
      title: "Show you can coordinate complexity",
      description:
        "Volunteer to run logistics for an event, student org, or nonprofit project and document outcomes. Quantify everything: attendees, vendors, deadlines hit, budget adherence.",
      details:
        "Use Notion or Trello (both free) to build a sample project plan for something real in your life — even planning a trip or an event. Screenshot it, write a 3-bullet summary of what you managed, what went wrong, how you fixed it. This becomes your portfolio and your interview story.",
      resources: [
        {
          label: "Notion — free project management templates",
          url: "https://www.notion.so/templates/category/project-management",
        },
        {
          label: "Trello — free visual project boards",
          url: "https://trello.com/",
        },
        {
          label: "VolunteerMatch — find PM volunteer opportunities",
          url: "https://www.volunteermatch.org/",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Target coordinator and program assistant roles",
      description:
        "Construction tech, health ops, and implementation teams hire coordinators steadily. Keywords matter — use the right ones to get past ATS filters.",
      details:
        "Search: 'Project Coordinator', 'Program Assistant', 'PMO Analyst', 'Operations Coordinator', 'Implementation Specialist'. Implementation roles at SaaS companies are a great entry point — they hire coordinators to onboard clients. Emphasize organization, clear communication, and follow-through in your resume bullets.",
      resources: [
        {
          label: "LinkedIn Jobs — Project Coordinator entry level",
          url: "https://www.linkedin.com/jobs/search/?keywords=project%20coordinator%20entry%20level",
        },
        {
          label: "PMI career resources and job board",
          url: "https://www.pmi.org/careers",
        },
        {
          label: "Indeed — Program Coordinator",
          url: "https://www.indeed.com/jobs?q=program+coordinator+entry+level",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Prep coordination scenarios",
      description:
        "Late deliverables, conflicting executive requests, and ambiguous scope — interviewers want to see calm process, not panic. STAR stories from any context work here.",
      details:
        "Prepare stories for: 'Tell me about a time a project went off track.' / 'How do you manage competing priorities from multiple stakeholders?' / 'Describe how you keep a team aligned when requirements keep changing.' Draw from school, volunteer work, or any job — the setting doesn't matter, the skill does.",
      resources: [
        {
          label: "ProjectManager.com blog — PM interview prep (free)",
          url: "https://www.projectmanager.com/blog",
        },
        {
          label: "Big Interview — behavioral interview practice (free tier)",
          url: "https://biginterview.com/",
        },
        {
          label: "Glassdoor — Project Coordinator interview questions",
          url: "https://www.glassdoor.com/Interview/project-coordinator-interview-questions-SRCH_KO0,19.htm",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Meet people who run projects",
      description:
        "Ask how they track work and what they wish coordinators did more of on day one. These conversations teach you more than any course.",
      details:
        "Join r/projectmanagement and contribute — answer beginner questions, share resources. Look for local PMI chapter events (many are free for non-members). Connect with PMs at companies you admire on LinkedIn with a specific question about their transition into the field.",
      resources: [
        {
          label: "r/projectmanagement — community discussions",
          url: "https://www.reddit.com/r/projectmanagement/",
        },
        {
          label: "PMI local chapters — find yours",
          url: "https://www.pmi.org/chapters",
          note: "many events open to non-members",
        },
        {
          label: "Agile Alliance — free resources and events",
          url: "https://www.agilealliance.org/",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  data_analyst: [
    {
      key: "stack",
      title: "Lock in your core stack",
      description:
        "SQL + spreadsheets + one visualization tool. Complete one full dataset story: question → query → chart → written insight. This is what analysts actually do every day.",
      details:
        "Start with freeCodeCamp's SQL for Data Science course (free). Practice on Mode's free SQL tutorial with real-world datasets. For visualization, start with Tableau Public (free) or Google Sheets — both are used in real jobs. Your first goal: answer a real question with data and explain it in 3 sentences.",
      resources: [
        {
          label: "freeCodeCamp Data Analysis with Python (free)",
          url: "https://www.freecodecamp.org/learn/data-analysis-with-python/",
        },
        {
          label: "Mode Analytics SQL Tutorial (free, real data)",
          url: "https://mode.com/sql-tutorial/",
        },
        {
          label: "Kaggle Learn — free micro-courses: SQL, pandas, visualization",
          url: "https://www.kaggle.com/learn",
        },
        {
          label: "Google Data Analytics Certificate (Coursera — free audit)",
          url: "https://www.coursera.org/professional-certificates/google-data-analytics",
          note: "click 'Audit' for free",
        },
        {
          label: "Alex the Analyst — YouTube tutorials",
          url: "https://www.youtube.com/@AlexTheAnalyst",
        },
      ],
      bridgeLabel: "Talk to someone in data",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "portfolio",
      title: "Ship a public portfolio project",
      description:
        "Choose a public dataset, form a clear hypothesis, document your cleaning process and assumptions, and surface 3 actionable insights. Make it impossible for a recruiter to misunderstand in 30 seconds.",
      details:
        "Use Kaggle datasets (free) or download CSV data from data.gov. Host your project on GitHub Pages or Notion with screenshots. Write a short README: what question you asked, how you answered it, and what you'd do differently. Honest limitations show analytical maturity.",
      resources: [
        {
          label: "Kaggle public datasets (free, thousands available)",
          url: "https://www.kaggle.com/datasets",
        },
        {
          label: "Tableau Public — free hosting for visualizations",
          url: "https://public.tableau.com/",
        },
        {
          label: "GitHub Pages — free portfolio hosting",
          url: "https://pages.github.com/",
        },
        {
          label: "data.gov — free US government datasets",
          url: "https://data.gov/",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply to analyst and BI roles",
      description:
        "Include any metric you moved — even in class projects — and list your specific tools in every bullet. Vague bullets lose; specific numbers win.",
      details:
        "Search: 'Data Analyst', 'Business Analyst', 'BI Analyst', 'Revenue Ops Analyst', 'Analytics Engineer'. Healthcare, retail, and fintech hire analysts at scale. Include tools explicitly: SQL, Python, Excel, Tableau, Looker, Power BI, GA4. Each company's job post tells you exactly what to name.",
      resources: [
        {
          label: "LinkedIn Jobs — Data Analyst entry level",
          url: "https://www.linkedin.com/jobs/search/?keywords=data%20analyst%20entry%20level",
        },
        {
          label: "DataJobs.com — data-specific job board",
          url: "https://www.datajobs.com/",
        },
        {
          label: "Indeed — Business Analyst entry level",
          url: "https://www.indeed.com/jobs?q=business+analyst+entry+level",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Practice SQL and case framing",
      description:
        "Walk through: how you'd measure success, how you'd define a metric, and how you'd debug a surprising drop in a number. Think out loud — interviewers want your process, not just your answer.",
      details:
        "Practice on StrataScratch and DataLemur (both free) for SQL interview questions used at real companies. For case-style questions, practice explaining your reasoning step by step: 'First I'd verify the data isn't broken, then I'd check for seasonality, then I'd segment by...' This is the skill that gets you hired.",
      resources: [
        {
          label: "StrataScratch — real SQL interview questions (free tier)",
          url: "https://www.stratascratch.com/",
        },
        {
          label: "DataLemur — SQL interview prep (free)",
          url: "https://datalemur.com/",
        },
        {
          label: "W3Schools SQL — quick reference (free)",
          url: "https://www.w3schools.com/sql/",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Find analysts in communities you can contribute to",
      description:
        "Ask how they got in and what their hiring manager cared about most. Data communities are helpful — ask small questions, share what you learn.",
      details:
        "Join the dbt Community Slack (free, very active). Join r/dataanalysis and r/SQL. Follow practitioners on LinkedIn who post their analyses — comment with specific observations. Locally Optimistic Slack is great for data analysts at scale-ups.",
      resources: [
        {
          label: "dbt Community Slack (free, very active)",
          url: "https://www.getdbt.com/community/join-the-community",
        },
        {
          label: "r/dataanalysis — community discussions",
          url: "https://www.reddit.com/r/dataanalysis/",
        },
        {
          label: "Locally Optimistic Slack — data practitioners",
          url: "https://locallyoptimistic.com/community/",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  web_development: [
    {
      key: "foundations",
      title: "Solidify your web fundamentals",
      description:
        "HTML, CSS, JavaScript, HTTP, the DOM, Git, and one framework. The trap is watching too many tutorials. Build something ugly and deployed — that beats polished and local every time.",
      details:
        "Start with The Odin Project or freeCodeCamp — both are completely free and structured. CS50 from Harvard (free on edX) is excellent for computer science foundations alongside web skills. Pick one: React, Vue, or Svelte for your framework. Most jobs want React, so if unsure, start there.",
      resources: [
        {
          label: "The Odin Project (100% free, project-based)",
          url: "https://www.theodinproject.com/",
        },
        {
          label: "freeCodeCamp — Responsive Web Design + JS Algorithms (free)",
          url: "https://www.freecodecamp.org/",
        },
        {
          label: "CS50 Harvard — free on edX",
          url: "https://cs50.harvard.edu/x/",
        },
        {
          label: "MDN Web Docs — the official reference (free)",
          url: "https://developer.mozilla.org/en-US/",
        },
        {
          label: "Kevin Powell — CSS mastery YouTube",
          url: "https://www.youtube.com/@KevinPowell",
        },
        {
          label: "Traversy Media — practical web dev tutorials",
          url: "https://www.youtube.com/@TraversyMedia",
        },
      ],
      bridgeLabel: "Talk to a developer",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "portfolio",
      title: "Ship 2 polished portfolio projects",
      description:
        "One showing UI craft, one showing logic, API integration, or data. Deploy both. Write READMEs that explain your decisions — not just what you built, but why.",
      details:
        "Use Vercel or Netlify (both free) to deploy. Your README matters: cover setup instructions, the problem you solved, tradeoffs you made, and what you'd improve. Recruiters skim — make the first screen of your GitHub repo impossible to misread in 10 seconds. Include screenshots.",
      resources: [
        {
          label: "Vercel — free deployment for web projects",
          url: "https://vercel.com/",
        },
        {
          label: "Netlify — free hosting with CI/CD",
          url: "https://www.netlify.com/",
        },
        {
          label: "GitHub Pages — free static site hosting",
          url: "https://pages.github.com/",
        },
        {
          label: "Frontend Mentor — real design challenges to build",
          url: "https://www.frontendmentor.io/",
          note: "free tier available",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "apply",
      title: "Apply with tailored outreach",
      description:
        "Batch your applications but personalize the first line: product + why their stack or mission interests you. Referrals still move the needle — use the directory thoughtfully.",
      details:
        "Search: 'Junior Developer', 'Frontend Developer', 'Full Stack Developer', 'Software Engineer (new grad)'. Wellfound (AngelList) is excellent for startup roles. Hacker News 'Who's Hiring' posts are posted monthly and have real engineering teams. Track every application — follow up after 7–10 days with one sentence.",
      resources: [
        {
          label: "Wellfound — startup engineering roles",
          url: "https://wellfound.com/jobs",
        },
        {
          label: "Hacker News 'Who Is Hiring' (monthly thread)",
          url: "https://news.ycombinator.com/jobs",
        },
        {
          label: "LinkedIn Jobs — Junior Developer",
          url: "https://www.linkedin.com/jobs/search/?keywords=junior%20developer",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Technical and behavioral interview prep",
      description:
        "Practice explaining past projects, debugging your thinking aloud, and system design at intern or new-grad depth. Do at least one timed mock before your first real loop.",
      details:
        "Use NeetCode (free YouTube + website) for LeetCode-style problems without the overwhelm. Study the most common: arrays, hashmaps, strings, and basic trees. For behavioral: prepare 5 STAR stories. For system design at junior level: understand what a database, API, and caching layer do and why they're separate.",
      resources: [
        {
          label: "NeetCode — structured LeetCode prep (free)",
          url: "https://neetcode.io/",
        },
        {
          label: "LeetCode — free tier practice problems",
          url: "https://leetcode.com/",
          note: "free tier is sufficient for most interviews",
        },
        {
          label: "Frontend Mentor — portfolio + interview practice",
          url: "https://www.frontendmentor.io/",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "community",
      title: "Code with others and get feedback",
      description:
        "Open-source contributions, hack nights, pair sessions, or accountability groups — velocity and feedback compound fast when you're learning in public.",
      details:
        "Join 100Devs Discord (free, very active and beginner-friendly). Contribute to open source via GitHub's 'good first issue' label. Join the freeCodeCamp forum and help beginners — teaching cements your own knowledge. Tweet or LinkedIn-post what you're building weekly, even if small.",
      resources: [
        {
          label: "100Devs Discord — beginner-welcoming community",
          url: "https://100devs.org/",
          note: "free",
        },
        {
          label: "GitHub 'good first issue' — open source contributions",
          url: "https://goodfirstissue.dev/",
        },
        {
          label: "Reactiflux Discord — React community",
          url: "https://www.reactiflux.com/",
        },
        {
          label: "r/webdev — community discussions",
          url: "https://www.reddit.com/r/webdev/",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],

  cybersecurity: [
    {
      key: "path",
      title: "Choose your entry lane",
      description:
        "SOC analyst, GRC (governance, risk, compliance), or IT security support — don't try to learn everything at once. Pick your lane based on what energizes you most.",
      details:
        "Use CyberSeek's free career pathway tool to see the exact roles, skills, and certs along each track. Then write a one-paragraph description of your target role and reverse-engineer 5 real job posts for their shared skill requirements. This focus will save you months of directionless studying.",
      resources: [
        {
          label: "CyberSeek career pathway tool (free, interactive)",
          url: "https://www.cyberseek.org/pathway.html",
        },
        {
          label: "TryHackMe Pre-Security path (free intro)",
          url: "https://tryhackme.com/path/outline/presecurity",
        },
        {
          label: "NIST Cybersecurity Framework overview (free)",
          url: "https://www.nist.gov/cyberframework",
        },
        {
          label: "r/cybersecurity — community for beginners",
          url: "https://www.reddit.com/r/cybersecurity/",
        },
      ],
      bridgeLabel: "Talk to someone in cybersecurity",
      bridgeHref: PH.career,
      beginnerOnly: true,
    },
    {
      key: "skills",
      title: "Build baseline technical literacy through hands-on labs",
      description:
        "Networking, Linux CLI, log analysis, and phishing triage concepts. Hands-on labs beat passive video watching — you learn security by doing.",
      details:
        "TryHackMe's free rooms are the best place to start — they walk you through guided hacking and defense exercises. OverTheWire wargames (free) build Linux and command-line skills through real challenges. PicoCTF (free) is a structured capture-the-flag competition for beginners. Log what you learn — it becomes your portfolio.",
      resources: [
        {
          label: "TryHackMe — guided security labs (free tier)",
          url: "https://tryhackme.com/",
          note: "free rooms available",
        },
        {
          label: "OverTheWire wargames — Linux and command-line (free)",
          url: "https://overthewire.org/wargames/",
        },
        {
          label: "PicoCTF — beginner CTF competitions (free)",
          url: "https://picoctf.org/",
        },
        {
          label: "Cybrary — cybersecurity training (free tier)",
          url: "https://www.cybrary.it/",
        },
      ],
      bridgeLabel: "Get resume feedback",
      bridgeHref: PH.resume,
    },
    {
      key: "creds",
      title: "Plan one credible credential",
      description:
        "Security+, ISC2 CC (free), or blue-team micro-certs — align the credential to your lane. If no degree, credentials plus labs matter more than anything else.",
      details:
        "ISC2 now offers a free Certified in Cybersecurity (CC) exam — this is the best free credential available. For Security+, Professor Messer's free YouTube course is the gold standard. Schedule your exam date before you feel ready — having a date forces focus. Most hiring managers care more about labs and how you explain them than the cert itself.",
      resources: [
        {
          label: "ISC2 Certified in Cybersecurity (CC) — free exam",
          url: "https://www.isc2.org/Certifications/CC",
          note: "completely free through ISC2 program",
        },
        {
          label: "Professor Messer CompTIA Security+ (free YouTube)",
          url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/",
        },
        {
          label: "SANS Cyber Aces — free foundational courses",
          url: "https://www.sans.org/cyberaces/",
        },
      ],
      bridgeLabel: "Browse opportunities",
      bridgeHref: PH.jobs,
    },
    {
      key: "interview",
      title: "Prepare for security interviews",
      description:
        "Explain incidents calmly, show ethical judgment, and practice translating technical concepts for non-technical stakeholders. Security hiring managers test judgment as much as knowledge.",
      details:
        "Practice: 'Walk me through how you'd investigate a suspicious login.' / 'How would you explain phishing to a non-technical executive?' / 'What's your process when you find a vulnerability?' Watch SimplyCyber's free YouTube channel for real career and interview guidance from practitioners.",
      resources: [
        {
          label: "SimplyCyber — career and interview guidance YouTube",
          url: "https://www.youtube.com/@SimplyCyber",
        },
        {
          label: "John Hammond — CTF walkthroughs YouTube",
          url: "https://www.youtube.com/@_JohnHammond",
        },
        {
          label: "Daniel Miessler — security thinking and career (free)",
          url: "https://danielmiessler.com/",
        },
      ],
      bridgeLabel: "Mock interview help",
      bridgeHref: PH.mock,
    },
    {
      key: "network",
      title: "Find security-adjacent peers and mentors",
      description:
        "Communities and mentors help you cut through noise and focus on employable skills. Contribute first — answer beginner questions, share your lab write-ups.",
      details:
        "Black Hills InfoSec Discord is welcoming and active (free). OWASP local chapters often host free events. Follow practitioners on Twitter/X using #infosec and #blueteam. Share your TryHackMe progress or lab write-ups publicly — hiring managers do notice people who learn in public.",
      resources: [
        {
          label: "Black Hills InfoSec Discord (free, beginner-friendly)",
          url: "https://www.blackhillsinfosec.com/",
        },
        {
          label: "OWASP local chapters — free events worldwide",
          url: "https://owasp.org/chapters/",
        },
        {
          label: "NetworkChuck — engaging cybersecurity YouTube",
          url: "https://www.youtube.com/@NetworkChuck",
        },
      ],
      bridgeLabel: "Open directory",
      bridgeHref: PH.dir,
    },
  ],
};

const NO_DEGREE_RESOURCES: FreeResource[] = [
  {
    label: "Google Career Certificates — industry-recognized, no degree needed",
    url: "https://grow.google/certificates/",
  },
  {
    label: "Coursera — how to audit courses for free",
    url: "https://www.coursera.org/articles/coursera-audit",
  },
  {
    label: "edX free courses catalog",
    url: "https://www.edx.org/search?price=Free",
  },
];

const NO_DEGREE_STEP: DraftTemplateStep = {
  key: "no_degree_cred",
  title: "Stack credibility without a 4-year degree",
  description:
    "Your path is totally valid — and plenty of hiring managers care more about what you can do than where you studied. A cert, a shipped project, or a volunteer role with a reference all count.",
  details:
    "Pick one: an industry certificate (Google Career Certs are employer-recognized and free to audit), a portfolio project hosted publicly, or a volunteer project with a reference who can speak to your work. List it on your resume with outcomes and dates. If you're studying now, include an expected completion date.",
  resources: NO_DEGREE_RESOURCES,
  bridgeLabel: "Talk to someone who broke in without a degree",
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
  experienceLevel: "none" | "some" | "experienced",
): DraftTemplateStep[] {
  return steps.filter((s) => {
    if (!s.beginnerOnly) return true;
    return experienceLevel === "none";
  });
}
