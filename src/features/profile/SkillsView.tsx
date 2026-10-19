import {
  Award,
  Brain,
  Briefcase,
  Building,
  ChevronDown,
  Cloud,
  Code,
  Database,
  Filter,
  Globe,
  Layers,
  type LucideIcon,
  Package,
  Rocket,
  Wrench,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { type Profile, SKILL_LEVELS, type SkillLevel } from '../../../shared/content.ts';
import { type ChipColor, FilterChip } from '../../components/FilterChip.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';
import { cx } from '../../lib/cx.ts';
import {
  ALL_SKILLS,
  categories,
  categoryTotals,
  certificationGroups,
  countByCategory,
  countByLevel,
  filterSkills,
  flattenSkills,
  type SkillFilter,
} from './skills.ts';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  languages: Code,
  frontend: Globe,
  backend: Database,
  cloud: Cloud,
  infrastructure: Building,
  aiMl: Brain,
  databases: Database,
  architecture: Rocket,
  testing: Award,
  frameworks: Package,
  tools: Briefcase,
  others: Zap,
};

const iconFor = (category: string) => CATEGORY_ICONS[category] ?? Code;

const LEVELS: Record<
  SkillLevel,
  {
    color: ChipColor;
    icon: LucideIcon;
    iconClass: string;
    accent: string;
    panel: string;
    bar: string;
  }
> = {
  expert: {
    color: 'blue',
    icon: Award,
    iconClass: 'text-yellow-400',
    accent: 'text-blue-400',
    panel:
      'from-blue-100 to-cyan-100 border-blue-400 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-500/30',
    bar: 'w-full bg-linear-to-r from-blue-500 to-cyan-500',
  },
  proficient: {
    color: 'green',
    icon: Zap,
    iconClass: 'text-green-400',
    accent: 'text-green-400',
    panel:
      'from-green-100 to-emerald-100 border-green-400 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-500/30',
    bar: 'w-3/4 bg-linear-to-r from-green-500 to-emerald-500',
  },
  familiar: {
    color: 'orange',
    icon: Package,
    iconClass: 'text-orange-400',
    accent: 'text-orange-400',
    panel:
      'from-orange-100 to-amber-100 border-orange-400 dark:from-orange-900/20 dark:to-amber-900/20 dark:border-orange-500/30',
    bar: 'w-1/2 bg-linear-to-r from-orange-500 to-amber-500',
  },
};

/** Overview cards. Each sums the listed skill categories. */
const OVERVIEW = [
  {
    title: 'Languages',
    note: 'Programming Languages',
    categories: ['languages'],
    icon: Code,
    tone: 'blue',
    tooltip: 'The coding languages I use to build software applications',
  },
  {
    title: 'Cloud & AI',
    note: 'Cloud / AI / Machine Learning',
    categories: ['cloud', 'aiMl'],
    icon: Cloud,
    tone: 'purple',
    tooltip: 'Cloud platforms and artificial intelligence tools I work with',
  },
  {
    title: 'Frontend',
    note: 'Design / Markup / UI Frameworks',
    categories: ['frontend'],
    icon: Globe,
    tone: 'green',
    tooltip: 'Technologies for creating user interfaces and web experiences',
  },
  {
    title: 'Backend',
    note: 'Servers / Databases',
    categories: ['backend', 'databases'],
    icon: Database,
    tone: 'orange',
    tooltip: 'Server-side technologies that power applications behind the scenes',
  },
  {
    title: 'DevOps',
    note: 'CI/CD & Infrastructure',
    categories: ['infrastructure'],
    icon: Layers,
    tone: 'indigo',
    tooltip: 'Tools and practices for automating software deployment and operations',
  },
  {
    title: 'Data Tools',
    note: 'Streaming & ML Pipelines',
    categories: ['tools'],
    icon: Wrench,
    tone: 'red',
    tooltip: 'Data streaming and machine learning pipeline tools',
  },
] as const;

const TONES = {
  blue: 'from-blue-100 to-cyan-100 border-blue-400 dark:from-blue-600/20 dark:to-cyan-600/20 dark:border-blue-500/30 text-blue-400',
  purple:
    'from-purple-100 to-pink-100 border-purple-400 dark:from-purple-600/20 dark:to-pink-600/20 dark:border-purple-500/30 text-purple-400',
  green:
    'from-green-100 to-emerald-100 border-green-400 dark:from-green-600/20 dark:to-emerald-600/20 dark:border-green-500/30 text-green-400',
  orange:
    'from-orange-100 to-amber-100 border-orange-400 dark:from-orange-600/20 dark:to-amber-600/20 dark:border-orange-500/30 text-orange-400',
  indigo:
    'from-indigo-100 to-blue-100 border-indigo-400 dark:from-indigo-600/20 dark:to-blue-600/20 dark:border-indigo-500/30 text-indigo-400',
  red: 'from-red-100 to-pink-100 border-red-400 dark:from-red-600/20 dark:to-pink-600/20 dark:border-red-500/30 text-red-400',
} as const;

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').trim();

