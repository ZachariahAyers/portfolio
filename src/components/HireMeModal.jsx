import React, { useState, useRef } from 'react';
import { X, Briefcase, Clock, Send, ArrowLeft } from 'lucide-react';

const LAMBDA_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const HireMeModal = ({ isOpen, onClose, profileData }) => {
  const [step, setStep] = useState('choice'); // 'choice', 'form'
  const [hiringType, setHiringType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: '',
    timeline: ''
  });
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  if (!isOpen) return null;

  const handleTypeSelect = (type) => {
    setHiringType(type);
    setStep('form');
  };

  const handleBack = () => {
    setStep('choice');
    setFormData({ name: '', email: '', company: '', description: '', timeline: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch(`${LAMBDA_ENDPOINT}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || '',
          description: formData.description,
          timeline: formData.timeline || '',
          hiringType: hiringType,
          formType: `${hiringType === 'contract' ? 'Contract' : 'Full-Time'} Opportunity`,
          subject: `${hiringType === 'contract' ? 'Contract' : 'Full-Time'} Opportunity - ${formData.company || 'Portfolio'}`,
          message: formData.description, // Lambda expects 'message' field
          honeypot: formData.honeypot || '' // Include honeypot for backend validation
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }));
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      await response.json();
      setStatus('success');
    } catch (error) {
      console.error('Error sending form:', error);
      setStatus('error');
    }
  };

  const resetModal = () => {
    setStep('choice');
    setHiringType('');
    setFormData({ name: '', email: '', company: '', description: '', timeline: '' });
    setStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={resetModal}
      />
      
      {/* Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full animate-scale-in shadow-2xl border border-gray-200 dark:border-gray-700">
        {status === 'success' ? (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thank You!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {hiringType === 'contract' 
                ? "I'll review your project details and send you a quote shortly!"
                : "I'll review your opportunity and get back to you soon!"}
            </p>
            <button 
              onClick={resetModal} 
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 active:scale-95"
            >
              Close
            </button>
          </div>
        ) : status === 'error' ? (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Something went wrong. Please try again or email me directly at {profileData.contact.email}
            </p>
            <button 
              onClick={() => setStatus('idle')} 
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                {step === 'form' && (
                  <button
                    onClick={handleBack}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {step === 'choice' ? 'Hire Me' : `${hiringType === 'contract' ? 'Contract/Freelance' : 'Full-Time'} Opportunity`}
                </h3>
              </div>
              <button
                onClick={resetModal}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {step === 'choice' ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  I'm available for both contract work and full-time opportunities. How can I help?
                </p>
                
                <button
                  onClick={() => handleTypeSelect('contract')}
                  className="w-full p-6 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all 
                           border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-400" />
                        Contract / Freelance
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Short-term projects, consulting, or ongoing support
                      </p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">→</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTypeSelect('fulltime')}
                  className="w-full p-6 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all 
                           border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-400" />
                        Full-Time Position
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Join your team as a full-time engineer
                      </p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">→</span>
                  </div>
                </button>
              </div>
            ) : (
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
              >
                {/* Honeypot field for bot protection */}
                <input 
                  type="text" 
                  name="honeypot" 
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                  value={formData.honeypot || ''}
                  onChange={handleChange}
                />
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hire-name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      id="hire-name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      disabled={status === 'sending'}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="hire-email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Your Email *
                    </label>
                    <input 
                      type="email" 
                      id="hire-email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      disabled={status === 'sending'}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
                      required 
                    />
                  </div>

                  <div>
                    <label htmlFor="hire-company" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      Company
                    </label>
                    <input 
                      type="text" 
                      id="hire-company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      disabled={status === 'sending'}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" 
                    />
                  </div>

                  <div>
                    <label htmlFor="hire-description" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      {hiringType === 'contract' ? 'Project Description' : 'Position Description'} *
                    </label>
                    <textarea 
                      id="hire-description" 
                      name="description" 
                      rows="4" 
                      value={formData.description} 
                      onChange={handleChange} 
                      disabled={status === 'sending'}
                      placeholder={hiringType === 'contract' 
                        ? "Tell me about your project, tech stack, and what you need help with..."
                        : "Tell me about the role, team, and what you're looking for..."}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 
                               placeholder-gray-400 dark:placeholder-gray-500" 
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="hire-timeline" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                      {hiringType === 'contract' ? 'Timeline' : 'Start Date'}
                    </label>
                    <input 
                      type="text" 
                      id="hire-timeline" 
                      name="timeline" 
                      value={formData.timeline} 
                      onChange={handleChange} 
                      disabled={status === 'sending'}
                      placeholder={hiringType === 'contract' ? "e.g., 3 months, ASAP" : "e.g., Q1 2025, Flexible"}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-900 dark:text-white 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 
                               placeholder-gray-400 dark:placeholder-gray-500" 
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={status === 'sending'} 
                      className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg 
                               hover:bg-blue-700 transition-all duration-200 active:scale-95 
                               disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center 
                               justify-center gap-2"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'} 
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HireMeModal;