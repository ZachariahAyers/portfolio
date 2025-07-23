import React, { useState } from 'react';
import { X, Info, Bot } from 'lucide-react';

const WelcomeModal = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <button
      onClick={() => setIsOpen(true)}
      className="hover:bg-gray-700 cursor-pointer rounded-2xl p-2 transition-colors"
      title="About this AI Portfolio"
    >
      <Info className="text-gray-400 hover:text-gray-200 h-6 w-6" />
    </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative bg-gray-800 rounded-2xl max-w-lg w-full animate-scale-in shadow-2xl border border-gray-700">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    Meet Arlo, My AI Assistant
                    <Bot className="h-8 w-8 text-blue-500" />
                  </h2>
                  <p className="text-gray-400 mt-1">Your personal guide to Zach's experience</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="bg-gray-700/50 rounded-xl p-6 space-y-4">
                  {/* Welcome section */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                      Welcome! I'm Zach 👋
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      I'm a Senior Full Stack Engineer with 14+ years of experience building scalable systems and implementing AI/ML solutions. 
                      Let's save some time - meet <strong className="text-white">Arlo</strong>, my AI assistant who knows everything about my experience, 
                      skills, and projects. Arlo can answer your questions instantly, generate custom resumes, and even conduct mock interviews!
                    </p>
                  </div>

                  {/* Why AI section */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                      Why an AI Assistant? 🚀
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Traditional portfolios waste your time with generic content. 
                      Arlo makes this portfolio <strong className="text-white">exactly what you need it to be</strong>. 
                      Ask about specific technologies, dive deep into my projects, or see how I fit your tech stack - all in real-time!
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                      Features ✨
                    </h3>
                    <ul className="text-gray-300 space-y-1 list-disc list-inside">
                      <li>Natural conversation about Zach's 14+ years of experience</li>
                      <li>Generate custom resumes tailored to your job description</li>
                      <li>Interactive mock interviews with real-time feedback</li>
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
                    Chat with Arlo
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