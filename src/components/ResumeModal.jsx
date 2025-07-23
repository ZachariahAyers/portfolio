import React, { useState } from 'react';
import { X, FileText, Sparkles } from 'lucide-react';

const ResumeModal = ({ isOpen, onClose, onGenerate }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!jobDescription.trim()) return;
    
    setIsGenerating(true);
    await onGenerate(jobDescription);
    setIsGenerating(false);
    setJobDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative bg-gray-800 rounded-2xl max-w-lg w-full animate-scale-in shadow-2xl border border-gray-700">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-400" />
              Get My Perfectly Tailored Resume
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-gray-300">
              Receive my resume perfectly tailored to your requirements in seconds. Just paste your job description below.
            </p>

            <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI-Powered Customization
              </h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Analyzes job requirements and keywords</li>
                <li>• Emphasizes relevant experience and projects</li>
                <li>• Reorders skills based on job priorities</li>
                <li>• Delivers a professional PDF ready to share with your team</li>
              </ul>
            </div>

            <div>
              <label htmlFor="job-description" className="block text-gray-300 text-sm font-bold mb-2">
                Job Description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500
                         h-48 resize-none"
                disabled={isGenerating}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!jobDescription.trim() || isGenerating}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg 
                       hover:bg-blue-700 transition-all duration-200 active:scale-95 
                       disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Creating Your Tailored Resume...' : 'Get My Custom Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;