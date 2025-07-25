import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Tooltip } from './Tooltip';

const CaseStudyNavigation = ({ prevStudy, nextStudy }) => {
  return (
    <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {/* Previous Case Study */}
        <div className="flex-1">
          {prevStudy ? (
            <Tooltip content={`Previous: ${prevStudy.title}`}>
              <Link
                to={`/casestudies/${prevStudy.id}`}
                className="group flex items-start gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={`Navigate to previous case study: ${prevStudy.title}`}
              >
                <ChevronLeft className="mt-1 text-gray-500 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Previous</p>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prevStudy.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">
                    {prevStudy.category}
                  </p>
                </div>
              </Link>
            </Tooltip>
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-400 dark:text-gray-600">No previous case study</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Next Case Study */}
        <div className="flex-1">
          {nextStudy ? (
            <Tooltip content={`Next: ${nextStudy.title}`}>
              <Link
                to={`/casestudies/${nextStudy.id}`}
                className="group flex items-start gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-right"
                aria-label={`Navigate to next case study: ${nextStudy.title}`}
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Next</p>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {nextStudy.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-1">
                    {nextStudy.category}
                  </p>
                </div>
                <ChevronRight className="mt-1 text-gray-500 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              </Link>
            </Tooltip>
          ) : (
            <div className="p-4 text-right">
              <p className="text-sm text-gray-400 dark:text-gray-600">No next case study</p>
            </div>
          )}
        </div>
      </div>

      {/* Back to All Case Studies */}
      <div className="mt-6 text-center">
        <Tooltip content="View all case studies">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Navigate back to all projects"
          >
            <ArrowLeft size={16} />
            Back to All Projects
          </Link>
        </Tooltip>
      </div>
    </nav>
  );
};

export default CaseStudyNavigation;