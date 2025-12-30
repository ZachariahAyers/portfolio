import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, User, Calendar, Hash, Link2, Paperclip,
  MessageSquare, GitBranch, Tag, MoreHorizontal, ChevronDown, Zap, Bug, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import './dashboard.css';

const OverviewTab = ({ caseStudy }) => {
  const [showDescription, setShowDescription] = useState(true);
  const [showAcceptanceCriteria, setShowAcceptanceCriteria] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);
  
  // Generate Jira ticket data from case study
  const jiraPrefix = caseStudy.businessRequirements?.jiraPrefix || 'PROJ';
  const ticketId = `${jiraPrefix}-${Math.floor(Math.random() * 9000) + 1000}`;

  return (
    <div className="h-full flex flex-col bg-gray-200 dark:bg-gray-900 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-thin mb-2">Business Requirements</h2>
        <p className="text-gray-600 dark:text-gray-400">This shows the real business problem I was hired to solve - exactly like the requirements you'd give your team</p>
      </motion.div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto dashboard-scroll">
        <div className="max-w-6xl mx-auto">
        {/* Jira-style header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link2 className="w-4 h-4" />
            <span>Projects</span>
            <span>/</span>
            <span>{caseStudy.hero.category}</span>
            <span>/</span>
            <span className="text-gray-400">{ticketId}</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-6"
          >
            {/* Ticket header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    <span>Story</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-500">{ticketId}</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {caseStudy.hero.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-300 dark:border-gray-700">
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors">
                <Clock className="w-4 h-4" />
                <span>To Do</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Assignee:</span>
                  <button className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium text-gray-900 dark:text-white transition-colors">
                    Zachariah Ayers
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Sprint:</span>
                  <span className="text-gray-900 dark:text-white">Sprint {Math.floor(Math.random() * 20) + 1}</span>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              {/* Left column - Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showDescription ? '' : '-rotate-90'}`} />
                    Description
                  </button>
                  
                  {showDescription && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Business Context</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {caseStudy.businessRequirements?.businessContext || caseStudy.hero.subtitle}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Problem Statement</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {caseStudy.businessRequirements?.problemStatement || 
                           caseStudy.sections.find(s => s.id === 'problem')?.items?.[0]?.content || 
                           'The current system lacks the capability to efficiently handle the required operations, resulting in decreased productivity and user satisfaction.'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Business Value</h3>
                        <ul className="space-y-2">
                          {(caseStudy.businessRequirements?.businessValue || [
                            'Increase operational efficiency by 40%',
                            'Reduce processing time from hours to minutes',
                            'Enable real-time data insights and decision making'
                          ]).slice(0, 3).map((value, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                              <span className="text-gray-800 dark:text-gray-300 font-medium">{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Acceptance Criteria */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={() => setShowAcceptanceCriteria(!showAcceptanceCriteria)}
                    className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showAcceptanceCriteria ? '' : '-rotate-90'}`} />
                    Acceptance Criteria
                  </button>
                  
                  {showAcceptanceCriteria && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <ul className="space-y-3">
                        {(caseStudy.businessRequirements?.acceptanceCriteria || [
                          'System can handle 10,000+ concurrent operations',
                          'Response time under 200ms for 95% of requests',
                          'Automated deployment pipeline with rollback capabilities',
                          'Comprehensive monitoring and alerting system in place',
                          'All critical user journeys covered by automated tests'
                        ]).slice(0, 5).map((criteria, idx) => {
                          // Strip leading checkmark characters if present
                          const cleanCriteria = criteria.replace(/^[✓✔☑]\s*/, '');
                          return (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-green-500 rounded mt-0.5 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-gray-800 dark:text-gray-300 font-medium">{cleanCriteria}</span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Attachments */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setShowAttachments(!showAttachments)}
                    className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showAttachments ? '' : '-rotate-90'}`} />
                    Attachments
                  </button>
                  
                  {showAttachments && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(caseStudy.businessRequirements?.attachments || [
                          { name: 'architecture-diagram.png', type: 'Image', size: '1.2 MB' },
                          { name: 'requirements-v2.pdf', type: 'PDF', size: '456 KB' },
                          { name: 'api-spec.yaml', type: 'YAML', size: '89 KB' },
                          { name: 'test-results.xlsx', type: 'Excel', size: '234 KB' }
                        ]).slice(0, 4).map((attachment, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-900 rounded hover:bg-gray-800 transition-colors cursor-pointer">
                            <Paperclip className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm text-white">{attachment.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-500">{attachment.type} • {attachment.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Comments */}
                {caseStudy.activity && caseStudy.activity.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="border-t border-gray-800 pt-6"
                  >
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white mb-4">
                      <MessageSquare className="w-5 h-5" />
                      Activity
                    </h3>

                    <div className="space-y-4">
                      {caseStudy.activity.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {item.avatar || item.author?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ZA'}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">{item.author}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">{item.time}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{item.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right column - Metadata */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Type</p>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-900 dark:text-white">Story</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Priority</p>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-900 dark:text-white">{caseStudy.businessRequirements?.priority || 'High'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Story Points</p>
                      <span className="text-gray-900 dark:text-white">8</span>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Sprint</p>
                      <span className="text-gray-900 dark:text-white">Sprint {Math.floor(Math.random() * 20) + 1}</span>
                    </div>
                    
                    {caseStudy.timeline?.year && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Year</p>
                        <span className="text-gray-900 dark:text-white">{caseStudy.timeline.year}</span>
                      </div>
                    )}

                    {caseStudy.timeline?.duration && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Duration</p>
                        <span className="text-gray-900 dark:text-white">{caseStudy.timeline.duration}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">Labels</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.hero.category && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                        {caseStudy.hero.category}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      enhancement
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                      performance
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">
                      architecture
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OverviewTab;
