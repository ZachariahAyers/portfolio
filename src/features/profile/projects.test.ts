import { describe, expect, it } from 'vitest';
import {
  ALL_PROJECTS,
  countByType,
  filterProjects,
  flattenProjects,
  projectStats,
  techOptions,
} from './projects.ts';

const project = (name: string, technologies: string[], extra = {}) => ({
  name,
  description: `${name} description`,
  technologies,
  ...extra,
});

const projects = flattenProjects({
  products: { a: project('A', ['React', 'Node.js'], { github: 'https://github.com/x/a' }) },
  opensource: { b: project('B', ['React'], { current: true, caseStudy: '/casestudies/b' }) },
  clients: { c: project('C', ['Vue'], { url: 'https://c.example' }) },
  employers: { d: project('D', []) },
});

describe('projects', () => {
  it('flattens in display order with stable ids', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'products-a',
      'opensource-b',
      'clients-c',
      'employers-d',
    ]);
  });

  it('puts current work first without reordering the source list', () => {
    expect(filterProjects(projects, ALL_PROJECTS).map((p) => p.name)).toEqual(['B', 'A', 'C', 'D']);
    expect(projects.map((p) => p.name)).toEqual(['A', 'B', 'C', 'D']);
  });

  it('filters by type, technology and current focus', () => {
    expect(
      filterProjects(projects, { ...ALL_PROJECTS, type: 'clients' }).map((p) => p.name),
    ).toEqual(['C']);
    expect(filterProjects(projects, { ...ALL_PROJECTS, tech: 'React' }).map((p) => p.name)).toEqual(
      ['B', 'A'],
    );
    expect(
      filterProjects(projects, { ...ALL_PROJECTS, type: 'clients', currentOnly: true }).map(
        (p) => p.name,
      ),
    ).toEqual(['B']);
  });

  it('counts types for the chosen technology', () => {
    expect(countByType(projects, 'React')).toEqual({
      products: 1,
      opensource: 1,
      clients: 0,
      employers: 0,
    });
  });

  it('lists technologies by use, then name', () => {
    expect(techOptions(projects, 'all')).toEqual([
      { tech: 'React', count: 2 },
      { tech: 'Node.js', count: 1 },
      { tech: 'Vue', count: 1 },
    ]);
    expect(techOptions(projects, 'clients')).toEqual([{ tech: 'Vue', count: 1 }]);
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
