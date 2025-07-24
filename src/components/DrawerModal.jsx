import React, { useEffect } from 'react';
import { X, UserSearch, BriefcaseBusiness, Code, GraduationCap, PartyPopper, Mail, ChevronRight, Sparkles } from 'lucide-react';

const DrawerModal = ({ isOpen, onClose, onQuestionClick, onViewChange }) => {
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

  const specialQuestions = [
    'What makes you stand out from other senior engineers?',
    'Can I see your resume?',
    'What projects are you most proud of?',
    'What are your skills?',
    'How can I reach you?',
    "What's your experience with AI/ML in production?",
  ];

  const questionsByCategory = [
    {
      id: 'me',
      name: 'Me',
      icon: UserSearch,
      questions: [
        'Who are you?',
        'What are your passions?',
        'How did you get started in tech?',
        'Where do you see yourself in 5 years?',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: BriefcaseBusiness,
      questions: [
        'Can I see your resume?',
        'What makes you a valuable team member?',
        'Where are you working now?',
        'Why should I hire you?',
        "What's your educational background?",
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: Code,
      questions: [
        'What projects are you most proud of?',
        'Tell me about AssembleJS',
        'What open source work have you done?',
        'Show me your GitHub projects',
      ],
    },
    {
      id: 'skills',
      name: 'Skills',
      icon: GraduationCap,
      questions: [
        'What are your skills?',
        'What is your experience with React and Node.js?',
        'Tell me about your AI/ML expertise',
        'What cloud platforms do you work with?',
      ],
    },
    {
      id: 'fun',
      name: 'Fun & Personal',
      icon: PartyPopper,
      questions: [
        'What do you do for fun?',
        'What are your hobbies outside of coding?',
        'What motivates you?',
        'What are you certain about that 90% get wrong?',
      ],
    },
    {
      id: 'contact',
      name: 'Contact & Future',
      icon: Mail,
      questions: [
        'How can I reach you?',
        "What kind of project would make you say 'yes' immediately?",
        'Where are you located?',
        'Are you open to relocation?',
      ],
    },
  ];

  const handleQuestionClick = (question) => {
    if (question === 'Can I see your resume?') {
      onViewChange && onViewChange('resume-standard');
      onClose();
    } else {
      onQuestionClick(question);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 bottom-0 left-0 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="mt-24 flex h-[80vh] lg:h-[60vh] flex-col rounded-t-2xl bg-gray-900 border-t border-gray-700">
          <div className="flex-1 overflow-y-auto rounded-t-2xl bg-gray-800 p-4">
            <div className="mx-auto max-w-md space-y-4">
              {/* Handle */}
              <div
                aria-hidden
                className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-600"
              />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <X size={20} className="text-gray-300" />
              </button>

              <div className="mx-auto w-full max-w-md">
                <div className="space-y-8 pb-16">
                  {questionsByCategory.map((category) => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      onQuestionClick={handleQuestionClick}
                      specialQuestions={specialQuestions}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CategorySection = ({ category, onQuestionClick, specialQuestions }) => {
  const Icon = category.icon;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 px-1">
        <Icon className="h-5 w-5 text-gray-400" />
        <h3 className="text-xl font-medium text-gray-200">
          {category.name}
        </h3>
      </div>

      <div className="border-b border-gray-700 my-4" />

      <div className="space-y-3">
        {category.questions.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            onClick={() => onQuestionClick(question)}
            isSpecial={specialQuestions.includes(question)}
          />
        ))}
      </div>
    </div>
  );
};

const QuestionItem = ({ question, onClick, isSpecial }) => {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-lg px-6 py-4 text-left 
                  transition-all hover:translate-x-1 active:scale-[0.98] ${
        isSpecial 
          ? 'bg-blue-900/30 hover:bg-blue-900/40 border border-blue-700' 
          : 'bg-gray-700/50 hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {isSpecial && <Sparkles className="mr-2 h-4 w-4 text-blue-400" />}
        <span className={`${isSpecial ? 'font-medium text-blue-300' : 'text-gray-300'}`}>
          {question}
        </span>
      </div>
      <ChevronRight className={`h-5 w-5 shrink-0 ${isSpecial ? 'text-blue-400' : 'text-gray-500'}`} />
    </button>
  );
};

export default DrawerModal;