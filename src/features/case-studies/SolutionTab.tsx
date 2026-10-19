import { FileCode2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { loadDiagram } from '../../content/caseStudies.ts';
import { TabHeading } from './TabHeading.tsx';

type DiagramState = 'loading' | 'ready' | 'missing' | 'failed';

async function renderDiagram(elementId: string, source: string): Promise<string> {
  const { default: mermaid } = await import('mermaid');
  // Dagre layout and the classic look keep the diagrams as they were authored.
  mermaid.initialize({ startOnLoad: false, theme: 'default', layout: 'dagre', look: 'classic' });
  const { svg } = await mermaid.render(elementId, source);
  return svg;
}

/** The architecture diagram, rendered with Mermaid. */
export function SolutionTab({ caseStudyId }: { caseStudyId: string }) {
  const container = useRef<HTMLDivElement>(null);
  const elementId = `diagram-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const [state, setState] = useState<DiagramState>('loading');

  useEffect(() => {
    let active = true;
    loadDiagram(caseStudyId)
      .then(async (source) => {
        if (!source) return active && setState('missing');
        const svg = await renderDiagram(elementId, source);
        if (!active || !container.current) return;
        // Mermaid's output is sanitised by its default strict security level.
        container.current.innerHTML = svg;
        setState('ready');
      })
      .catch(() => active && setState('failed'));
    return () => {
      active = false;
    };
  }, [caseStudyId, elementId]);

  return (
    <div className="flex h-full flex-col overflow-auto bg-gray-200 p-4 md:p-8 dark:bg-gray-900">
      <TabHeading
        title="Technical Architecture"
        subtitle="This is how I architect solutions - the same technical thinking I'd bring to your team"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-1 items-center justify-center"
      >
        <div className="mermaid-scroll-container h-[60vh] w-full max-w-7xl touch-pan-x touch-pan-y overflow-auto rounded-lg border border-gray-400 bg-[#fffae6] p-4 md:p-8 dark:border-gray-600">
          {state === 'loading' && (
            <div className="flex h-full items-center justify-center">
              <FileCode2
                className="h-8 w-8 animate-spin text-blue-600"
                aria-label="Loading diagram"
              />
            </div>
          )}
          {state === 'missing' && (
            <p className="text-center text-gray-700">
              No diagram has been published for this project.
            </p>
          )}
          {state === 'failed' && (
            <p className="text-center text-red-600">The diagram could not be rendered.</p>
          )}
          <div ref={container} className="mermaid-container" />
        </div>
      </motion.div>
      <p className="mt-8 text-center text-xs text-gray-600 dark:text-gray-500">
        Technical Specification • Rendered with Mermaid
      </p>
    </div>
  );
}
