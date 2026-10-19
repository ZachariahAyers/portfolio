import { Briefcase, Code, ExternalLink, GraduationCap, Mail } from 'lucide-react';
import type { Profile } from '../../content/schema.ts';
import { asset } from '../../lib/asset.ts';

const contactLink = 'flex items-center gap-2 text-blue-400 hover:text-blue-300';
const heading =
  'mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-white';

/** "Me": who Zach is, his summary, his experience and his education. */
export function AboutView({ profile }: { profile: Profile }) {
  const { personal, contact } = profile;
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:flex-row">
        <img
          src={asset(personal.avatarPath)}
          alt={personal.name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover shadow-xl"
        />
        <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 max-sm:text-xl md:text-3xl dark:text-white">
            {personal.name}
          </h2>
          <p className="text-base text-gray-700 max-sm:text-sm md:text-lg dark:text-gray-300">
            {personal.title} | {personal.headline}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {personal.location} | {personal.workPreference}
          </p>
        </div>
        <section className="w-full rounded-lg bg-gray-100 p-4 max-sm:p-3 lg:w-auto lg:min-w-[280px] lg:shrink-0 dark:bg-gray-800/50">
          <h3 className="mb-3 text-base font-bold text-gray-900 md:text-lg dark:text-white">
            Connect With Me
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <a href={`mailto:${contact.email}`} className={contactLink}>
              <Mail size={14} aria-hidden /> {contact.email}
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLink}
            >
              <ExternalLink size={14} aria-hidden /> LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLink}
            >
              <Code size={14} aria-hidden /> GitHub
            </a>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-blue-400 bg-linear-to-r from-blue-100 to-green-100 p-4 md:p-6 dark:border-blue-500/30 dark:from-blue-900/20 dark:to-green-900/20">
        <h3 className={heading}>
          <Briefcase className="text-blue-400" aria-hidden /> Summary
        </h3>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">{personal.summary}</p>
      </section>

      <section className="rounded-lg bg-gray-100 p-4 md:p-6 dark:bg-gray-800/50">
        <h3 className={heading}>Experience</h3>
        <ol className="space-y-6">
          {profile.experience.map((job) => (
            <li key={job.organization} className="border-l-2 border-blue-400 pl-4">
              <h4 className="font-bold text-gray-900 dark:text-white">
                {job.organization}{' '}
                <span className="font-normal text-gray-600 dark:text-gray-400">
                  | {job.location}
                </span>
              </h4>
              {job.roles.map((role) => (
                <p key={role.title} className="text-sm text-gray-700 dark:text-gray-300">
                  {role.title} | {role.period}
                </p>
              ))}
              {job.summary && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{job.summary}</p>
              )}
              {job.engagements?.map((engagement) => (
                <div key={engagement.name} className="mt-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {engagement.name} | {engagement.period}
                  </p>
                  <Highlights items={engagement.highlights} />
                </div>
              ))}
              {job.highlights && <Highlights items={job.highlights} />}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg bg-gray-100 p-4 md:p-6 dark:bg-gray-800/50">
        <h3 className={heading}>
          <GraduationCap className="text-purple-400" aria-hidden /> Education
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {profile.education.map((school) => (
            <li key={school.institution}>
              <span className="font-semibold text-gray-900 dark:text-white">
                {school.institution}:
              </span>{' '}
              {school.detail}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
