import type { Profile } from '../../content/schema.ts';

export interface SkillFilter {
  /** null means every category. */
  category: string | null;
  query: string;
}

export const ALL_SKILLS: SkillFilter = { category: null, query: '' };

/** The categories with the skills that match the filter, leaving out empty categories. */
export function filterSkills(skills: Profile['skills'], filter: SkillFilter): Profile['skills'] {
  const query = filter.query.trim().toLowerCase();
  return skills
    .filter((group) => filter.category === null || group.category === filter.category)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.toLowerCase().includes(query)),
    }))
    .filter((group) => group.items.length > 0);
}

export const skillCount = (skills: Profile['skills']) =>
  skills.reduce((total, group) => total + group.items.length, 0);
