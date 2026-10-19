import React, { useEffect } from 'react';
import { X, Sparkles, Code, Users, Briefcase, DollarSign, Settings } from 'lucide-react';
import profileData from '../portfolio-data.json';

const QuickOptionsFlyout = ({ isOpen, onClose, onQuestionClick, onViewChange }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const categoryIcons = {
    technical: Code,
    behavioral: Users,
    situational: Settings,
    projectSpecific: Briefcase,
    compensationAndLogistics: DollarSign
  };

  const categoryLabels = {
    technical: 'Technical Questions',
    behavioral: 'Behavioral Questions',
    situational: 'Situational Questions',
    projectSpecific: 'Project-Specific Questions',
    compensationAndLogistics: 'Logistics'
  };

  // Special questions to highlight
  const specialQuestions = [
    'What makes you stand out from other senior engineers?',
    'What projects are you most proud of?',
    'What\'s your experience with AI/ML in production?'
  ];

  const handleQuestionClick = (question) => {
    onQuestionClick(question);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 dark:bg-black/70 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />
      
      {/* Flyout */}
      <div className={`fixed right-4 bottom-20 z-50 w-80 transform transition-all duration-300 ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 max-h-[60vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Questions</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Scrollable content */}
          <div className="overflow-y-auto p-2">
            {/* Grouped Questions */}
            {Object.entries(profileData.interviewQuestions).map(([category, questions]) => {
              const Icon = categoryIcons[category] || Code;
              return (
                <div key={category} className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1 mb-2">
                    <Icon className="h-4 w-4 text-gray-600 dark:text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider">
                      {categoryLabels[category] || category}
                    </h4>
                  </div>
                  {questions.slice(0, 3).map((question, index) => {
                    const isSpecial = specialQuestions.includes(question);
                    return (
                      <button
                        key={`${category}-${index}`}
                        onClick={() => handleQuestionClick(question)}
                        className={`w-full text-left p-3 rounded-lg mb-1 transition-all hover:translate-x-1 ${
                          isSpecial 
                            ? 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/40 border border-blue-400 dark:border-blue-700/50' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isSpecial && <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />}
                          <span className={`text-sm ${isSpecial ? 'text-blue-600 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                            {question}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickOptionsFlyout;