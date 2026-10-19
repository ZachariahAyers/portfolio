import { Brain, Filter } from 'lucide-react';
import { useState } from 'react';
import { FilterChip } from '../../components/FilterChip.tsx';
import type { Profile } from '../../content/schema.ts';
import { ALL_SKILLS, filterSkills, type SkillFilter, skillCount } from './skills.ts';

export function SkillsView({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<SkillFilter>(ALL_SKILLS);
  const visible = filterSkills(profile.skills, filter);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-lg border border-purple-400 bg-linear-to-r from-purple-100 to-blue-100 p-4 max-sm:p-3 md:p-6 dark:border-purple-500/30 dark:from-purple-900/20 dark:to-blue-900/20">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900 max-sm:text-2xl dark:text-white">
          <Brain className="text-purple-400" aria-hidden />
          Skills
        </h2>
        <p className="mt-2 text-center text-base text-gray-700 max-sm:text-sm dark:text-gray-300">
          {profile.personal.headline}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-1 sm:gap-2">
          <FilterChip
            active={filter.category === null}
            color="purple"
            onClick={() => setFilter((f) => ({ ...f, category: null }))}
            tooltip="Show every category"
          >
            All ({skillCount(profile.skills)})
          </FilterChip>
          {profile.skills.map(({ category, items }) => (
            <FilterChip
              key={category}
              active={filter.category === category}
              color="purple"
              onClick={() => setFilter((f) => ({ ...f, category }))}
              tooltip={`Show ${category}`}
            >
              {category} ({items.length})
            </FilterChip>
          ))}
        </div>
      </section>

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visible.map(({ category, items }) => (
          <section
            key={category}
            className="rounded-lg border border-gray-300 bg-gray-100 p-4 dark:border-gray-700/50 dark:bg-gray-800/40"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{category}</h3>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">No skills match that search.</p>
          <button
            type="button"
            onClick={() => setFilter(ALL_SKILLS)}
            className="mt-2 text-purple-400 hover:text-purple-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
