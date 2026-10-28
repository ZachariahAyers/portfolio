import { describe, expect, it } from 'vitest';
import { flattenProjects } from '../features/profile/projects.ts';
import { caseStudyIds, loadCaseStudy } from './caseStudies.ts';
import { answerSet, profile } from './profile.ts';
import { loadSource, sourcePaths } from './source.ts';

const caseStudies = await Promise.all(caseStudyIds.map(loadCaseStudy));

describe('authored content', () => {
  it('has case studies to show', () => {
    expect(caseStudyIds.length).toBeGreaterThan(0);
  });

  it.each(caseStudyIds)('case study %s matches the schema and its file name', async (id) => {
    expect((await loadCaseStudy(id))?.id).toBe(id);
  });

  it('every project case study link points at an existing case study', () => {
    const linked = flattenProjects(profile.projects).flatMap((p) =>
      p.caseStudy ? [p.caseStudy.replace('/casestudies/', '')] : [],
    );
    expect(caseStudyIds).toEqual(expect.arrayContaining(linked));
  });

  it('a live URL is a deployment, never a source repository', () => {
    const live = caseStudies.flatMap((c) => (c?.links.live ? [c.links.live] : []));
    expect(live.filter((url) => url.includes('github.com'))).toEqual([]);
  });

  it('the published code explorer excludes retired portfolio data and ARLO', async () => {
    expect(sourcePaths).toContain('src/features/codeos/CodeOS.tsx');
    expect(sourcePaths).toContain('content/company-projects.json');
    expect(sourcePaths).not.toContain('content/answers.json');
    expect(sourcePaths).not.toContain('content/profile.json');
    const source = await loadSource(sourcePaths);
    expect(JSON.stringify(source)).not.toMatch(/ARLO|This portfolio/);
  });

  it('gives one contact address, and it is the support address', () => {
    const text = JSON.stringify([profile, answerSet, caseStudies]);
    expect(profile.contact.email).toBe('support@ayers.repair');
    expect([...new Set(text.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g))]).toEqual([
      'support@ayers.repair',
    ]);
  });

  it('carries no emoji', () => {
    // Characters that render as emoji. Symbols like ™ are allowed.
    const emoji = /\p{Emoji_Presentation}|️/u;
    expect(JSON.stringify([profile, answerSet, caseStudies])).not.toMatch(emoji);
  });

  it('no page claims a live AI model', async () => {
    const pages = await loadSource(sourcePaths.filter((path) => path.endsWith('.tsx')));
    const claims =
      /AI[- ]powered|real[- ]time|Gemini|GPT|language model|Online &amp; Ready|Online & Ready/i;
    const offending = Object.values(pages)
      .flat()
      .filter((file) => claims.test(file.code))
      .map((file) => file.name);
    expect(offending).toEqual([]);
  });

  it('unknown ids load as nothing', async () => {
    expect(await loadCaseStudy('no-such-study')).toBeUndefined();
  });
});
