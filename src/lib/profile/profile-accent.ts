/** Stable accent colors per user id — keeps teal in the set, adds variety for profiles / directory. */

export type ProfileAccent = {
  sectionTitle: string;
  link: string;
  avatarSoft: string;
  avatarRing: string;
  directoryInitials: string;
};

const ACCENTS: ProfileAccent[] = [
  {
    sectionTitle: "text-teal-800",
    link: "text-teal-700 hover:text-teal-800",
    avatarSoft: "bg-teal-100 text-teal-800",
    avatarRing: "ring-teal-200",
    directoryInitials: "bg-teal-600 text-white",
  },
  {
    sectionTitle: "text-sky-800",
    link: "text-sky-700 hover:text-sky-800",
    avatarSoft: "bg-sky-100 text-sky-800",
    avatarRing: "ring-sky-200",
    directoryInitials: "bg-sky-600 text-white",
  },
  {
    sectionTitle: "text-violet-800",
    link: "text-violet-700 hover:text-violet-800",
    avatarSoft: "bg-violet-100 text-violet-800",
    avatarRing: "ring-violet-200",
    directoryInitials: "bg-violet-600 text-white",
  },
  {
    sectionTitle: "text-amber-800",
    link: "text-amber-700 hover:text-amber-800",
    avatarSoft: "bg-amber-100 text-amber-900",
    avatarRing: "ring-amber-200",
    directoryInitials: "bg-amber-600 text-white",
  },
  {
    sectionTitle: "text-rose-800",
    link: "text-rose-700 hover:text-rose-800",
    avatarSoft: "bg-rose-100 text-rose-800",
    avatarRing: "ring-rose-200",
    directoryInitials: "bg-rose-600 text-white",
  },
  {
    sectionTitle: "text-blue-800",
    link: "text-blue-700 hover:text-blue-800",
    avatarSoft: "bg-blue-100 text-blue-800",
    avatarRing: "ring-blue-200",
    directoryInitials: "bg-blue-600 text-white",
  },
];

function hashUserId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

export function profileAccentForUserId(id: string): ProfileAccent {
  const idx = Math.abs(hashUserId(id)) % ACCENTS.length;
  return ACCENTS[idx]!;
}
