import React, { useState } from 'react';
import { User, Briefcase, Layers, Mail, CircleEllipsis, ChevronDown, ChevronUp } from 'lucide-react';

const QuickCards = ({ onCardClick, onMoreClick, isVisible, onToggleVisibility, onViewChange }) => {

  const cards = [
    { key: 'Me', color: '#14B8A6', icon: User, question: 'Who are you? I want to know more about you.' },
    { key: 'Projects', color: '#3E9858', icon: Briefcase, question: 'What are your projects? What are you working on right now?' },
    { key: 'Skills', color: '#856ED9', icon: Layers, question: 'What are your skills? Give me a list of your soft and hard skills.' },
    { key: 'Contact', color: '#EAB308', icon: Mail, question: 'How can I contact you?' }
  ];


  return (
    <div className="w-full">
      {/* Toggle Button */}
      <div className={isVisible ? 'mb-2 flex justify-center' : 'mb-0 flex justify-center'}>
        <button
          onClick={onToggleVisibility}
          className="flex items-center gap-1 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {isVisible ? (
            <>
              <ChevronDown size={14} />
              Hide Quick Tools
            </>
          ) : (
            <>
              <ChevronUp size={14} />
              Show Quick Tools
            </>
          )}
        </button>
      </div>

      {/* Cards */}
      {isVisible && (
        <div className="w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {cards.map(({ key, color, icon: Icon, question }) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'Me' || key === 'Projects' || key === 'Skills') {
                    onViewChange(key.toLowerCase());
                  } else if (key === 'Contact') {
                    onViewChange('contact');
                  } else {
                    onCardClick(question);
                  }
                }}
                className="bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95 
                         h-auto min-w-[100px] flex-shrink-0 cursor-pointer rounded-xl border border-gray-300 dark:border-gray-700
                         px-4 py-3 shadow-none backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Icon size={18} strokeWidth={2} style={{ color }} />
                  <span className="text-sm font-medium">{key}</span>
                </div>
              </button>
            ))}

            {/* More Button */}
            <button
              onClick={onMoreClick}
              className="group relative flex flex-shrink-0 items-center justify-center"
            >
              <div className="hover:bg-gray-200 dark:hover:bg-gray-700 flex h-auto cursor-pointer items-center space-x-1 
                            rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/80 px-4 py-3 text-sm 
                            backdrop-blur-sm transition-all duration-200 active:scale-95">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CircleEllipsis className="h-[20px] w-[18px]" strokeWidth={2} />
                  <span className="text-sm font-medium">Questions</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCards;