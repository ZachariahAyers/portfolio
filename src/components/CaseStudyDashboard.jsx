import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Beaker, Activity, Atom, CircuitBoard, Sparkles, Zap, Brain, 
         FlaskConical, Binary, BarChart3, Cpu, Layers, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from './Tooltip';

// Tab components
import OverviewTab from './dashboard/OverviewTab';
import ProblemTab from './dashboard/ProblemTab';
import SolutionTab from './dashboard/SolutionTab';
import ResultsTab from './dashboard/ResultsTab';
import TechTab from './dashboard/TechTab';
import ReleaseTab from './dashboard/ReleaseTab';

const CaseStudyDashboard = () => {
  const { caseStudyId } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCodeModal, setShowCodeModal] = useState(null);

  // Floating particles effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20
  }));

  useEffect(() => {
    const loadCaseStudy = async () => {
      try {
        const response = await fetch(`/casestudies/${caseStudyId}.casestudy.json`);
        if (!response.ok) throw new Error('Case study not found');
        
        const data = await response.json();
        setCaseStudy(data);
        document.title = `${data.hero.title} | Research Lab`;
      } catch (error) {
        console.error('Failed to load case study:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudy();
  }, [caseStudyId, navigate]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FlaskConical },
    { id: 'problem', label: 'Problem', icon: Binary },
    { id: 'solution', label: 'Solution', icon: Cpu },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'release', label: 'Release', icon: Activity },
    { id: 'tech', label: 'Tech Stack', icon: Layers }
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      } else if (e.key >= '1' && e.key <= '6') {
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
          setActiveTab(tabs[tabIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24"
          >
            <Atom className="w-full h-full text-blue-600 dark:text-blue-400" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-24 h-24 bg-blue-400/20 blur-xl"
          />
        </div>
      </div>
    );
  }

  if (!caseStudy) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab caseStudy={caseStudy} />;
      case 'problem':
        return <ProblemTab section={caseStudy.sections.find(s => s.id === 'problem')} />;
      case 'solution':
        return <SolutionTab caseStudyId={caseStudyId} />;
      case 'results':
        return <ResultsTab section={caseStudy.sections.find(s => s.id === 'results')} />;
      case 'tech':
        return <TechTab 
          section={caseStudy.sections.find(s => s.id === 'tech')} 
          onCodeClick={setShowCodeModal}
          caseStudy={caseStudy}
        />;
      case 'release':
        return <ReleaseTab caseStudy={caseStudy} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%` }}
            animate={{
              x: `${(particle.x + 20) % 100}%`,
              y: `${(particle.y - 30) % 100}%`,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header - 60px */}
      <header className="h-[60px] border-b border-gray-300 dark:border-gray-700/50 backdrop-blur-xl bg-gray-100/80 dark:bg-gray-800/50 relative z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Beaker className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs font-mono flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">EXPERIMENT #{caseStudyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9000 + 1000}</span>
                  <span className="text-gray-600 dark:text-gray-500">|</span>
                  <span className="text-green-600 dark:text-green-400">CONTRACT #{caseStudyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).substring(0, 6).toUpperCase()}</span>
                </div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">{caseStudy.hero.title}</h1>
              </div>
            </div>
            
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent hidden sm:block" />
            
            <a
              href={caseStudy.links?.demo || caseStudy.links?.github || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-xs font-mono text-gray-600 dark:text-gray-500">LIVE</span>
            </a>
          </div>

          <Tooltip content="Exit Lab (ESC)">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-light text-sm">Exit Lab</span>
            </Link>
          </Tooltip>
        </div>
      </header>

      {/* Tab Navigation - 60px to accommodate number indicators */}
      <nav className="h-[60px] border-b border-gray-300 dark:border-gray-700/50 backdrop-blur-sm bg-gray-50/80 dark:bg-gray-800/30 overflow-x-auto">
        <div className="h-full px-3 md:px-6 flex items-center gap-0.5 md:gap-1 pt-2 min-w-max">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-3 md:px-6 py-2 flex flex-col md:flex-row items-center gap-0.5 md:gap-2 font-light text-xs md:text-sm
                  transition-all duration-300 group
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }
                `}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] md:text-sm">{tab.label}</span>
                <span className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-500 dark:text-gray-600">
                  {index + 1}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}

          <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-500">
            <span className="font-mono">Use 1-6 keys to navigate</span>
          </div>
        </div>
      </nav>

      {/* Content Area - Remaining height */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowCodeModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-blue-500/30 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-gray-300 dark:border-blue-500/20 p-4 flex items-center justify-between">
                <h3 className="text-lg font-light text-gray-900 dark:text-white">{showCodeModal.title}</h3>
                <button
                  onClick={() => setShowCodeModal(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-auto">
                <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  <code>{showCodeModal.code}</code>
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <footer className="min-h-[30px] md:h-[30px] border-t border-gray-300 dark:border-gray-700/50 bg-gray-100/80 dark:bg-gray-800/50 px-3 md:px-6 py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-between text-xs font-mono text-gray-600 dark:text-gray-500">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center md:justify-start">
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">Duration: </span>
            <span className="font-semibold">{caseStudy.timeline.duration || '6 months'}</span>
          </span>
          <span>•</span>
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">Role: </span>
            <span className="font-semibold">{caseStudy.timeline.role || 'Creator & Lead Developer'}</span>
          </span>
          <span>•</span>
          <span className="whitespace-nowrap">
            <span className="hidden sm:inline">Year: </span>
            <span className="font-semibold">{caseStudy.timeline.year || '2023'}</span>
          </span>
          <span className="hidden md:inline">•</span>
          <a
            href={caseStudy.links?.demo || caseStudy.links?.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:inline-flex items-center gap-1"
          >
            <span>Go To Full Site</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center justify-center md:justify-end gap-4 mt-2 md:mt-0">
          <a
            href={caseStudy.links?.demo || caseStudy.links?.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-2 md:px-0 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/30 md:hover:bg-transparent"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>System Operational</span>
          </a>
          <a
            href={caseStudy.links?.demo || caseStudy.links?.github || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 px-2 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/30"
          >
            <span>Go To Full Site</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CaseStudyDashboard;
