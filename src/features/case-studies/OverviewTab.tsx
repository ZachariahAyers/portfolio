import { CheckCircle2, Code, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { CaseStudy } from '../../content/schema.ts';
import { TabHeading } from './TabHeading.tsx';

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mb-1 text-xs text-gray-500">{label}</dt>
      <dd className="text-gray-900 dark:text-white">{children}</dd>
    </div>
  );
}

const link = 'flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400';

/** What the project is, what was delivered, and with what. */
export function OverviewTab({ caseStudy }: { caseStudy: CaseStudy }) {
  const { links } = caseStudy;
  return (
    <div className="flex h-full flex-col bg-gray-200 p-4 md:p-8 dark:bg-gray-900">
      <TabHeading title={caseStudy.title} subtitle={caseStudy.tagline} />
      <div className="dashboard-scroll flex-1 overflow-auto">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 rounded-lg border border-gray-300 bg-gray-100 p-6 lg:grid-cols-3 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-6 lg:col-span-2">
            <section>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Context</h3>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {caseStudy.context}
              </p>
            </section>
            <section>
              <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">Delivered</h3>
              <ul className="space-y-3">
                {caseStudy.delivered.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" aria-hidden />
                    <span className="text-gray-800 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <dl className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <Detail label="Organization">{caseStudy.organization}</Detail>
              <Detail label="Role">{caseStudy.role}</Detail>
              <Detail label="When">{caseStudy.period}</Detail>
              {(links.live ?? links.github) && (
                <Detail label="Links">
                  <span className="flex flex-col gap-1">
                    {links.live && (
                      <a
                        href={links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={link}
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden /> Live site
                      </a>
                    )}
                    {links.github && (
                      <a
                        href={links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={link}
                      >
                        <Code className="h-4 w-4" aria-hidden /> Source
                      </a>
                    )}
                  </span>
                </Detail>
              )}
            </dl>
            <section className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <h3 className="mb-3 text-sm font-medium text-gray-600 uppercase dark:text-gray-400">
                Stack
              </h3>
              <ul className="flex flex-wrap gap-2">
                {caseStudy.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-700 dark:text-blue-300"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </motion.article>
      </div>
    </div>
  );
}
