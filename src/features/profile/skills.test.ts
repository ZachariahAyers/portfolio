import { describe, expect, it } from 'vitest';
import { ALL_SKILLS, filterSkills, skillCount } from './skills.ts';

const skills = [
  { category: 'Languages', items: ['TypeScript', 'C#'] },
  { category: 'Cloud', items: ['Azure', 'AWS'] },
];

describe('skills', () => {
  it('keeps everything with no filter', () => {
    expect(filterSkills(skills, ALL_SKILLS)).toEqual(skills);
    expect(skillCount(skills)).toBe(4);
  });

  it('narrows to one category', () => {
    expect(filterSkills(skills, { ...ALL_SKILLS, category: 'Cloud' })).toEqual([skills[1]]);
  });

  it('searches case-insensitively and drops empty categories', () => {
    expect(filterSkills(skills, { ...ALL_SKILLS, query: '  typescript ' })).toEqual([
      { category: 'Languages', items: ['TypeScript'] },
    ]);
  });
});
