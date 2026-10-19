import { describe, expect, it } from 'vitest';
import type { Profile } from '../../../shared/content.ts';
import {
  ALL_PROJECTS,
  countByType,
  filterProjects,
  flattenProjects,
  projectStats,
  techOptions,
} from './projects.ts';

const project = (
  name: string,
  technologies: string[],
  extra: Partial<Profile['projects']['opensource'][string]> = {},
) => ({
  name,
  description: `${name} description`,
  technologies,
  image: `/images/${name}.png`,
  ...extra,
});

const projects = flattenProjects({
  opensource: { a: project('A', ['React', 'Node.js'], { github: 'https://github.com/x/a' }) },
  enterprise: { b: project('B', ['React'], { current: true, caseStudy: '/casestudies/b' }) },
  freelance: { c: project('C', ['Vue'], { url: 'https://c.example' }) },
  leadership: { d: project('D', []) },
});

describe('projects', () => {
  it('flattens in display order with stable ids', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'opensource-a',
      'enterprise-b',
      'freelance-c',
      'leadership-d',
    ]);
  });

  it('puts current work first without reordering the source list', () => {
    expect(filterProjects(projects, ALL_PROJECTS).map((p) => p.name)).toEqual(['B', 'A', 'C', 'D']);
    expect(projects.map((p) => p.name)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('filters by type, technology and current focus', () => {
    expect(
      filterProjects(projects, { ...ALL_PROJECTS, type: 'freelance' }).map((p) => p.name),
    ).toEqual(['C']);
    expect(filterProjects(projects, { ...ALL_PROJECTS, tech: 'React' }).map((p) => p.name)).toEqual(
      ['B', 'A'],
    );
    expect(
      filterProjects(projects, { ...ALL_PROJECTS, type: 'freelance', currentOnly: true }).map(
        (p) => p.name,
      ),
    ).toEqual(['B']);
  });

  it('counts types for the chosen technology', () => {
    expect(countByType(projects, 'React')).toEqual({
      opensource: 1,
      enterprise: 1,
      freelance: 0,
      leadership: 0,
    });
  });

  it('lists technologies by use, then name', () => {
    expect(techOptions(projects, 'all')).toEqual([
      { tech: 'React', count: 2 },
      { tech: 'Node.js', count: 1 },
      { tech: 'Vue', count: 1 },
    ]);
    expect(techOptions(projects, 'freelance')).toEqual([{ tech: 'Vue', count: 1 }]);
  });

  it('summarises the portfolio', () => {
    expect(projectStats(projects)).toEqual({
      total: 4,
      withSource: 1,
      live: 1,
      caseStudies: 1,
      current: 1,
    });
  });
});
