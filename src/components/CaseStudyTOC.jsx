import React from 'react';
import { FileText, Hash } from 'lucide-react';
import { Tooltip } from './Tooltip';

const CaseStudyTOC = ({ sections, activeSection, onSectionClick }) => {
  const sectionNames = {
    executive: 'Executive Summary',
    challenge: 'The Challenge',
    solution: 'The Solution',
    implementation: 'Implementation',
    results: 'Results & Impact',
    learnings: 'Key Learnings',
    technical: 'Technical Deep Dive'
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onSectionClick(sectionId);
    }
  };

  return (
    <div className="sticky top-24">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FileText className="text-blue-500" size={20} />
          Table of Contents
        </h3>
        
        <nav aria-label="Table of contents">
          <ul className="space-y-2">
            {Object.keys(sections).map((key) => {
              const isActive = activeSection === key;
              const displayName = sectionNames[key] || key;
              
              return (
                <li key={key}>
                  <Tooltip content={`Jump to ${displayName}`} placement="right">
                    <button
                      onClick={() => scrollToSection(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      aria-label={`Navigate to ${displayName} section`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      <Hash 
                        size={14} 
                        className={`transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                      <span className="truncate">{displayName}</span>
                    </button>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Progress Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Reading Progress</span>
            <span>{Math.round((Object.keys(sections).indexOf(activeSection) + 1) / Object.keys(sections).length * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((Object.keys(sections).indexOf(activeSection) + 1) / Object.keys(sections).length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Estimated Read Time */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center gap-1">
            <span>⏱️</span>
            <span>~12 min read</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyTOC;