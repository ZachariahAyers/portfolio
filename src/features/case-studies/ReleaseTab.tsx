import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Info,
  Search,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cx } from '../../lib/cx.ts';
import type { PageSpeedReport, Vital } from './pagespeed.ts';
import { ScoreRing } from './ScoreRing.tsx';
import { type PageSpeedState, usePageSpeed } from './usePageSpeed.ts';

const tone = (score: number) =>
  score >= 0.9
    ? 'text-green-500 bg-green-500/10 border-green-500/30'
    : score >= 0.5
      ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      : 'text-red-500 bg-red-500/10 border-red-500/30';

function Panel({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: LucideIcon;
  title: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 border-b border-gray-300 bg-gray-50/90 p-4 last:border-b-0 dark:border-blue-500/30 dark:bg-gray-900/50"
    >
      <h3 className={cx('mb-3 flex items-center gap-2 font-mono text-xs uppercase', color)}>
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h3>
      {children}
    </motion.section>
  );
}

function Pending({
  state,
  children,
}: {
  state: PageSpeedState;
  children: (report: PageSpeedReport) => ReactNode;
}) {
  if (state.status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <Activity className="mb-3 h-8 w-8 animate-spin text-blue-500" aria-hidden />
        <p className="text-sm text-gray-600 dark:text-gray-400">Fetching Lighthouse report...</p>
        <p className="mt-1 text-xs text-gray-500">This may take 20-30 seconds</p>
      </div>
    );
  }
  if (state.status === 'failed')
    return (
      <p className="text-xs text-gray-600 dark:text-gray-400">Analysis unavailable right now.</p>
    );
  return children(state.report);
}

function Empty({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Icon className="mb-2 h-8 w-8 text-green-500" aria-hidden />
      <p className="text-xs text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  );
}

function VitalCard({ label, metric, vital }: { label: string; metric: string; vital: Vital }) {
  return (
    <div className={cx('rounded-lg border p-3', tone(vital.score))}>
      <p className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="opacity-75">{metric}</span>
      </p>
      <p className="text-lg font-bold">{vital.displayValue}</p>
    </div>
  );
}

function statusText(state: PageSpeedState): string {
  if (state.status === 'loading') return 'Analyzing...';
  if (state.status === 'failed') return 'Unavailable';
  return state.cachedMinutesAgo === null
    ? 'Fresh Analysis'
    : `Cached (${state.cachedMinutesAgo}m ago)`;
}

/** The live site next to a Lighthouse report of it. */
export function ReleaseTab({ url, title }: { url: string; title: string }) {
  const state = usePageSpeed(url);

  const left = (
    <>
      <Panel icon={Activity} title="System Properties" color="text-blue-600 dark:text-blue-400">
        <h2 className="mb-1 text-lg font-thin">Live Production Environment</h2>
        <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">
          This is the actual deployed solution running in production
        </p>
        <dl className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Site</dt>
            <dd>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
              >
                Open <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Analysis Status</dt>
            <dd className="text-gray-700 dark:text-gray-300">{statusText(state)}</dd>
          </div>
          {state.status === 'ready' && (
            <div className="flex items-center justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Lighthouse Version</dt>
              <dd className="text-gray-700 dark:text-gray-300">{state.report.lighthouseVersion}</dd>
            </div>
          )}
        </dl>
      </Panel>
      <Panel
        icon={BarChart3}
        title="Lighthouse Scores"
        color="text-orange-600 dark:text-orange-400"
      >
        <Pending state={state}>
          {({ scores }) => (
            <div className="grid grid-cols-2 gap-3">
              <ScoreRing score={scores.performance} label="Performance" delay={0} />
              <ScoreRing score={scores.accessibility} label="Accessibility" delay={100} />
              <ScoreRing score={scores.bestPractices} label="Best Practices" delay={200} />
              <ScoreRing score={scores.seo} label="SEO" delay={300} />
            </div>
          )}
        </Pending>
      </Panel>
      <Panel icon={Activity} title="Core Web Vitals" color="text-purple-600 dark:text-purple-400">
        <Pending state={state}>
          {({ vitals }) => (
            <div className="space-y-2">
              <VitalCard metric="LCP" label="Largest Contentful Paint" vital={vitals.lcp} />
              <VitalCard metric="CLS" label="Cumulative Layout Shift" vital={vitals.cls} />
              <VitalCard metric="TBT" label="Total Blocking Time" vital={vitals.tbt} />
            </div>
          )}
        </Pending>
      </Panel>
    </>
  );

  const right = (
    <>
      <Panel icon={TrendingUp} title="Field Data" color="text-green-600 dark:text-green-400">
        <Pending state={state}>
          {({ field }) =>
            field ? (
              <>
                <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                  Real user metrics from the Chrome UX Report
                </p>
                <dl className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ['FCP', field.fcp, 'ms'],
                      ['LCP', field.lcp, 'ms'],
                      ['INP', field.inp, 'ms'],
                      ['CLS', field.cls, ''],
                    ] as const
                  ).map(
                    ([label, value, unit]) =>
                      value !== undefined && (
                        <div
                          key={label}
                          className="rounded-sm bg-gray-100/50 p-2 dark:bg-gray-800/50"
                        >
                          <dt className="text-xs text-gray-600 dark:text-gray-400">{label}</dt>
                          <dd className="text-sm font-bold">
                            {unit ? Math.round(value) : value.toFixed(3)}
                            {unit}
                          </dd>
                        </div>
                      ),
                  )}
                </dl>
              </>
            ) : (
              <Empty icon={Info} text="No field data available for this origin" />
            )
          }
        </Pending>
      </Panel>
      <Panel icon={Search} title="Opportunities" color="text-green-600 dark:text-green-400">
        <Pending state={state}>
          {({ opportunities }) =>
            opportunities.length > 0 ? (
              <ul className="dashboard-scroll max-h-[200px] space-y-2 overflow-y-auto">
                {opportunities.map((o) => (
                  <li key={o.title} className="border-l-2 border-green-500 pl-2 text-xs">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{o.title}</p>
                    <p className="text-gray-600 dark:text-gray-500">{o.savings}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty icon={CheckCircle} text="No major optimization opportunities found" />
            )
          }
        </Pending>
      </Panel>
      <Panel icon={AlertTriangle} title="Diagnostics" color="text-red-600 dark:text-red-400">
        <Pending state={state}>
          {({ diagnostics }) =>
            diagnostics.length > 0 ? (
              <ul className="dashboard-scroll max-h-[200px] space-y-2 overflow-y-auto">
                {diagnostics.map((d) => (
                  <li key={d.title} className="border-l-2 border-yellow-500 pl-2 text-xs">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{d.title}</p>
                    {d.displayValue && (
                      <p className="text-gray-600 dark:text-gray-500">{d.displayValue}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <Empty icon={CheckCircle} text="No diagnostic issues found" />
            )
          }
        </Pending>
      </Panel>
    </>
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-black md:grid md:grid-cols-[320px_1fr_320px] md:overflow-hidden">
      <div className="h-[50vh] shrink-0 border-b-4 border-blue-500 bg-gray-950 md:order-2 md:h-full md:border-0">
        <iframe
          src={url}
          title={title}
          className="h-full w-full bg-white"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      <div className="flex flex-col md:order-1 md:overflow-y-auto md:border-r md:border-gray-300 dark:md:border-blue-500/20">
        {left}
      </div>
      <div className="flex flex-col md:order-3 md:overflow-y-auto md:border-l md:border-gray-300 dark:md:border-blue-500/20">
        {right}
      </div>
    </div>
  );
}