export function SkillsView({ profile }: { profile: Profile }) {
  const skills = useMemo(() => flattenSkills(profile.skills), [profile.skills]);
  const certGroups = useMemo(() => certificationGroups(profile), [profile]);
  const [filter, setFilter] = useState<SkillFilter>(ALL_SKILLS);
  const [collapsed, setCollapsed] = useState<ReadonlySet<SkillLevel>>(new Set());
  const [showCertifications, setShowCertifications] = useState(false);

  const totals = categoryTotals(skills);
  const levelCounts = countByLevel(skills, filter);
  const categoryCounts = countByCategory(skills, filter);
  const visible = filterSkills(skills, filter);
  const certificationCount = certGroups.reduce((n, g) => n + g.certifications.length, 0);
  const filtering = filter.category !== null || filter.level !== 'all' || filter.query !== '';

  const toggleLevel = (level: SkillLevel) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-lg border border-purple-400 bg-linear-to-r from-purple-100 to-blue-100 p-4 max-sm:p-3 md:p-6 dark:border-purple-500/30 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="space-y-4 text-center">
          <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900 max-sm:text-2xl dark:text-white">
            <Brain className="text-purple-400" aria-hidden />
            Technical Skills & Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 max-sm:text-sm md:text-lg dark:text-gray-300">
            14+ years of building production systems across the full stack
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          <FilterChip
            active={filter.level === 'all'}
            color="purple"
            disabled={showCertifications}
            onClick={() => setFilter((f) => ({ ...f, level: 'all' }))}
            tooltip="Show skills from all proficiency levels"
          >
            All Levels
          </FilterChip>
          {SKILL_LEVELS.map((level) => (
            <FilterChip
              key={level}
              active={filter.level === level}
              color={LEVELS[level].color}
              disabled={showCertifications}
              onClick={() => setFilter((f) => ({ ...f, level }))}
              tooltip={`Show only ${level} level skills`}
            >
              <span className="capitalize">{level}</span> ({levelCounts[level]})
            </FilterChip>
          ))}
          <span className="mx-2 h-6 border-l border-gray-400 dark:border-gray-600" aria-hidden />
          <FilterChip
            active={showCertifications}
            color="purple"
            onClick={() => {
              setShowCertifications((s) => !s);
              setFilter(ALL_SKILLS);
            }}
            tooltip={showCertifications ? 'Show skills' : 'Show certifications and credentials'}
          >
            <Award className="h-3 w-3" aria-hidden />
            Certifications ({certificationCount})
          </FilterChip>
        </div>
      </section>

      {showCertifications ? (
        <Certifications groups={certGroups} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {OVERVIEW.map(({ title, note, categories: cats, icon: Icon, tone, tooltip }) => (
              <Tooltip key={title} content={tooltip}>
                <div
                  className={cx(
                    'flex h-full flex-col rounded-lg border bg-linear-to-br p-3 transition-transform hover:scale-[1.02]',
                    TONES[tone],
                  )}
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Icon className="h-4 w-4" aria-hidden />
                    {title}
                  </h3>
                  <p className="text-2xl font-bold">
                    {cats.reduce((n, c) => n + (totals.get(c) ?? 0), 0)}
                  </p>
                  <p className="mt-auto pt-1 text-xs text-gray-600 dark:text-gray-400">{note}</p>
                </div>
              </Tooltip>
            ))}
          </div>

          <section className="space-y-4 rounded-lg bg-gray-200 p-4 dark:bg-gray-800/30">
            <div className="relative">
              <input
                type="search"
                placeholder="Search skills..."
                value={filter.query}
                onChange={(event) => setFilter((f) => ({ ...f, query: event.target.value }))}
                aria-label="Search skills by name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 focus:ring-2 focus:ring-purple-500 focus:outline-hidden dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <Filter className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" aria-hidden />
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400">
                <Package className="h-4 w-4" aria-hidden />
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <FilterChip
                  active={filter.category === null}
                  color="purple"
                  onClick={() => setFilter((f) => ({ ...f, category: null }))}
                  tooltip="Show skills from all categories"
                >
                  All Categories
                </FilterChip>
                {categories(skills).map((category) => {
                  const Icon = iconFor(category);
                  return (
                    <FilterChip
                      key={category}
                      active={filter.category === category}
                      color="purple"
                      onClick={() => setFilter((f) => ({ ...f, category }))}
                      tooltip={`Filter by ${humanize(category)} skills`}
                    >
                      <Icon className="h-3 w-3" aria-hidden />
                      <span className="capitalize">{humanize(category)}</span> (
                      {categoryCounts.get(category) ?? 0})
                    </FilterChip>
                  );
                })}
              </div>
            </div>
          </section>

          {SKILL_LEVELS.map((level) => {
            const style = LEVELS[level];
            const LevelIcon = style.icon;
            const levelSkills = visible.filter((s) => s.level === level);
            const expanded = !collapsed.has(level);
            if (levelSkills.length === 0 && filtering) return null;
            return (
              <section
                key={level}
                className={cx(
                  'rounded-lg border bg-linear-to-br transition-all duration-200',
                  style.panel,
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleLevel(level)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-900/10"
                >
                  <span className="flex items-center gap-3">
                    <LevelIcon className={cx('h-6 w-6', style.iconClass)} aria-hidden />
                    <span>
                      <span className="block text-2xl font-bold text-gray-900 capitalize dark:text-white">
                        {level} Level
                      </span>
                      <span className="mt-1 block text-sm text-gray-600 dark:text-gray-400">
                        {profile.skills[level].description}
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className={cx('text-lg font-semibold', style.accent)}>
                      {levelSkills.length} skills
                    </span>
                    <ChevronDown
                      className={cx(
                        'h-5 w-5 text-gray-400 transition-transform',
                        expanded && 'rotate-180',
                      )}
                      aria-hidden
                    />
                  </span>
                </button>
                {expanded && levelSkills.length > 0 && (
                  <ul className="grid grid-cols-1 gap-3 px-6 pb-6 md:grid-cols-2 lg:grid-cols-3">
                    {levelSkills.map((skill) => {
                      const Icon = iconFor(skill.category);
                      return (
                        <li
                          key={`${skill.category}-${skill.name}`}
                          className="group relative overflow-hidden rounded-lg border border-gray-300 bg-gray-100 p-4 backdrop-blur-xs transition-all duration-200 hover:scale-[1.02] hover:border-gray-400 hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-900/20 dark:hover:border-gray-600/50"
                        >
                          <p className="mb-1 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                            <Icon
                              className={cx(
                                'h-4 w-4 transition-transform group-hover:scale-110',
                                style.accent,
                              )}
                              aria-hidden
                            />
                            {skill.name}
                          </p>
                          <p className="text-xs text-gray-600 capitalize dark:text-gray-400">
                            {humanize(skill.category)}
                          </p>
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-700/30">
                            <div className={cx('h-full', style.bar)} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}

          {visible.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No skills found matching your criteria.
              </p>
              <button
                type="button"
                onClick={() => setFilter(ALL_SKILLS)}
                className="mt-2 text-purple-400 hover:text-purple-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Certifications({ groups }: { groups: ReturnType<typeof certificationGroups> }) {
  return (
    <section className="rounded-lg border border-purple-400 bg-linear-to-br from-purple-100 to-pink-100 p-6 dark:border-purple-500/30 dark:from-purple-900/20 dark:to-pink-900/20">
      <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
        <Award className="h-6 w-6 text-purple-400" aria-hidden />
        Certifications & Credentials
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map(({ group, certifications }) => (
          <div key={group} className="space-y-3">
            <h4 className="text-lg font-semibold text-purple-400 capitalize">{humanize(group)}</h4>
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li
                  key={cert.name}
                  className={cx(
                    'rounded-lg border bg-gray-100 p-3 backdrop-blur-xs transition-all duration-200 hover:scale-[1.01] dark:bg-gray-900/20',
                    cert.inProgress
                      ? 'border-green-500/40 shadow-lg ring-2 shadow-green-400/10 ring-green-400/60'
                      : 'border-gray-300 hover:border-purple-400 dark:border-gray-700/50 dark:hover:border-purple-500/50',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex flex-1 items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      {cert.inProgress ? (
                        <Zap className="mt-0.5 h-3 w-3 shrink-0 text-green-400" aria-hidden />
                      ) : (
                        <span className="mt-0.5 text-purple-400" aria-hidden>
                          •
                        </span>
                      )}
                      {cert.name}
                    </p>
                    {cert.inProgress && (
                      <span className="flex items-center gap-1 rounded-full border border-green-400/30 bg-green-600/20 px-2 py-1 text-xs font-medium whitespace-nowrap text-green-400">
                        In Progress
                      </span>
                    )}
                  </div>
                  {cert.credentialId && (
                    <p className="mt-2 pl-5 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Credential ID:</span> {cert.credentialId}
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-purple-400 underline hover:text-purple-300"
                        >
                          Verify
                        </a>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
