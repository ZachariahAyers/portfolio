import { describe, expect, it } from 'vitest';
import { profile } from '../../../content/profile.ts';
import { PROJECT_TYPES } from '../../../content/schema.ts';
import { buildTree, caseStudyId, findItem, flatIds, nextId } from './portfolioTree.ts';

const tree = buildTree(profile.projects);
const projectCount = PROJECT_TYPES.reduce(
  (sum, type) => sum + Object.keys(profile.projects[type]).length,
  0,
);

describe('portfolio tree', () => {
  it('orders the groups products, open source, clients, employers', () => {
    expect(tree.map((group) => group.label)).toEqual([
      'Products',
      'Open Source',
      'Clients',
      'Employers',
    ]);
  });

  it('puts Northrop first among the clients and keeps file order elsewhere', () => {
    const clients = tree.find((group) => group.type === 'clients');
    expect(clients?.items[0]?.id).toBe('clients-northrop');
    expect(clients?.items.map((item) => item.key)).toEqual(Object.keys(profile.projects.clients));
    const products = tree.find((group) => group.type === 'products');
    expect(products?.items.map((item) => item.key)).toEqual(Object.keys(profile.projects.products));
  });

  it('moves Northrop to the front when the file lists it later', () => {
    const reordered = buildTree({
      ...profile.projects,
      clients: {
        wrapmate: profile.projects.clients.wrapmate!,
        northrop: profile.projects.clients.northrop!,
      },
    });
    expect(reordered[2]?.items.map((item) => item.key)).toEqual(['northrop', 'wrapmate']);
  });

  it('lists every project once', () => {
    expect(flatIds(tree)).toHaveLength(projectCount);
    expect(projectCount).toBe(19);
    expect(new Set(flatIds(tree)).size).toBe(projectCount);
  });

  it('finds an item by id', () => {
    expect(findItem(tree, 'clients-northrop')?.name).toBe('Northrop Grumman');
    expect(findItem(tree, 'nope')).toBeUndefined();
  });

  it('moves the selection and stops at both ends', () => {
    const ids = flatIds(tree);
    expect(nextId(tree, ids[0]!, 1)).toBe(ids[1]);
    expect(nextId(tree, ids[1]!, -1)).toBe(ids[0]);
    expect(nextId(tree, ids[0]!, -1)).toBe(ids[0]);
    const last = ids[ids.length - 1]!;
    expect(nextId(tree, last, 1)).toBe(last);
    expect(nextId(tree, ids[0]!, 1000)).toBe(last);
    expect(nextId(tree, 'nope', 1)).toBe(ids[0]);
  });

  it('reads the case study id from the link', () => {
    expect(caseStudyId({ caseStudy: '/casestudies/magpie' })).toBe('magpie');
    expect(caseStudyId({})).toBeUndefined();
  });
});
