import Link from "next/link";
import { ExternalLink, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { getProfileForViewer } from "./actions";
import { CAREER_BY_ID } from "@/lib/career-path/careers";
import {
  ageRangeLabel,
  audienceSegmentLabel,
  careerPathLabel,
  challengeLabel,
  communityLabels,
  contentLangLabel,
  educationLabel,
  experienceLabel,
  languageLabels,
  learningStyleLabel,
  nonStudentSituationLabel,
  primaryBarrierLabel,
  studentFieldInterestLabel,
  studentPrimaryGoalLabel,
  yearlyGoalLabel,
  yesNo,
} from "@/lib/profile/display-labels";
import { profileAccentForUserId } from "@/lib/profile/profile-accent";

function Section({
  title,
  titleClassName,
  children,
}: {
  title: string;
  titleClassName: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2
        className={`text-sm font-semibold uppercase tracking-wide ${titleClassName}`}
      >
        {title}
      </h2>
      <dl className="mt-4 space-y-3 text-sm">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-900">{value ?? "—"}</dd>
    </div>
  );
}

function LinkRow({
  label,
  href,
  linkClassName,
}: {
  label: string;
  href: string | null;
  linkClassName: string;
}) {
  if (!href?.trim()) {
    return <Row label={label} value="—" />;
  }
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 font-medium ${linkClassName}`}
        >
          {href}
          <ExternalLink className="size-3.5 shrink-0" aria-hidden />
        </a>
      </dd>
    </div>
  );
}

export default async function ProfilePage() {
  const data = await getProfileForViewer();
  if (!data) {
    redirect("/signin?callbackUrl=" + encodeURIComponent("/profile"));
  }

  const p = data.profile;
  const accent = profileAccentForUserId(data.userId);

  return (
    <main className="min-h-full px-4 py-8 text-slate-900 [color-scheme:light] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6">
          <div className="flex min-w-0 items-start gap-4">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- OAuth URLs vary
              <img
                src={data.image}
                alt=""
                width={64}
                height={64}
                className={`size-16 rounded-full object-cover ring-2 ${accent.avatarRing}`}
              />
            ) : (
              <div
                className={`flex size-16 items-center justify-center rounded-full ${accent.avatarSoft}`}
              >
                <UserRound className="size-8" strokeWidth={1.5} />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {data.name ?? "Your profile"}
              </h1>
              <p className="mt-0.5 text-sm text-slate-600">{data.email}</p>
            </div>
          </div>
        </header>

        {!p ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
            No profile record yet.{" "}
            <Link href="/onboarding" className={`font-semibold ${accent.link}`}>
              Set up your PUENTE profile
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-6">
            {p.audienceSegment || p.sixMonthGoal ? (
              <Section title="Your path" titleClassName={accent.sectionTitle}>
                <Row
                  label="Profile type"
                  value={audienceSegmentLabel(p.audienceSegment)}
                />
                <Row label="Next 6 months" value={p.sixMonthGoal} />
                {p.audienceSegment === "student" ? (
                  <>
                    <Row
                      label="Field interest"
                      value={studentFieldInterestLabel(
                        p.studentFieldInterest,
                      )}
                    />
                    <Row
                      label="Primary focus"
                      value={studentPrimaryGoalLabel(p.studentPrimaryGoal)}
                    />
                  </>
                ) : null}
                {p.audienceSegment === "non_student" ? (
                  <>
                    <Row
                      label="Age range"
                      value={ageRangeLabel(p.ageRange)}
                    />
                    <Row
                      label="Current situation"
                      value={nonStudentSituationLabel(p.nonStudentSituation)}
                    />
                    <Row
                      label="College degree"
                      value={yesNo(p.hasCollegeDegree)}
                    />
                    <Row
                      label="Career goal (your words)"
                      value={p.careerIntentText}
                    />
                    <Row
                      label="Target careers"
                      value={
                        p.targetCareerSlugs.length
                          ? p.targetCareerSlugs
                              .map((id) => CAREER_BY_ID[id]?.label ?? id)
                              .join(", ")
                          : null
                      }
                    />
                    <Row
                      label="Biggest challenge"
                      value={primaryBarrierLabel(p.primaryBarrier)}
                    />
                  </>
                ) : null}
              </Section>
            ) : null}

            <Section title="Education" titleClassName={accent.sectionTitle}>
              <Row label="School" value={p.school} />
              <Row
                label="Education level"
                value={educationLabel(p.education)}
              />
              <Row label="Major / field" value={p.major} />
              <Row label="Graduation year" value={p.gradYear} />
            </Section>

            <Section title="Background" titleClassName={accent.sectionTitle}>
              <Row
                label="Languages"
                value={
                  p.languages.length
                    ? languageLabels(p.languages)
                    : null
                }
              />
              <Row label="First-gen student" value={yesNo(p.firstGen)} />
              <Row
                label="International or DACA"
                value={yesNo(p.internationalOrDaca)}
              />
            </Section>

            <Section
              title="Goals & interests"
              titleClassName={accent.sectionTitle}
            >
              <Row
                label="Career path"
                value={careerPathLabel(p.careerPath)}
              />
              <Row
                label="Interests"
                value={
                  p.interests.length ? p.interests.join(", ") : null
                }
              />
              <Row
                label="Biggest challenge"
                value={challengeLabel(p.challenges)}
              />
              <Row
                label="Goal this year"
                value={yearlyGoalLabel(p.yearlyGoal)}
              />
              <Row
                label="Experience level"
                value={experienceLabel(p.experienceLevel)}
              />
              <Row
                label="Community interests"
                value={
                  p.communityPrefs.length
                    ? communityLabels(p.communityPrefs)
                    : null
                }
              />
            </Section>

            <Section
              title="Scholarships & location"
              titleClassName={accent.sectionTitle}
            >
              <Row
                label="Receiving scholarships"
                value={yesNo(p.receivingScholarships)}
              />
              <Row
                label="Scholarship names"
                value={p.scholarshipDetails}
              />
              <Row
                label="Looking for scholarships"
                value={yesNo(p.seekingScholarships)}
              />
              <Row label="Location" value={p.location} />
            </Section>

            <Section title="Links" titleClassName={accent.sectionTitle}>
              <LinkRow
                label="LinkedIn"
                href={p.linkedin}
                linkClassName={accent.link}
              />
              <LinkRow
                label="GitHub"
                href={p.github}
                linkClassName={accent.link}
              />
              <LinkRow
                label="Portfolio"
                href={p.portfolio}
                linkClassName={accent.link}
              />
            </Section>

            <Section
              title="Learning preferences"
              titleClassName={accent.sectionTitle}
            >
              <Row
                label="Learning style"
                value={learningStyleLabel(p.learningStyle)}
              />
              <Row
                label="Preferred content language"
                value={contentLangLabel(p.preferredContentLang)}
              />
            </Section>

            {p.bio ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2
                  className={`text-sm font-semibold uppercase tracking-wide ${accent.sectionTitle}`}
                >
                  Bio
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm text-slate-800">
                  {p.bio}
                </p>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
