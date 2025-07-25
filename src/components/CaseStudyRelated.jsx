import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { Tooltip } from './Tooltip';
import caseStudiesData from '../case-studies.json';

const CaseStudyRelated = ({ relatedIds, currentId }) => {
  // Get related case studies data
  const relatedStudies = relatedIds
    .filter(id => id !== currentId && caseStudiesData[id])
    .map(id => ({
      id,
      ...caseStudiesData[id]
    }))
    .slice(0, 3); // Limit to 3 related studies

  if (relatedStudies.length === 0) return null;

  const getCategoryColor = (category) => {
    const colors = {
      opensource: 'from-blue-500 to-cyan-500',
      enterprise: 'from-purple-500 to-pink-500',
      freelance: 'from-amber-500 to-orange-500',
      other: 'from-green-500 to-emerald-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      opensource: '🌟',
      enterprise: '🏢',
      freelance: '💼',
      other: '🚀'
    };
    return icons[category] || icons.other;
  };

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Sparkles className="text-purple-500" />
          Related Case Studies
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore more projects with similar technologies or approaches
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedStudies.map((study) => (
          <Tooltip key={study.id} content={`View ${study.title} case study`}>
            <Link
              to={`/casestudies/${study.id}`}
              className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              aria-label={`Navigate to ${study.title} case study`}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(study.category)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Cover Image */}
              {study.coverImage && (
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={study.coverImage} 
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                      {getCategoryIcon(study.category)} {study.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {study.title}
                </h3>
                
                {study.subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {study.subtitle}
                  </p>
                )}

                {/* Tags */}
                {study.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metrics Preview */}
                {study.metrics && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {Object.entries(study.metrics).slice(0, 2).map(([key, metric]) => (
                      <div key={key} className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {metric.value}
                        </span>
                        <span className="truncate max-w-[100px]">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Read More Link */}
                <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">Read Case Study</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </Tooltip>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-8 text-center">
        <Tooltip content="Browse all projects">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            aria-label="View all projects"
          >
            <span>View All Projects</span>
            <ExternalLink size={16} />
          </Link>
        </Tooltip>
      </div>
    </section>
  );
};

export default CaseStudyRelated;