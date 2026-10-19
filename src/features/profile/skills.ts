import { type Profile, SKILL_LEVELS, type SkillLevel } from '../../../shared/content.ts';

export interface SkillEntry {
  name: string;
  level: SkillLevel;
  category: string;
}

export interface SkillFilter {
  level: SkillLevel | 'all';
  /** null means any category. */
  category: string | null;
  query: string;
}

export const ALL_SKILLS: SkillFilter = { level: 'all', category: null, query: '' };

export function flattenSkills(skills: Profile['skills']): SkillEntry[] {
  return SKILL_LEVELS.flatMap((level) =>
    Object.entries(skills[level]).flatMap(([category, names]) =>
      Array.isArray(names) ? names.map((name) => ({ name, level, category })) : [],
    ),
  );
}

const matchesQuery = (skill: SkillEntry, query: string) =>
  skill.name.toLowerCase().includes(query.trim().toLowerCase());

export function filterSkills(skills: SkillEntry[], filter: SkillFilter): SkillEntry[] {
  return skills.filter(
    (s) =>
      (filter.level === 'all' || s.level === filter.level) &&
      (filter.category === null || s.category === filter.category) &&
      matchesQuery(s, filter.query),
  );
}

/** Counts per level for the current category and search, so each level chip shows what it would add. */
export function countByLevel(
  skills: SkillEntry[],
  filter: SkillFilter,
): Record<SkillLevel, number> {
  const counts: Record<SkillLevel, number> = { expert: 0, proficient: 0, familiar: 0 };
  for (const skill of filterSkills(skills, { ...filter, level: 'all' })) counts[skill.level]++;
  return counts;
}

/** Counts per category for the current level and search. */
export function countByCategory(skills: SkillEntry[], filter: SkillFilter): Map<string, number> {
  const counts = new Map<string, number>();
  for (const skill of filterSkills(skills, { ...filter, category: null })) {
    counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1);
  }
  return counts;
}

export function categoryTotals(skills: SkillEntry[]): Map<string, number> {
  return countByCategory(skills, ALL_SKILLS);
}

export function categories(skills: SkillEntry[]): string[] {
  return [...new Set(skills.map((s) => s.category))].toSorted();
}

export interface Certification {
  name: string;
  inProgress: boolean;
  credentialId: string | null;
  verifyUrl: string | null;
}

const IN_PROGRESS_SUFFIX = ' (In Progress)';

/** Certifications grouped by area. The in-progress list duplicates other groups and is skipped. */
export function certificationGroups(
  profile: Pick<Profile, 'certifications' | 'certificationDetails'>,
) {
  return Object.entries(profile.certifications)
    .filter(([group]) => group !== 'inProgress')
    .map(([group, names]) => ({
      group,
      certifications: names.map((raw): Certification => {
        const details = profile.certificationDetails[raw];
        return {
          name: raw.replace(IN_PROGRESS_SUFFIX, ''),
          inProgress: details?.inProgress ?? raw.endsWith(IN_PROGRESS_SUFFIX),
          credentialId: details?.credentialId ?? null,
          verifyUrl: details?.verifyUrl ?? null,
        };
      }),
    }));
}
