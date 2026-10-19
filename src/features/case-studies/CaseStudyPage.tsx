import {
  ArrowLeft,
  Atom,
  BarChart3,
  Beaker,
  Binary,
  ChevronRight,
  FlaskConical,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { Tooltip } from '../../components/Tooltip.tsx';
import { loadCaseStudy } from '../../content/caseStudies.ts';
import type { CaseStudy } from '../../content/schema.ts';
import { cx } from '../../lib/cx.ts';
import { CodeOS } from '../codeos/CodeOS.tsx';
import { OverviewTab } from './OverviewTab.tsx';
import { ProblemTab } from './ProblemTab.tsx';
import { ResultsTab } from './ResultsTab.tsx';

type TabId = 'overview' | 'problem' | 'results' | 'code';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: FlaskConical },
  { id: 'problem', label: 'Before and After', icon: Binary },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'code', label: 'Code', icon: Layers },
];

/** Overview always; every other tab only when the case study has its content. */
const tabsFor = (caseStudy: CaseStudy) =>
  TABS.filter(
    (tab) =>
      tab.id === 'overview' ||
      (tab.id === 'problem' && caseStudy.problem) ||
      (tab.id === 'results' && caseStudy.results) ||
      (tab.id === 'code' && caseStudy.source),
  );

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export default function CaseStudyRoute() {
  const { caseStudyId = '' } = useParams();
  return <CaseStudyLoader key={caseStudyId} id={caseStudyId} />;
}

function CaseStudyLoader({ id }: { id: string }) {
  const [state, setState] = useState<
    { status: 'loading' } | { status: 'missing' } | { status: 'ready'; caseStudy: CaseStudy }
  >({
    status: 'loading',
  });

  useEffect(() => {
    let active = true;
    loadCaseStudy(id)
      .then(
        (caseStudy) =>
          active && setState(caseStudy ? { status: 'ready', caseStudy } : { status: 'missing' }),
      )
      .catch(() => active && setState({ status: 'missing' }));
    return () => {
      active = false;
    };
  }, [id]);

  if (state.status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-24 w-24"
        >
          <Atom
            className="h-full w-full text-blue-600 dark:text-blue-400"
            aria-label="Loading case study"
          />
        </motion.div>
      </div>
    );
  }
  if (state.status === 'missing') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold">Case study not found</h1>
        <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
          Back to the portfolio
        </Link>
      </div>
    );
  }
  return <CaseStudyPage caseStudy={state.caseStudy} />;
}

function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const tabs = useMemo(() => tabsFor(caseStudy), [caseStudy]);
  const site = caseStudy.links.live;
  const active = tabs.find((tab) => tab.id === search.get('tab'))?.id ?? 'overview';
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
    })),
  );

  useEffect(() => {
    document.title = `${caseStudy.title} | Zachariah Ayers`;
  }, [caseStudy.title]);

  const select = useCallback((id: TabId) => setSearch({ tab: id }, { replace: true }), [setSearch]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || document.querySelector('[role="dialog"]')) return;
      if (event.key === 'Escape') {
        void navigate('/');
        return;
      }
      const tab = tabs[Number(event.key) - 1];
      if (tab) select(tab.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, select, tabs]);

  const siteLink = (className: string, children: ReactNode) =>
    site && (
      <a href={site} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute h-1 w-1 rounded-full bg-blue-400/30"
            initial={{ x: `${p.x}%`, y: `${p.y}%` }}
            animate={{ x: `${(p.x + 20) % 100}%`, y: `${(p.y - 30) % 100}%` }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <header className="relative z-40 h-[60px] border-b border-gray-300 bg-gray-100/80 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/50">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Beaker className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
              <div>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400">
                  {caseStudy.organization}
                </p>
                <h1 className="text-sm font-bold">{caseStudy.title}</h1>
              </div>
            </div>
          </div>
          <Tooltip content="Back to the portfolio (Esc)">
            <Link
              to="/"
              className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-1"
                aria-hidden
              />
              <span className="text-sm font-light">Back</span>
            </Link>
          </Tooltip>
        </div>
      </header>

      <nav
        className="h-[60px] overflow-x-auto border-b border-gray-300 bg-gray-50/80 backdrop-blur-xs dark:border-gray-700/50 dark:bg-gray-800/30"
        aria-label="Case study sections"
      >
        <div
          className="flex h-full min-w-max items-center gap-0.5 px-3 pt-2 md:gap-1 md:px-6"
          role="tablist"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const selected = active === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => select(tab.id)}
                whileTap={{ scale: 0.95 }}
                className={cx(
                  'group relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-light transition-all duration-300 md:flex-row md:gap-2 md:px-6 md:text-sm',
                  selected
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="text-[10px] md:text-sm">{tab.label}</span>
                <span
                  className="absolute -top-3 left-1/2 hidden -translate-x-1/2 font-mono text-xs text-gray-500 md:block dark:text-gray-600"
                  aria-hidden
                >
                  {index + 1}
                </span>
                {selected && (
                  <motion.span
                    layoutId="active-tab"
                    className="absolute right-0 bottom-0 left-0 h-0.5 bg-linear-to-r from-blue-600 to-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
          <span className="ml-auto hidden font-mono text-xs text-gray-600 md:inline dark:text-gray-500">
            Use 1-{tabs.length} keys to navigate
          </span>
        </div>
      </nav>

      <main className="relative flex-1 overflow-hidden" role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {active === 'overview' && <OverviewTab caseStudy={caseStudy} />}
            {active === 'problem' && caseStudy.problem && (
              <ProblemTab problem={caseStudy.problem} />
            )}
            {active === 'results' && caseStudy.results && (
              <ResultsTab title={caseStudy.title} results={caseStudy.results} />
            )}
            {active === 'code' && caseStudy.source && (
              <CodeOS title={caseStudy.title} source={caseStudy.source} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="flex min-h-[30px] flex-col border-t border-gray-300 bg-gray-100/80 px-3 py-2 font-mono text-xs text-gray-600 md:h-[30px] md:flex-row md:items-center md:justify-between md:px-6 md:py-0 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-500">
        <p className="flex flex-wrap items-center justify-center gap-2 md:justify-start md:gap-4">
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">Role: </span>
            <span className="font-semibold">{caseStudy.role}</span>
          </span>
          <span aria-hidden>•</span>
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">When: </span>
            <span className="font-semibold">{caseStudy.period}</span>
          </span>
        </p>
        {siteLink(
          'mt-2 flex items-center justify-center gap-2 transition-colors hover:text-blue-600 md:mt-0 dark:hover:text-blue-400',
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" aria-hidden />
            <span>Visit the site</span>
            <ChevronRight className="h-3 w-3" aria-hidden />
          </>,
        )}
      </footer>
    </div>
  );
}
