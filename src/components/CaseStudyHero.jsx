import React from 'react';
import { Calendar, Users, Award, ExternalLink, Github } from 'lucide-react';
import { Tooltip } from './Tooltip';

const CaseStudyHero = ({ caseStudy }) => {
  const getCategoryColor = (category) => {
    const colors = {
      opensource: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      enterprise: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      freelance: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      other: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      opensource: 'Open Source',
      enterprise: 'Enterprise',
      freelance: 'Freelance',
      other: 'Personal'
    };
    return labels[category] || category;
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Cover Image */}
          {caseStudy.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
              <img 
                src={caseStudy.coverImage} 
                alt={caseStudy.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Header Content */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(caseStudy.category)}`}>
                {getCategoryLabel(caseStudy.category)}
              </span>
              {caseStudy.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 flex items-center gap-1">
                  <Award size={14} />
                  Featured
                </span>
              )}
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {caseStudy.title}
              </h1>
              {caseStudy.subtitle && (
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                  {caseStudy.subtitle}
                </p>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              {caseStudy.timeline && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Timeline: {caseStudy.timeline}</span>
                </div>
              )}
              {caseStudy.role && (
                <div className="flex items-center gap-2">
                  <Award size={16} />
                  <span>Role: {caseStudy.role}</span>
                </div>
              )}
              {caseStudy.team && (
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Team: {caseStudy.team}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Links */}
            {caseStudy.links && (
              <div className="flex flex-wrap gap-4 pt-4">
                {caseStudy.links.demo && (
                  <Tooltip content="View live demo">
                    <a 
                      href={caseStudy.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View live demo in new tab"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  </Tooltip>
                )}
                {caseStudy.links.github && (
                  <Tooltip content="View source code">
                    <a 
                      href={caseStudy.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View source code on GitHub"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <Github size={16} />
                      Source Code
                    </a>
                  </Tooltip>
                )}
                {caseStudy.links.documentation && (
                  <Tooltip content="Read documentation">
                    <a 
                      href={caseStudy.links.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Read documentation"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      Documentation
                    </a>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyHero;