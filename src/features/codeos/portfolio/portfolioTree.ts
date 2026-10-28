import { Briefcase, Building, type LucideIcon, Package, Rocket } from 'lucide-react';
import { type Profile, type Project, type ProjectType } from '../../../content/schema.ts';

export interface TreeItem {
  id: string;
  type: ProjectType;
  key: string;
  name: string;
  project: Project;
}

export interface TreeGroup {
  type: ProjectType;
  label: string;
  icon: LucideIcon;
  items: TreeItem[];
}

export type Tree = TreeGroup[];

/** Company portfolio and product groups. */
const GROUPS: Record<ProjectType, { label: string; icon: LucideIcon }> = {
  products: { label: 'Products', icon: Rocket },
  opensource: { label: 'Open Source', icon: Package },
  clients: { label: 'Portfolio', icon: Briefcase },
  employers: { label: 'Employers', icon: Building },
};

const FIRST_CLIENT = 'northrop';

/** Company portfolio first, with Northrop Grumman leading it. */
export function buildTree(projects: Profile['projects']): Tree {
  return (['clients', 'products', 'opensource', 'employers'] as const)
    .filter((type) => Object.keys(projects[type]).length)
    .map((type) => {
      const entries = Object.entries(projects[type]);
      const ordered =
        type === 'clients'
          ? entries.toSorted(([a], [b]) => Number(b === FIRST_CLIENT) - Number(a === FIRST_CLIENT))
          : entries;
      return {
        type,
        ...GROUPS[type],
        items: ordered.map(([key, project]) => ({
          id: `${type}-${key}`,
          type,
          key,
          name: project.name,
          project,
        })),
      };
    });
}

export const flatItems = (tree: Tree): TreeItem[] => tree.flatMap((group) => group.items);

export const flatIds = (tree: Tree): string[] => flatItems(tree).map((item) => item.id);

export const findItem = (tree: Tree, id: string): TreeItem | undefined =>
  flatItems(tree).find((item) => item.id === id);

/** The id `delta` rows from `id`, stopping at either end. An unknown id lands on the first row. */
export function nextId(tree: Tree, id: string, delta: number): string {
  const ids = flatIds(tree);
  const index = ids.indexOf(id);
  const target = index < 0 ? 0 : Math.min(ids.length - 1, Math.max(0, index + delta));
  return ids[target] ?? id;
}

/** The case study id from a project's `/casestudies/<id>` link. */
export const caseStudyId = (project: Pick<Project, 'caseStudy'>): string | undefined =>
  /^\/casestudies\/([a-z0-9-]+)$/.exec(project.caseStudy ?? '')?.[1];
