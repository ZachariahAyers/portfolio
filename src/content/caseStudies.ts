import { type CaseStudy, CaseStudySchema } from '../../shared/content.ts';

const caseStudyFiles = import.meta.glob<unknown>('../../content/case-studies/*.json', {
  import: 'default',
});
const diagramFiles = import.meta.glob<string>('../../content/diagrams/*.mmd', {
  query: '?raw',
  import: 'default',
});

const idOf = (path: string) => path.slice(path.lastIndexOf('/') + 1).replace(/\.\w+$/, '');

export const caseStudyIds: string[] = Object.keys(caseStudyFiles).map(idOf).toSorted();
export const diagramIds: string[] = Object.keys(diagramFiles).map(idOf).toSorted();

/** Loads and validates one case study. Resolves undefined for an unknown id. */
export async function loadCaseStudy(id: string): Promise<CaseStudy | undefined> {
  const load = caseStudyFiles[`../../content/case-studies/${id}.json`];
  return load ? CaseStudySchema.parse(await load()) : undefined;
}

/** Loads the Mermaid source of a case study's architecture diagram. */
export async function loadDiagram(id: string): Promise<string | undefined> {
  return diagramFiles[`../../content/diagrams/${id}.mmd`]?.();
}
