import React, { useState } from 'react';
import { FileText, TrendingUp, DollarSign, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './dashboard.css';

const ResultsTab = ({ section, caseStudyId = 'report' }) => {
  const [activeSection, setActiveSection] = useState(0); // Start with Business Impact expanded (now at index 0)
  
  if (!section) return null;

  // Stagger animation for rows
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full p-8 bg-gray-200 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-thin mb-2">Business Results</h2>
        <p className="text-gray-600 dark:text-gray-400">These are the actual metrics and ROI I delivered - the same results I'll bring to your company</p>
      </motion.div>

      {/* Report Content */}
      <div className="flex-1 overflow-auto dashboard-scroll">
        {/* Report Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 border border-gray-300 dark:border-gray-700 rounded-t-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generated Report • {new Date().toLocaleDateString()}</p>
              </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400">Live Data</span>
          </div>
        </div>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-100 dark:bg-gray-800 border-x border-gray-300 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">Executive Summary</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.executive_summary}</p>
      </motion.div>

      {/* Report Body */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-b-lg overflow-hidden">
        {section.sections?.map((reportSection, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="border-b border-gray-300 dark:border-gray-700 last:border-b-0"
          >
            {/* Section Header */}
            <div
              className="bg-gray-50 dark:bg-gray-850 px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              onClick={() => setActiveSection(activeSection === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-3">
                  {idx === 0 && <Users className="w-5 h-5 text-blue-400" />}
                  {idx === 1 && <DollarSign className="w-5 h-5 text-yellow-400" />}
                  {idx === 2 && <TrendingUp className="w-5 h-5 text-green-400" />}
                  {reportSection.title}
                </h3>
                <motion.div
                  animate={{ rotate: activeSection === idx ? 180 : 0 }}
                  className="text-gray-600 dark:text-gray-500"
                >
                  ▼
                </motion.div>
              </div>
            </div>

            {/* Section Content */}
            <motion.div
              initial={false}
              animate={{
                height: activeSection === idx ? 'auto' : 0,
                opacity: activeSection === idx ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-white dark:bg-gray-850">
                {/* Metrics Table */}
                {reportSection.metrics && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="overflow-x-auto"
                  >
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Metric</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Before</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">After</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportSection.metrics.map((metric, i) => (
                          <motion.tr
                            key={i}
                            variants={rowVariants}
                            className="border-b border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{metric.metric}</td>
                            <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400 font-mono">
                              {metric.before}
                            </td>
                            <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300 font-mono">
                              {metric.after}
                            </td>
                            <td className="py-3 px-4 text-sm text-right">
                              <span className={`font-mono px-2 py-1 rounded text-xs ${
                                metric.change.startsWith('-')
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}>
                                {metric.change}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {/* Highlights List */}
                {reportSection.highlights && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {reportSection.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        variants={rowVariants}
                        className="flex items-start gap-3 p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Summary Text */}
                {reportSection.summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-4 bg-linear-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-lg border border-blue-300 dark:border-blue-500/30"
                  >
                    <p className="text-lg text-blue-700 dark:text-blue-300 font-medium">{reportSection.summary}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Report Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center text-xs text-gray-600 dark:text-gray-500"
      >
        <p>Report ID: {caseStudyId}-{Date.now().toString(36).toUpperCase()}</p>
      </motion.div>
      </div>
    </div>
  );
};

export default ResultsTab;
