import {
  Briefcase,
  Building,
  Code,
  FileText,
  Filter,
  Globe,
  type LucideIcon,
  Package,
  Rocket,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { Profile, ProjectType } from '../../../shared/content.ts';
import { type ChipColor, FilterChip } from '../../components/FilterChip.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';
import { cx } from '../../lib/cx.ts';
import {
  ALL_PROJECTS,
  countByType,
  filterProjects,
  flattenProjects,
  type ProjectEntry,
  type ProjectFilter,
  projectStats,
  techOptions,
} from './projects.ts';

const VISIBLE_TECH_FILTERS = 10;
const VISIBLE_TECH_TAGS = 5;
const LONG_DESCRIPTION = 120;

const TYPES: Record<
  ProjectType,
  {
    label: string;
    tooltip: string;
    icon: LucideIcon;
    color: ChipColor;
    card: string;
    badge: string;
  }
> = {
  enterprise: {
    label: 'Enterprise',
    tooltip: 'Show large-scale corporate projects',
    icon: Building,
    color: 'purple',
    card: 'from-purple-50 to-pink-50 border-purple-500 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-500/30',
    badge: 'text-purple-400',
  },
  freelance: {
    label: 'Freelance',
    tooltip: 'Show freelance client projects',
    icon: Briefcase,
    color: 'amber',
    card: 'from-amber-50 to-orange-50 border-amber-500 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-500/30',
    badge: 'text-amber-400',
  },
  leadership: {
    label: 'Leadership',
    tooltip: 'Show leadership and organizational impact projects',
    icon: Code,
    color: 'green',
    card: 'from-green-50 to-emerald-50 border-green-500 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-500/30',
    badge: 'text-green-400',
  },
  opensource: {
    label: 'Open Source',
    tooltip: 'Show open source contributions',
    icon: Package,
    color: 'blue',
    card: 'from-blue-50 to-cyan-50 border-blue-500 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-500/30',
    badge: 'text-blue-400',
  },
};

const CURRENT_CARD =
  'from-green-50 via-cyan-50 to-yellow-50 border-green-500 ring-2 ring-green-400/60 shadow-lg shadow-green-400/10 dark:from-cyan-900/30 dark:via-cyan-800/25 dark:to-yellow-700/20 dark:border-green-500/40';

const link = 'flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300';

export function ProjectsView({ profile }: { profile: Profile }) {
  const projects = useMemo(() => flattenProjects(profile.projects), [profile.projects]);
  const [filter, setFilter] = useState<ProjectFilter>(ALL_PROJECTS);
  const [showAllTechs, setShowAllTechs] = useState(false);

  const stats = projectStats(projects);
  const typeCounts = countByType(projects, filter.tech);
  const techs = techOptions(projects, filter.type);
  const visible = filterProjects(projects, filter);
  const inType =
    filter.type === 'all' ? projects.length : projects.filter((p) => p.type === filter.type).length;

  const chooseType = (type: ProjectFilter['type']) =>
    setFilter((f) => ({ ...f, type, currentOnly: false }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-lg border border-blue-400 bg-linear-to-r from-blue-100 to-purple-100 p-4 md:p-6 dark:border-blue-500/30 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="space-y-4 text-center">
          <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900 max-sm:text-2xl dark:text-white">
            <Rocket className="text-blue-400" aria-hidden />
            Projects & Creations
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-700 max-sm:text-sm md:text-lg dark:text-gray-300">
            From enterprise transformations to open-source contributions
          </p>
          <dl className="flex flex-wrap justify-center gap-2 text-xs md:gap-4 md:text-sm">
            {[
              ['Total', stats.total],
              ['With Source', stats.withSource],
              ['Live Deployments', stats.live],
              ['Case Studies', stats.caseStudies],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex gap-1 rounded-lg bg-gray-200 px-2 py-0.5 sm:px-3 sm:py-1 dark:bg-gray-800/50"
              >
                <dt className="text-gray-600 dark:text-gray-400">{label}:</dt>
                <dd className="font-bold text-gray-900 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-1 sm:gap-2">
          <FilterChip
            active={filter.type === 'all' && !filter.currentOnly}
            onClick={() => chooseType('all')}
            tooltip="Show all project types"
          >
            All Types
          </FilterChip>
          <FilterChip
            active={filter.currentOnly}
            color="green"
            onClick={() => setFilter((f) => ({ ...f, type: 'all', currentOnly: !f.currentOnly }))}
            tooltip="Show projects I'm actively working on"
          >
            <Zap className="h-3 w-3" aria-hidden />
            Current Focus ({stats.current})
          </FilterChip>
          {(['enterprise', 'freelance', 'leadership', 'opensource'] as const).map((type) => (
            <FilterChip
              key={type}
              active={filter.type === type && !filter.currentOnly}
              color={TYPES[type].color}
              onClick={() => chooseType(type)}
              tooltip={TYPES[type].tooltip}
            >
              {TYPES[type].label} ({typeCounts[type]})
            </FilterChip>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-gray-200 p-4 dark:bg-gray-800/30">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400">
          <Filter className="h-4 w-4" aria-hidden />
          Filter by Technology
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <FilterChip
            active={filter.tech === null}
            onClick={() => setFilter((f) => ({ ...f, tech: null }))}
            tooltip="Show projects using any technology"
          >
            All ({inType})
          </FilterChip>
          {techs
            .slice(0, showAllTechs ? undefined : VISIBLE_TECH_FILTERS)
            .map(({ tech, count }) => (
              <FilterChip
                key={tech}
                active={filter.tech === tech}
                onClick={() => setFilter((f) => ({ ...f, tech }))}
                tooltip={`Filter by ${tech} projects`}
              >
                {tech} ({count})
              </FilterChip>
            ))}
          {techs.length > VISIBLE_TECH_FILTERS && (
            <FilterChip
              active={false}
              onClick={() => setShowAllTechs((s) => !s)}
              tooltip={
                showAllTechs ? 'Show fewer technology filters' : 'Show all available technologies'
              }
            >
              {showAllTechs ? 'Show less' : `Show ${techs.length - VISIBLE_TECH_FILTERS} more`}
            </FilterChip>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No projects match these filters.</p>
          <button
            type="button"
            onClick={() => setFilter(ALL_PROJECTS)}
            className="mt-2 text-blue-400 hover:text-blue-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectEntry }) {
  const [expanded, setExpanded] = useState(false);
  const type = TYPES[project.type];
  const Icon = type.icon;

  return (
    <article
      className={cx(
        'flex flex-col rounded-lg border bg-transparent p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg max-sm:p-3 md:p-5 dark:bg-linear-to-br',
        project.current ? CURRENT_CARD : type.card,
      )}
    >
      <div className="grow">
        <div className="mb-3 flex items-start justify-between">
          <h4 className="flex flex-1 items-center gap-2 text-base font-bold text-gray-900 max-sm:text-sm md:text-lg dark:text-white">
            <Icon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden />
            {project.name}
          </h4>
          {project.current && (
            <span className="flex items-center gap-1 rounded-full border border-green-400/30 bg-green-600/20 px-2 py-1 text-xs font-medium text-green-400">
              <Zap className="h-3 w-3" aria-hidden />
              Current Focus
            </span>
          )}
        </div>
        <div className="mb-3 h-40 w-full overflow-hidden rounded-md bg-gray-800">
          <img src={project.image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <p
          className={cx(
            'mb-3 text-sm text-gray-700 dark:text-gray-300',
            !expanded && 'line-clamp-2',
          )}
        >
          {project.description}
        </p>
        {project.description.length > LONG_DESCRIPTION && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="mb-3 text-xs text-blue-400 hover:text-blue-300"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
        {project.impact && (
          <p className="mb-3 rounded-md bg-green-100 px-3 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <span className="font-semibold">Impact:</span> {project.impact}
          </p>
        )}
        {project.technologies.length > 0 && (
          <ul className="mb-3 flex flex-wrap gap-1">
            {project.technologies.slice(0, VISIBLE_TECH_TAGS).map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
              >
                {tech}
              </li>
            ))}
            {project.technologies.length > VISIBLE_TECH_TAGS && (
              <li className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
                +{project.technologies.length - VISIBLE_TECH_TAGS} more
              </li>
            )}
          </ul>
        )}
      </div>
      <footer className="mt-auto flex flex-wrap gap-3 border-t border-gray-700/50 pt-3">
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className={link}>
            <Globe className="h-3 w-3" aria-hidden />
            Live Deployment
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={link}>
            <Code className="h-3 w-3" aria-hidden />
            Source
          </a>
        )}
        {project.caseStudy && (
          <Tooltip content={`Read the ${project.name} case study`}>
            <Link to={project.caseStudy} className={link}>
              <FileText className="h-3 w-3" aria-hidden />
              Case Study
            </Link>
          </Tooltip>
        )}
        <span className={cx('ml-auto flex items-center gap-1 text-xs', type.badge)}>
          <Icon className="h-3 w-3" aria-hidden />
          {type.label}
        </span>
      </footer>
    </article>
  );
}
