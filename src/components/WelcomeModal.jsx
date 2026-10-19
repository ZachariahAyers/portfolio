import { useState } from 'react';
import { X, Info, Zap } from 'lucide-react';
import { Tooltip } from './Tooltip';

const WelcomeModal = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Tooltip content="About this AI Portfolio">
      <button
        onClick={() => setIsOpen(true)}
        className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-2xl p-2 transition-colors"
        aria-label="About this AI Portfolio"
      >
        <Info className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 h-6 w-6" />
      </button>
    </Tooltip>
  );

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        defaultTrigger
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 animate-fade-in min-h-screen overflow-y-auto">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-xl w-full animate-scale-in shadow-2xl border border-gray-200 dark:border-gray-700 mt-8 mb-8">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-blue-400" />
                    Meet ARLO
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Your personal guide to Zach's experience</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
                  {/* Welcome section */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                      Welcome! I'm Zach 👋
                    </h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This isn't just another portfolio - it's an AI-powered conversation about my experience.
                      Let's save some time - meet <strong className="text-gray-900 dark:text-white">ARLO</strong> (Adaptive Response & Learning OS), my AI assistant who knows everything about my experience, 
                      projects, and skills. Ask ARLO anything you'd ask me in an interview.
                    </p>
                  </div>

                  {/* Why AI section */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                      Why an AI Assistant? 🚀
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Traditional portfolios waste your time with generic content. 
                      ARLO makes this portfolio <strong className="text-gray-900 dark:text-white">exactly what you need it to be</strong>. 
                      Ask about specific technologies, dive deep into my projects, or see how I fit your tech stack - all in real-time!
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                      Features ✨
                    </h3>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                      <li>Natural conversation about Zach's 14+ years of experience</li>
                      <li>Deep dive into any project or technology stack</li>
                      <li>Direct contact with Zach when you're ready to move forward</li>
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 
                             transition-all duration-200 active:scale-95 shadow-lg"
                  >
                    Chat with ARLO
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    Built with React, Node.js, and Google's Gemini AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeModal;