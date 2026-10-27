import { ChevronLeft, Code, Globe } from 'lucide-react';
import { type KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { loadCaseStudy } from '../../../content/caseStudies.ts';
import type { CaseStudy, Profile } from '../../../content/schema.ts';
import { cx } from '../../../lib/cx.ts';
import { ProblemTab } from '../../case-studies/ProblemTab.tsx';
import { ResultsTab } from '../../case-studies/ResultsTab.tsx';
import {
  buildTree,
  caseStudyId,
  findItem,
  flatItems,
  nextId,
  type Tree,
  type TreeItem,
} from './portfolioTree.ts';

const DEFAULT_ID = 'clients-northrop';

const optionId = (id: string) => `portfolio-option-${id}`;

type TabId = 'overview' | 'problem' | 'results';

/** Overview always; Problem and Results only when the case study has them. */
const tabsFor = (study: CaseStudy): { id: TabId; label: string }[] => [
  { id: 'overview', label: 'Overview' },
  ...(study.problem ? [{ id: 'problem' as const, label: 'Problem' }] : []),
  ...(study.results ? [{ id: 'results' as const, label: 'Results' }] : []),
];

const link = 'flex items-center gap-1 text-blue-700 underline dark:text-blue-300';

interface PortfolioAppProps {
  profile: Profile;
  initialId?: string;
}

/** The Portfolio app: projects in a tree on the left, the selected one on the right. */
export function PortfolioApp({ profile, initialId = DEFAULT_ID }: PortfolioAppProps) {
  const tree = useMemo(() => buildTree(profile.projects), [profile.projects]);
  const [selectedId, setSelectedId] = useState(initialId);
  // In a narrow window the tree and the detail take turns.
  const [detailOpen, setDetailOpen] = useState(false);
  const items = flatItems(tree);
  const selected = findItem(tree, selectedId) ?? items[0];

  useEffect(() => {
    document.getElementById(optionId(selectedId))?.scrollIntoView({ block: 'nearest' });
  }, [selectedId]);

  const select = (id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: 1,
      ArrowUp: -1,
      Home: -items.length,
      End: items.length,
    };
    const delta = moves[event.key];
    if (delta !== undefined) {
      event.preventDefault();
      setSelectedId(nextId(tree, selectedId, delta));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setDetailOpen(true);
    }
  };

  const groupLabel = tree.find((group) => group.type === selected?.type)?.label;

  return (
    <div className="@container h-full">
      <div className="win98-face flex h-full flex-col">
        <div className="flex h-9 items-center gap-2 p-1 font-win98 text-sm">
          {detailOpen && (
            <button
              type="button"
              onClick={() => setDetailOpen(false)}
              className="win98-button flex items-center gap-1 px-2 py-0.5 @xl:hidden"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
          )}
          <span className="truncate font-bold">{groupLabel}</span>
        </div>

        <div className="flex min-h-0 flex-1 gap-1 p-1 pt-0">
          <ProjectTree
            tree={tree}
            selectedId={selected?.id}
            onSelect={select}
            onKeyDown={onKeyDown}
            className={detailOpen ? 'hidden @xl:block' : undefined}
          />
          <div
            className={cx(
              'win98-sunken min-w-0 flex-1 overflow-auto bg-white p-3 text-gray-900 dark:bg-gray-900 dark:text-white',
              !detailOpen && 'hidden @xl:block',
            )}
          >
            {selected && <Detail key={selected.id} item={selected} groupLabel={groupLabel} />}
          </div>
        </div>

        <footer className="flex gap-1 p-1 pt-0 font-win98 text-xs">
          <p className="win98-sunken px-2 py-0.5">{items.length} projects</p>
          <p className="win98-sunken min-w-0 flex-1 truncate px-2 py-0.5">{selected?.name}</p>
        </footer>
      </div>
    </div>
  );
}

interface TreeProps {
  tree: Tree;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  className: string | undefined;
}

function ProjectTree({ tree, selectedId, onSelect, onKeyDown, className }: TreeProps) {
  return (
    <div
      role="listbox"
      aria-label="Projects"
      tabIndex={0}
      aria-activedescendant={selectedId ? optionId(selectedId) : undefined}
      onKeyDown={onKeyDown}
      className={cx(
        'win98-sunken min-h-0 w-full overflow-auto bg-white py-1 text-sm text-gray-900 focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-dotted @xl:w-56 @xl:shrink-0 dark:bg-gray-900 dark:text-white',
        className,
      )}
    >
      {tree.map((group) => (
        <div key={group.type} role="group" aria-labelledby={`portfolio-group-${group.type}`}>
          <div
            id={`portfolio-group-${group.type}`}
            className="flex items-center gap-2 px-2 py-1 font-win98 font-bold"
          >
            <group.icon className="h-4 w-4 shrink-0" aria-hidden />
            <span>{group.label}</span>
            <span className="font-normal text-gray-600 dark:text-gray-400">
              {group.items.length}
            </span>
          </div>
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              tabIndex={-1}
              id={optionId(item.id)}
              aria-selected={item.id === selectedId}
              onClick={() => onSelect(item.id)}
              className={cx(
                'block w-full cursor-default truncate py-0.5 pr-2 pl-8 text-left',
                item.id === selectedId
                  ? 'bg-[#000080] text-white dark:bg-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800',
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function Chips({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="win98-sunken bg-white px-2 py-0.5 text-xs dark:bg-gray-900">
          {item}
        </li>
      ))}
    </ul>
  );
}

function Detail({ item, groupLabel }: { item: TreeItem; groupLabel: string | undefined }) {
  const { project } = item;
  const id = caseStudyId(project);
  const [study, setStudy] = useState<CaseStudy>();
  const [tab, setTab] = useState<TabId>('overview');

  // Detail is keyed by the selected project, so leaving it cancels a load in flight.
  useEffect(() => {
    if (!id) return;
    let active = true;
    loadCaseStudy(id)
      .then((loaded) => active && setStudy(loaded))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [id]);

  const meta = [groupLabel, study?.organization, study?.role, study?.period].filter(Boolean);
  const tabs = study ? tabsFor(study) : [];

  return (
    <article className="space-y-3">
      <header>
        <h2 className="text-lg font-bold">{project.name}</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">{meta.join(' · ')}</p>
        {study && <p className="mt-1 text-sm italic">{study.tagline}</p>}
      </header>
      <p className="leading-relaxed">{project.description}</p>
      {project.technologies.length > 0 && <Chips items={project.technologies} />}
      {(project.url ?? project.github) && (
        <div className="flex flex-wrap gap-4 text-sm">
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={link}>
              <Globe className="h-4 w-4" aria-hidden />
              Live site
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={link}>
              <Code className="h-4 w-4" aria-hidden />
              Source
            </a>
          )}
        </div>
      )}
      {study && (
        <section aria-label="Case study">
          <div role="tablist" aria-label="Case study" className="flex gap-0.5 font-win98 text-sm">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`portfolio-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="portfolio-tabpanel"
                onClick={() => setTab(t.id)}
                className={cx(
                  'win98-face px-3 py-1',
                  tab === t.id ? 'win98-raised border-b-0 font-bold' : 'win98-button',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="portfolio-tabpanel"
            aria-labelledby={`portfolio-tab-${tab}`}
            className="win98-raised win98-face p-1"
          >
            {tab === 'overview' && <Overview study={study} />}
            {tab === 'problem' && study.problem && (
              <div className="h-[28rem]">
                <ProblemTab problem={study.problem} />
              </div>
            )}
            {tab === 'results' && study.results && (
              <ResultsTab title={study.title} results={study.results} />
            )}
          </div>
        </section>
      )}
    </article>
  );
}

function Overview({ study }: { study: CaseStudy }) {
  return (
    <div className="space-y-4 bg-white p-3 text-sm text-gray-900 dark:bg-gray-900 dark:text-white">
      <section>
        <h3 className="mb-1 font-bold">Context</h3>
        <p className="leading-relaxed">{study.context}</p>
      </section>
      <section>
        <h3 className="mb-1 font-bold">Delivered</h3>
        <ul className="list-disc space-y-1 pl-5">
          {study.delivered.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-1 font-bold">Stack</h3>
        <Chips items={study.stack} />
      </section>
    </div>
  );
}
