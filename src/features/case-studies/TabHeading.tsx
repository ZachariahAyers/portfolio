import { motion } from 'motion/react';

export function TabHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      <h2 className="mb-2 text-2xl font-thin md:text-3xl">{title}</h2>
      <p className="px-4 text-sm text-gray-600 md:px-0 md:text-base dark:text-gray-400">
        {subtitle}
      </p>
    </motion.div>
  );
}
