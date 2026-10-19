import {
  type Profile,
  type Project,
  PROJECT_TYPES,
  type ProjectType,
} from '../../../shared/content.ts';

export interface ProjectEntry extends Project {
  id: string;
  type: ProjectType;
}

export interface ProjectFilter {
  type: ProjectType | 'all';
  /** null means any technology. */
  tech: string | null;
  currentOnly: boolean;
}

export const ALL_PROJECTS: ProjectFilter = { type: 'all', tech: null, currentOnly: false };

/** Every project in display order: open source first, then enterprise, freelance, leadership. */
export function flattenProjects(projects: Profile['projects']): ProjectEntry[] {
  return PROJECT_TYPES.flatMap((type) =>
    Object.entries(projects[type]).map(([key, project]) => ({
      ...project,
      id: `${type}-${key}`,
      type,
    })),
  );
}

const usesTech = (project: ProjectEntry, tech: string | null) =>
  tech === null || project.technologies.includes(tech);

/** Projects matching the filter, current work first, otherwise in display order. */
export function filterProjects(projects: ProjectEntry[], filter: ProjectFilter): ProjectEntry[] {
  return projects
    .filter((p) =>
      filter.currentOnly ? p.current === true : filter.type === 'all' || p.type === filter.type,
    )
    .filter((p) => usesTech(p, filter.tech))
    .toSorted((a, b) => Number(Boolean(b.current)) - Number(Boolean(a.current)));
}

/** How many projects of each type use the selected technology. */
export function countByType(
  projects: ProjectEntry[],
  tech: string | null,
): Record<ProjectType, number> {
  const counts: Record<ProjectType, number> = {
    opensource: 0,
    enterprise: 0,
    freelance: 0,
    leadership: 0,
  };
  for (const project of projects) if (usesTech(project, tech)) counts[project.type]++;
  return counts;
}

export interface TechOption {
  tech: string;
  count: number;
}

/** Technologies used by projects of the selected type, most used first. */
export function techOptions(projects: ProjectEntry[], type: ProjectType | 'all'): TechOption[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    if (type !== 'all' && project.type !== type) continue;
    for (const tech of project.technologies) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return [...counts]
    .map(([tech, count]) => ({ tech, count }))
    .toSorted((a, b) => b.count - a.count || a.tech.localeCompare(b.tech));
}

export function projectStats(projects: ProjectEntry[]) {
  return {
    total: projects.length,
    withSource: projects.filter((p) => p.github).length,
    live: projects.filter((p) => p.url).length,
    caseStudies: projects.filter((p) => p.caseStudy).length,
    current: projects.filter((p) => p.current).length,
  };
}
