import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Link2,
  MessageSquare,
  Paperclip,
  User,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import type { CaseStudy } from '../../../shared/content.ts';
import { cx } from '../../lib/cx.ts';
import { ticketNumber } from './identifiers.ts';
import { TabHeading } from './TabHeading.tsx';

function Collapsible({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mb-3 flex items-center gap-2 text-lg font-medium text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
      >
        <ChevronDown
          className={cx('h-5 w-5 transition-transform', !open && '-rotate-90')}
          aria-hidden
        />
        {title}
      </button>
      {open && children}
    </motion.section>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mb-1 text-xs text-gray-500">{label}</dt>
      <dd className="text-gray-900 dark:text-white">{children}</dd>
    </div>
  );
}

/** The business requirements, laid out like a ticket in an issue tracker. */
export function OverviewTab({ caseStudy }: { caseStudy: CaseStudy }) {
  const requirements = caseStudy.businessRequirements;
  const ticketId = `${requirements.jiraPrefix}-${ticketNumber(caseStudy.id)}`;

  return (
    <div className="flex h-full flex-col bg-gray-200 p-4 md:p-8 dark:bg-gray-900">
      <TabHeading
        title="Business Requirements"
        subtitle="This shows the real business problem I was hired to solve - exactly like the requirements you'd give your team"
      />
      <div className="dashboard-scroll flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link2 className="h-4 w-4" aria-hidden />
            <span>Projects</span>
            <span aria-hidden>/</span>
            <span>{caseStudy.hero.badge}</span>
            <span aria-hidden>/</span>
            <span className="text-gray-400">{ticketId}</span>
          </p>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-300 bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <header className="mb-6">
              <p className="mb-3 flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-sm bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-400">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Story
                </span>
                <span className="text-gray-600 dark:text-gray-500">{ticketId}</span>
              </p>
              <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {caseStudy.hero.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{caseStudy.hero.tagline}</p>
            </header>

            <div className="flex flex-col items-start gap-4 border-b border-gray-300 pb-6 sm:flex-row sm:items-center dark:border-gray-700">
              <span className="flex items-center gap-2 rounded-sm bg-green-500/20 px-4 py-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Done
              </span>
              <div className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" aria-hidden />
                  <span className="text-gray-600 dark:text-gray-400">Assignee:</span>
                  <span className="rounded-sm bg-gray-200 px-2 py-0.5 font-medium text-gray-900 dark:bg-gray-700 dark:text-white">
                    Zachariah Ayers
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" aria-hidden />
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>
                  <span className="text-gray-900 dark:text-white">{caseStudy.timeline.role}</span>
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Collapsible title="Description" delay={0.1}>
                  <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Business Context
                      </h3>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {requirements.businessContext}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Problem Statement
                      </h3>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                        {requirements.problemStatement}
                      </p>
                    </div>
                    {requirements.businessValue.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          Business Value
                        </h3>
                        <ul className="space-y-2">
                          {requirements.businessValue.map((value) => (
                            <li key={value} className="flex items-start gap-2">
                              <Zap
                                className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400"
                                aria-hidden
                              />
                              <span className="font-medium text-gray-800 dark:text-gray-300">
                                {value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Collapsible>

                {requirements.acceptanceCriteria.length > 0 && (
                  <Collapsible title="Acceptance Criteria" delay={0.2}>
                    <ul className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                      {requirements.acceptanceCriteria.map((criterion) => (
                        <li key={criterion} className="flex items-start gap-3">
                          <CheckCircle2
                            className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
                            aria-hidden
                          />
                          <span className="font-medium text-gray-800 dark:text-gray-300">
                            {criterion}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Collapsible>
                )}

                {requirements.attachments.length > 0 && (
                  <Collapsible title="Attachments" delay={0.3}>
                    <ul className="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 dark:bg-gray-800/50">
                      {requirements.attachments.map((attachment) => (
                        <li
                          key={attachment.label}
                          className="flex items-center gap-3 rounded-sm bg-gray-900 p-3"
                        >
                          <Paperclip className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
                          <div className="flex-1">
                            <p className="text-sm text-white">{attachment.label}</p>
                            <p className="text-xs text-gray-400">
                              {[attachment.type, attachment.size ?? attachment.description]
                                .filter(Boolean)
                                .join(' • ')}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Collapsible>
                )}

                {caseStudy.activity.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="border-t border-gray-300 pt-6 dark:border-gray-800"
                  >
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                      <MessageSquare className="h-5 w-5" aria-hidden />
                      Activity
                    </h3>
                    <ul className="space-y-4">
                      {caseStudy.activity.map((item) => (
                        <li key={`${item.author}-${item.time}`} className="flex gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                            {item.avatar}
                          </span>
                          <div className="flex-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                            <p className="mb-2 flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {item.author}
                              </span>
                              <span className="text-xs text-gray-500">{item.time}</span>
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">{item.comment}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                )}
              </div>

              <aside className="space-y-6">
                <motion.dl
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3 rounded-lg bg-gray-100 p-4 dark:bg-gray-800/50"
                >
                  <h3 className="text-sm font-medium text-gray-600 uppercase dark:text-gray-400">
                    Details
                  </h3>
                  <Detail label="Type">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-400" aria-hidden /> Story
                    </span>
                  </Detail>
                  <Detail label="Year">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" aria-hidden />{' '}
                      {caseStudy.timeline.year}
                    </span>
                  </Detail>
                  <Detail label="Duration">{caseStudy.timeline.duration}</Detail>
                </motion.dl>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800/50"
                >
                  <h3 className="text-sm font-medium text-gray-600 uppercase dark:text-gray-400">
                    Labels
                  </h3>
                  <p className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-600 dark:text-blue-400">
                      {caseStudy.hero.badge}
                    </span>
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-600 dark:text-purple-400">
                      {caseStudy.category}
                    </span>
                  </p>
                </motion.div>
              </aside>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
