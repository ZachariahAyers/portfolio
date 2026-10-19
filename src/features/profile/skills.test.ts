import { describe, expect, it } from 'vitest';
import {
  ALL_SKILLS,
  certificationGroups,
  countByCategory,
  countByLevel,
  filterSkills,
  flattenSkills,
} from './skills.ts';

const skills = flattenSkills({
  expert: { description: 'Daily', languages: ['TypeScript', 'C#'], cloud: ['Azure'] },
  proficient: { description: 'Often', languages: ['Python'] },
  familiar: { description: 'Sometimes', tools: ['Kafka'] },
});

describe('skills', () => {
  it('flattens every level and skips the description', () => {
    expect(skills).toHaveLength(5);
    expect(skills.find((s) => s.name === 'Python')).toEqual({
      name: 'Python',
      level: 'proficient',
      category: 'languages',
    });
  });

  it('filters by level, category and a case-insensitive search', () => {
    expect(filterSkills(skills, { ...ALL_SKILLS, level: 'expert' })).toHaveLength(3);
    expect(filterSkills(skills, { ...ALL_SKILLS, category: 'languages' })).toHaveLength(3);
    expect(
      filterSkills(skills, { ...ALL_SKILLS, query: '  typescript ' }).map((s) => s.name),
    ).toEqual(['TypeScript']);
  });

  it('counts each level ignoring the level filter itself', () => {
    expect(countByLevel(skills, { ...ALL_SKILLS, level: 'expert', category: 'languages' })).toEqual(
      { expert: 2, proficient: 1, familiar: 0 },
    );
  });

  it('counts each category ignoring the category filter itself', () => {
    const counts = countByCategory(skills, { ...ALL_SKILLS, category: 'cloud', level: 'expert' });
    expect(Object.fromEntries(counts)).toEqual({ languages: 2, cloud: 1 });
  });
});

describe('certificationGroups', () => {
  it('skips the duplicate in-progress list and reads progress from the details', () => {
    const groups = certificationGroups({
      certifications: { cloud: ['AWS A (In Progress)', 'AWS B (2024)'], inProgress: ['AWS A'] },
      certificationDetails: {
        'AWS A (In Progress)': { credentialId: null, verifyUrl: null, inProgress: true },
        'AWS B (2024)': {
          credentialId: 'X1',
          verifyUrl: 'https://verify.example/X1',
          inProgress: false,
        },
      },
    });
    expect(groups).toEqual([
      {
        group: 'cloud',
        certifications: [
          { name: 'AWS A', inProgress: true, credentialId: null, verifyUrl: null },
          {
            name: 'AWS B (2024)',
            inProgress: false,
            credentialId: 'X1',
            verifyUrl: 'https://verify.example/X1',
          },
        ],
      },
    ]);
  });
});
