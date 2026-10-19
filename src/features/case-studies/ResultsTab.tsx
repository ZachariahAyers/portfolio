import { CheckCircle, ChevronDown, DollarSign, FileText, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { CaseStudy } from '../../../shared/content.ts';
import { cx } from '../../lib/cx.ts';
import { reportId } from './identifiers.ts';
import { TabHeading } from './TabHeading.tsx';

const SECTION_ICONS = [
  <Users key="0" className="h-5 w-5 text-blue-400" aria-hidden />,
  <DollarSign key="1" className="h-5 w-5 text-yellow-400" aria-hidden />,
  <TrendingUp key="2" className="h-5 w-5 text-green-400" aria-hidden />,
];

const list = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const row = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

/** Results as a short report: summary, then before/after metrics and highlights per area. */
export function ResultsTab({ caseStudy }: { caseStudy: CaseStudy }) {
  const section = caseStudy.results;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex h-full flex-col bg-gray-200 p-8 dark:bg-gray-900">
      <TabHeading
        title="Business Results"
        subtitle="These are the actual metrics and ROI I delivered - the same results I'll bring to your company"
      />
      <div className="dashboard-scroll flex-1 overflow-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 rounded-t-lg border border-gray-300 bg-linear-to-r from-gray-100 to-gray-50 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-850"
        >
          <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {caseStudy.hero.title} • {caseStudy.timeline.year}
            </p>
          </div>
        </motion.header>

        {section.executive_summary && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-x border-gray-300 bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h4 className="mb-3 text-lg font-semibold text-blue-600 dark:text-blue-400">
              Executive Summary
            </h4>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {section.executive_summary}
            </p>
          </motion.section>
        )}

        <div className="overflow-hidden rounded-b-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          {section.sections.map((part, index) => {
            const expanded = open === index;
            return (
              <motion.section
                key={part.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border-b border-gray-300 last:border-b-0 dark:border-gray-700"
              >
                <h4>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : index)}
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-900"
                  >
                    <span className="flex items-center gap-3 text-lg font-medium text-gray-900 dark:text-white">
                      {SECTION_ICONS[index]}
                      {part.title}
                    </span>
                    <ChevronDown
                      className={cx(
                        'h-5 w-5 text-gray-500 transition-transform',
                        expanded && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </button>
                </h4>
                {expanded && (
                  <div className="bg-white p-6 dark:bg-gray-850">
                    {part.metrics && (
                      <motion.div
                        variants={list}
                        initial="hidden"
                        animate="visible"
                        className="overflow-x-auto"
                      >
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-300 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400">
                              <th className="px-4 py-3 text-left">Metric</th>
                              <th className="px-4 py-3 text-center">Before</th>
                              <th className="px-4 py-3 text-center">After</th>
                              <th className="px-4 py-3 text-right">Change</th>
                            </tr>
                          </thead>
                          <tbody>
                            {part.metrics.map((metric) => (
                              <motion.tr
                                key={metric.metric}
                                variants={row}
                                className="border-b border-gray-200 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-800/30"
                              >
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                  {metric.metric}
                                </td>
                                <td className="px-4 py-3 text-center font-mono text-gray-600 dark:text-gray-400">
                                  {metric.before}
                                </td>
                                <td className="px-4 py-3 text-center font-mono text-gray-700 dark:text-gray-300">
                                  {metric.after}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="rounded-sm bg-green-500/20 px-2 py-1 font-mono text-xs text-green-600 dark:text-green-400">
                                    {metric.change}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    )}
                    {part.highlights && (
                      <motion.ul
                        variants={list}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                      >
                        {part.highlights.map((highlight) => (
                          <motion.li
                            key={highlight}
                            variants={row}
                            className="flex items-start gap-3 rounded-lg bg-gray-100 p-3 text-sm text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
                          >
                            <CheckCircle
                              className="mt-0.5 h-5 w-5 shrink-0 text-green-400"
                              aria-hidden
                            />
                            {highlight}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                    {part.summary && (
                      <p className="mt-4 rounded-lg border border-blue-300 bg-linear-to-r from-blue-100 to-blue-50 p-4 text-lg font-medium text-blue-700 dark:border-blue-500/30 dark:from-blue-900/20 dark:to-blue-800/10 dark:text-blue-300">
                        {part.summary}
                      </p>
                    )}
                  </div>
                )}
              </motion.section>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-gray-600 dark:text-gray-500">
          Report ID: {reportId(caseStudy.id)}
        </p>
      </div>
    </div>
  );
}
