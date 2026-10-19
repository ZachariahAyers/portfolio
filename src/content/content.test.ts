import { describe, expect, it } from 'vitest';
import { liveUrl } from '../../shared/content.ts';
import { profile } from '../../shared/profile.ts';
import { flattenProjects } from '../features/profile/projects.ts';
import { caseStudyIds, diagramIds, loadCaseStudy, loadDiagram } from './caseStudies.ts';

describe('authored content', () => {
  it('has case studies to show', () => {
    expect(caseStudyIds.length).toBeGreaterThan(0);
  });

  it.each(caseStudyIds)('case study %s matches the schema and its file name', async (id) => {
    const caseStudy = await loadCaseStudy(id);
    expect(caseStudy?.id).toBe(id);
  });

  it('every diagram belongs to a case study', () => {
    expect(caseStudyIds).toEqual(expect.arrayContaining(diagramIds));
  });

  it.each(diagramIds)('diagram %s has Mermaid source', async (id) => {
    expect((await loadDiagram(id))?.trim()).toBeTruthy();
  });

  it('every project case study link points at an existing case study', () => {
    const linked = flattenProjects(profile.projects).flatMap((p) =>
      p.caseStudy ? [p.caseStudy.replace('/casestudies/', '')] : [],
    );
    expect(caseStudyIds).toEqual(expect.arrayContaining(linked));
  });

  it('a live URL is a deployment, never a source repository', async () => {
    const urls: string[] = [];
    for (const id of caseStudyIds) {
      const caseStudy = await loadCaseStudy(id);
      const url = caseStudy && liveUrl(caseStudy);
      if (url) urls.push(url);
    }
    expect(urls.filter((url) => url.includes('github.com'))).toEqual([]);
  });

  it('carries no emoji', async () => {
    // Characters that render as emoji. Symbols like ™ are allowed.
    const emoji = /\p{Emoji_Presentation}|\uFE0F/u;
    expect(JSON.stringify(profile)).not.toMatch(emoji);
    for (const id of caseStudyIds) {
      const caseStudy = await loadCaseStudy(id);
      const { techStackAnalyzer: _code, ...prose } = caseStudy ?? {};
      expect(JSON.stringify(prose)).not.toMatch(emoji);
    }
  });

  it('unknown ids load as nothing', async () => {
    expect(await loadCaseStudy('no-such-study')).toBeUndefined();
    expect(await loadDiagram('no-such-study')).toBeUndefined();
  });
});
