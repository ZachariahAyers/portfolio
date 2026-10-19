import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { TabHeading } from './TabHeading.tsx';

const list = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const row = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

/** What the work achieved, as written in the records. */
export function ResultsTab({ title, results }: { title: string; results: string[] }) {
  return (
    <div className="flex h-full flex-col bg-gray-200 p-8 dark:bg-gray-900">
      <TabHeading title="Results" subtitle={title} />
      <div className="dashboard-scroll flex-1 overflow-auto">
        <motion.ul
          variants={list}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl space-y-3"
        >
          {results.map((result) => (
            <motion.li
              key={result}
              variants={row}
              className="flex items-start gap-3 rounded-lg bg-gray-100 p-4 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-400" aria-hidden />
              {result}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
