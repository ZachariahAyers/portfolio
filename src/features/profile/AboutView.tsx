import { Briefcase, Code, ExternalLink, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Profile } from '../../../shared/content.ts';
import { Tooltip } from '../../components/Tooltip.tsx';
import { TypingDots } from '../../components/TypingDots.tsx';
import { fetchStrengths, fetchSummary } from '../chat/chatClient.ts';
import { TypedBullets, TypedParagraph } from './TypedText.tsx';

interface AboutViewProps {
  profile: Profile;
  /** What the visitor has asked about, used to tailor the summary. */
  interests: string[];
  onContact: () => void;
}

/** "Me": who Zach is, with a summary and strengths tailored to the visitor when the assistant is available. */
export function AboutView({ profile, interests, onContact }: AboutViewProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [strengths, setStrengths] = useState<string[] | null>(null);
  const [requestInterests] = useState(interests);

  useEffect(() => {
    let active = true;
    fetchSummary(requestInterests)
      .catch(() => profile.personal.executiveSummary[0] ?? '')
      .then((text) => active && setSummary(text))
      .catch(() => undefined);
    fetchStrengths(requestInterests)
      .catch(() => profile.personal.whatIBring)
      .then((bullets) => active && setStrengths(bullets))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [profile, requestInterests]);

  const contactLink = 'flex items-center gap-2 text-blue-400 hover:text-blue-300';

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:flex-row">
        <img
          src={profile.personal.avatarPath}
          alt={profile.personal.name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover shadow-xl"
        />
        <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 max-sm:text-xl md:text-3xl dark:text-white">
            {profile.personal.name}
          </h2>
          <p className="text-base text-gray-700 max-sm:text-sm md:text-lg md:whitespace-nowrap dark:text-gray-300">
            {profile.personal.title}
          </p>
          <p className="mt-1 text-sm text-blue-400 italic">{profile.personal.tagline}</p>
        </div>
        <section className="w-full rounded-lg bg-gray-100 p-4 max-sm:p-3 lg:w-auto lg:min-w-[280px] lg:shrink-0 dark:bg-gray-800/50">
          <h3 className="mb-3 text-base font-bold text-gray-900 md:text-lg dark:text-white">
            Connect With Me
          </h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Tooltip content="Send me a message">
              <button type="button" onClick={onContact} className={contactLink}>
                <ExternalLink size={14} aria-hidden /> {profile.contact.email}
              </button>
            </Tooltip>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLink}
            >
              <ExternalLink size={14} aria-hidden /> LinkedIn Profile
            </a>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLink}
            >
              <Code size={14} aria-hidden /> GitHub Portfolio
            </a>
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-blue-400 bg-linear-to-r from-blue-100 to-green-100 p-4 md:p-6 dark:border-blue-500/30 dark:from-blue-900/20 dark:to-green-900/20">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
          <Briefcase className="text-blue-400" aria-hidden /> Executive Summary
        </h3>
        {summary === null ? (
          <TypingDots dotClass="bg-blue-400" />
        ) : (
          <TypedParagraph key={summary} text={summary} />
        )}
      </section>

      <section className="rounded-lg border border-purple-400 bg-linear-to-r from-purple-100 to-blue-100 p-4 max-sm:p-3 md:p-6 dark:border-purple-500/30 dark:from-purple-900/20 dark:to-blue-900/20">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 max-sm:text-lg md:text-2xl dark:text-white">
          <Zap className="text-purple-400" aria-hidden /> What I Can Bring to Your Team
        </h3>
        {strengths === null ? (
          <TypingDots dotClass="bg-purple-400" />
        ) : (
          <TypedBullets key={strengths.join('\n')} bullets={strengths} />
        )}
      </section>
    </div>
  );
}
