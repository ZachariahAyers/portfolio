import { type CaseStudy, CaseStudySchema } from './schema.ts';

const caseStudyFiles = import.meta.glob<unknown>('../../content/case-studies/*.json', {
  import: 'default',
});

const idOf = (path: string) => path.slice(path.lastIndexOf('/') + 1).replace(/\.\w+$/, '');

export const caseStudyIds: string[] = Object.keys(caseStudyFiles).map(idOf).toSorted();

/** Loads and validates one case study. Resolves undefined for an unknown id. */
export async function loadCaseStudy(id: string): Promise<CaseStudy | undefined> {
  const load = caseStudyFiles[`../../content/case-studies/${id}.json`];
  return load ? CaseStudySchema.parse(await load()) : undefined;
}
