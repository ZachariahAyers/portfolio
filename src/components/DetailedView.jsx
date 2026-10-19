import React from 'react';
import { X, Briefcase, Code, ExternalLink, Zap } from 'lucide-react';
import StreamingText from './StreamingText';
import StreamingTextSimple from './StreamingTextSimple';
import { Tooltip } from './Tooltip';
import ProjectsView from './ProjectsView';
import SkillsView from './SkillsView';

const DetailedView = ({ mode, onClose, profileData, onGenerateContent, onGenerateExecutiveSummary, onContactClick }) => {
  const [streamingContent, setStreamingContent] = React.useState(() =>
    onGenerateContent ? null : { bulletPoints: profileData.personal.whatIBring });
  const [executiveSummary, setExecutiveSummary] = React.useState(() =>
    onGenerateExecutiveSummary ? null : profileData.personal.executiveSummary[0]);
  const hasInitialized = React.useRef(false);

  // The parent keys this component by mode, so state starts fresh for each view.
  React.useEffect(() => {
    if (mode !== 'me' || hasInitialized.current) return;
    hasInitialized.current = true;

    onGenerateExecutiveSummary?.()
      .then(setExecutiveSummary)
      .catch(() => setExecutiveSummary(profileData.personal.executiveSummary[0]));

    const fallback = { bulletPoints: profileData.personal.whatIBring };
    onGenerateContent?.()
      .then(content => setStreamingContent(content ?? fallback))
      .catch(() => setStreamingContent(fallback));
  }, [mode, onGenerateContent, onGenerateExecutiveSummary, profileData.personal.whatIBring, profileData.personal.executiveSummary]);

  const renderMeView = () => (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Section: Image | Name/Title | Contact Info */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-center">
        {/* Image */}
        <div className="shrink-0 flex items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl">
            <img src={profileData.personal.avatarPath} alt={profileData.personal.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name and Title */}
        <div className="flex-1 text-center lg:text-left flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl max-sm:text-xl font-bold text-gray-900 dark:text-white">{profileData.personal.name}</h1>
          <p className="text-base md:text-lg max-sm:text-sm text-gray-700 dark:text-gray-300 whitespace-normal md:whitespace-nowrap">{profileData.personal.title}</p>
          <p className="text-blue-400 italic text-sm mt-1">{profileData.personal.tagline}</p>
        </div>

        {/* Contact Info */}
        <div className="w-full lg:w-auto lg:shrink-0 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 max-sm:p-3 lg:min-w-[280px]">
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3">Connect With Me</h2>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Tooltip content="Send me an email">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onContactClick) onContactClick();
                }}
                aria-label={`Send email to ${profileData.contact.email}`}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                <ExternalLink size={14} /> {profileData.contact.email}
              </a>
            </Tooltip>
            <Tooltip content="View my LinkedIn profile">
              <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="View LinkedIn profile in new tab" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <ExternalLink size={14} /> LinkedIn Profile
              </a>
            </Tooltip>
            <Tooltip content="Explore my GitHub repositories">
              <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer" aria-label="View GitHub portfolio in new tab" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Code size={14} /> GitHub Portfolio
              </a>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Executive Summary Section */}
      <div className="bg-linear-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4 md:p-6 border border-blue-400 dark:border-blue-500/30">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="text-blue-400" /> Executive Summary
        </h2>
        {!executiveSummary ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:75ms]"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
            </div>
          </div>
        ) : (
          <StreamingTextSimple
            key={executiveSummary}
            text={executiveSummary}
            speed={8}
          />
        )}
      </div>

      {/* What I Can Bring to Your Team Section */}
      <div className="bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 md:p-6 max-sm:p-3 border border-purple-400 dark:border-purple-500/30">
        <h2 className="text-xl md:text-2xl max-sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="text-purple-400" /> What I Can Bring to Your Team
        </h2>
        {!streamingContent ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:75ms]"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
            </div>
          </div>
        ) : (
          <StreamingText
            key={(streamingContent?.bulletPoints || []).join('\n')}
            bulletPoints={streamingContent?.bulletPoints || []}
            speed={8}
          />
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case 'me':
        return renderMeView();
      case 'projects':
        return <ProjectsView profileData={profileData} />;
      case 'skills':
        return <SkillsView profileData={profileData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-xs z-9999 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in shadow-xl">
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
            {mode === 'me' && 'Hello There, Welcome to My Portfolio'}
            {mode === 'projects' && 'Projects'}
            {mode === 'skills' && 'Skills'}
          </h2>
          <div className="flex items-center gap-3">
            {mode === 'projects' && (
              <Tooltip content="Open projects page in new tab">
                <button
                  onClick={() => {
                    window.open('/projects', '_blank');
                  }}
                  aria-label="View all projects in a new tab"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  See All Projects
                </button>
              </Tooltip>
            )}
            {mode === 'skills' && (
              <Tooltip content="Open skills page in new tab">
                <button
                  onClick={() => {
                    window.open('/skills', '_blank');
                  }}
                  aria-label="View all skills in a new tab"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  See All Skills
                </button>
              </Tooltip>
            )}
            <Tooltip content="Close dialog">
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] dialog-scrollbar bg-white dark:bg-gray-900">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DetailedView;