import { ExternalLink, FileText, Folder, FolderOpen, X } from 'lucide-react';
import { useState } from 'react';
import type { CaseStudy } from '../../../shared/content.ts';
import { cx } from '../../lib/cx.ts';
import { useIsMobile } from '../../lib/useMediaQuery.ts';
import { CodeBlock } from './CodeBlock.tsx';
import { closeTab, type OpenFile } from './explorerTabs.ts';

type Files = CaseStudy['techStackAnalyzer']['fileStructure'];

/** An editor-style browser for a case study's code samples. */
export function StackExplorer({ files }: { files: Files }) {
  const isMobile = useIsMobile();
  const [openFolders, setOpenFolders] = useState<ReadonlySet<string>>(
    () => new Set(Object.keys(files)),
  );
  const [tabs, setTabs] = useState<OpenFile[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const current = tabs.find((tab) => tab.path === active);

  const toggleFolder = (folder: string) =>
    setOpenFolders((open) => {
      const next = new Set(open);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });

  const open = (file: OpenFile) => {
    setTabs((existing) =>
      existing.some((t) => t.path === file.path) ? existing : [...existing, file],
    );
    setActive(file.path);
    setSidebarOpen(false);
  };

  const close = (path: string) => {
    const next = closeTab(tabs, active, path);
    setTabs(next.tabs);
    setActive(next.active);
  };

  return (
    <div className="relative flex h-full">
      {isMobile && (
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Show files"
          className="absolute top-2 left-2 z-50 rounded-sm bg-gray-200 p-2 text-black dark:bg-gray-700 dark:text-white"
        >
          <Folder className="h-5 w-5" aria-hidden />
        </button>
      )}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cx(
          'dashboard-scroll w-64 overflow-y-auto border-r border-gray-300 bg-[#f3f3f3] dark:border-gray-700 dark:bg-gray-800',
          isMobile && 'absolute inset-y-0 left-0 z-40 transition-transform',
          isMobile && !sidebarOpen && '-translate-x-full',
        )}
      >
        <p className="p-2 text-xs font-semibold text-gray-600 dark:text-gray-400">EXPLORER</p>
        <ul className="px-2">
          {Object.entries(files).map(([folder, samples]) => {
            const expanded = openFolders.has(folder);
            return (
              <li key={folder} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleFolder(folder)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-1 py-1 text-left text-sm text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {expanded ? (
                    <FolderOpen className="h-4 w-4 text-yellow-600" aria-hidden />
                  ) : (
                    <Folder className="h-4 w-4 text-yellow-600" aria-hidden />
                  )}
                  {folder}
                </button>
                {expanded && (
                  <ul className="ml-4">
                    {samples.map((sample) => {
                      if (typeof sample === 'string') {
                        return (
                          <li
                            key={sample}
                            className="px-2 py-1 text-sm text-gray-500 italic dark:text-gray-400"
                          >
                            {sample}
                          </li>
                        );
                      }
                      const path = `${folder}/${sample.name}`;
                      return (
                        <li key={path}>
                          <button
                            type="button"
                            onClick={() => open({ path, folder, ...sample })}
                            className={cx(
                              'flex w-full items-center gap-2 px-2 py-1 text-left text-sm text-gray-700 dark:text-gray-300',
                              active === path
                                ? 'bg-gray-300 dark:bg-gray-700'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700',
                            )}
                          >
                            <FileText className="h-4 w-4 shrink-0 text-blue-500" aria-hidden />
                            {sample.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div
          className="flex overflow-x-auto border-b border-gray-300 bg-[#f3f3f3] dark:border-gray-700 dark:bg-gray-800"
          role="tablist"
        >
          {tabs.map((tab) => (
            <div
              key={tab.path}
              className={cx(
                'flex items-center gap-2 border-r border-gray-300 px-3 py-2 dark:border-gray-700',
                active === tab.path
                  ? 'bg-white text-black dark:bg-gray-900 dark:text-white'
                  : 'bg-[#f3f3f3] text-gray-600 dark:bg-gray-800 dark:text-gray-400',
              )}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active === tab.path}
                onClick={() => setActive(tab.path)}
                className="text-sm whitespace-nowrap"
              >
                {tab.name}
              </button>
              <button
                type="button"
                onClick={() => close(tab.path)}
                aria-label={`Close ${tab.name}`}
                className="rounded-sm hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        <div className="dashboard-scroll flex-1 overflow-auto bg-white p-4 dark:bg-gray-900">
          {current ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {current.tech}
                </h3>
                {current.docUrl && (
                  <a
                    href={current.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-gray-100 px-3 py-1 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    View Documentation
                  </a>
                )}
              </div>
              <CodeBlock code={current.code} />
            </>
          ) : (
            <p className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
              Select a file to view code
            </p>
          )}
        </div>

        <div className="flex h-6 items-center justify-between bg-[#f3f3f3] px-4 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <span>UTF-8</span>
          <span>{current ? current.path : 'No file open'}</span>
          <span>{current ? `${current.code.split('\n').length} lines` : ''}</span>
        </div>
      </div>
    </div>
  );
}
