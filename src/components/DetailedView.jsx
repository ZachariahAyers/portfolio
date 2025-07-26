import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Briefcase, Code, Award, Calendar, MapPin, ExternalLink, Github, Globe, Users, Zap, FileText, Download, Rocket, Building, GraduationCap, Package, Brain, Cloud, Database, Filter, ChevronDown, Star, Layers, Shield } from 'lucide-react';
import StreamingText from './StreamingText';
import StreamingTextSimple from './StreamingTextSimple';
import useGitHubStats from '../hooks/useGitHubStats';
import { Tooltip } from './Tooltip';

const DetailedView = ({ mode, onClose, profileData, resumeType, resumeData, jobDescription, onDownloadPDF, userInteractions, personalizedContent, onGenerateContent, onGenerateExecutiveSummary, onContactClick }) => {
  const navigate = useNavigate();
  const [streamingContent, setStreamingContent] = React.useState(null);
  const [executiveSummary, setExecutiveSummary] = React.useState(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isGeneratingExecutive, setIsGeneratingExecutive] = React.useState(false);
  const hasInitialized = React.useRef(false);

  // Reset when mode changes
  React.useEffect(() => {
    if (mode !== 'me') {
      hasInitialized.current = false;
      setStreamingContent(null);
      setExecutiveSummary(null);
      setIsGenerating(false);
      setIsGeneratingExecutive(false);
    }
  }, [mode]);

  // Handle content generation when ME view opens
  React.useEffect(() => {
    if (mode === 'me' && !hasInitialized.current) {
      hasInitialized.current = true;
      
      // Generate executive summary
      if (onGenerateExecutiveSummary) {
        setIsGeneratingExecutive(true);
        onGenerateExecutiveSummary()
          .then(summary => {
            setExecutiveSummary(summary);
            setIsGeneratingExecutive(false);
          })
          .catch((error) => {
            // Executive summary generation failed - using default
            setExecutiveSummary(profileData.personal.executiveSummary[0]);
            setIsGeneratingExecutive(false);
          });
      } else {
        setExecutiveSummary(profileData.personal.executiveSummary[0]);
      }
      
      // Generate bullet points
      if (onGenerateContent) {
        setIsGenerating(true);
        onGenerateContent()
          .then(newContent => {
            setStreamingContent(newContent);
            setIsGenerating(false);
          })
          .catch((error) => {
            // AI generation failed - using static content
            const fallback = {
              bulletPoints: profileData.personal.whatIBring
            };
            setStreamingContent(fallback);
            setIsGenerating(false);
          });
      } else {
        setStreamingContent({
          bulletPoints: profileData.personal.whatIBring
        });
      }
    }
  }, [mode, onGenerateContent, onGenerateExecutiveSummary, profileData.personal.whatIBring, profileData.personal.executiveSummary]);
  const renderMeView = () => (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Section: Image | Name/Title | Contact Info */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Image */}
        <div className="flex-shrink-0 flex items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl">
            <img src={profileData.personal.avatarPath} alt={profileData.personal.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name and Title */}
        <div className="flex-1 text-center lg:text-left flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileData.personal.name}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-nowrap">{profileData.personal.title}</p>
          <p className="text-blue-400 italic text-sm mt-1">"{profileData.personal.tagline}"</p>
        </div>

        {/* Contact Info */}
        <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 min-w-[280px]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Connect With Me</h2>
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
                <Github size={14} /> GitHub Portfolio
              </a>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Executive Summary Section */}
      <div className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 border border-blue-400 dark:border-blue-500/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="text-blue-400" /> Executive Summary
        </h2>
        {isGeneratingExecutive || !executiveSummary ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:75ms]"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
            </div>
          </div>
        ) : (
          <StreamingTextSimple 
            text={executiveSummary}
            speed={8}
          />
        )}
      </div>

      {/* What I Can Bring to Your Team Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-400 dark:border-purple-500/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="text-purple-400" /> What I Can Bring to Your Team
        </h2>
        {isGenerating || !streamingContent ? (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:75ms]"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
            </div>
          </div>
        ) : (
          <StreamingText 
            bulletPoints={streamingContent?.bulletPoints || []}
            speed={8}
          />
        )}
      </div>
    </div>
  );

  const renderProjectsView = () => {
    const [selectedTech, setSelectedTech] = React.useState('all');
    const [selectedType, setSelectedType] = React.useState('all');
    const [expandedProjects, setExpandedProjects] = React.useState(new Set());
    const [showAllTechs, setShowAllTechs] = React.useState(false);
    const [showCurrentOnly, setShowCurrentOnly] = React.useState(false);
    
    // Get GitHub stats
    const githubStats = useGitHubStats();

    // Flatten all projects into a single array
    const allProjects = React.useMemo(() => {
      const projects = [];
      
      // Process each category in order of importance
      const categories = ['opensource', 'enterprise', 'freelance', 'other']; // opensource acts as featured
      
      categories.forEach(category => {
        if (profileData.projects?.[category]) {
          Object.entries(profileData.projects[category]).forEach(([key, project]) => {
            projects.push({
              ...project,
              id: `${category}-${key}`,
              category: category,
              type: category,
              technologies: project.technologies ? 
                (Array.isArray(project.technologies) ? project.technologies : project.technologies.split(', ')) : [],
              image: project.image || project.screenshot || null,
              demo: project.demo || null
            });
          });
        }
      });

      return projects;
    }, [profileData]);

    // Extract unique technologies from all projects
    const uniqueTechnologies = React.useMemo(() => {
      const techSet = new Set();
      allProjects.forEach(project => {
        if (project.technologies && Array.isArray(project.technologies)) {
          project.technologies.forEach(tech => {
            techSet.add(tech);
          });
        }
      });
      return Array.from(techSet).sort();
    }, [allProjects]);

    // Calculate technology counts based on selected type filter
    const dynamicTechCounts = React.useMemo(() => {
      const techCounts = {};
      
      // Use filtered projects by type for counting
      const projectsToCount = selectedType === 'all' 
        ? allProjects 
        : allProjects.filter(project => project.type === selectedType);
      
      projectsToCount.forEach(project => {
        if (project.technologies && Array.isArray(project.technologies)) {
          project.technologies.forEach(tech => {
            techCounts[tech] = (techCounts[tech] || 0) + 1;
          });
        }
      });

      return techCounts;
    }, [allProjects, selectedType]);

    // Calculate type counts based on selected technology filter
    const dynamicTypeCounts = React.useMemo(() => {
      const typeCounts = {
        opensource: 0,
        enterprise: 0,
        freelance: 0,
        other: 0
      };
      
      // Use projects filtered by technology for counting
      const projectsToCount = selectedTech === 'all'
        ? allProjects
        : allProjects.filter(project => 
            project.technologies && project.technologies.includes(selectedTech)
          );
      
      projectsToCount.forEach(project => {
        if (typeCounts.hasOwnProperty(project.type)) {
          typeCounts[project.type]++;
        }
      });
      
      return typeCounts;
    }, [allProjects, selectedTech]);

    // Sort technologies by count for display
    const sortedTechnologies = React.useMemo(() => {
      return uniqueTechnologies.sort((a, b) => {
        const countA = dynamicTechCounts[a] || 0;
        const countB = dynamicTechCounts[b] || 0;
        return countB - countA; // Sort descending
      });
    }, [uniqueTechnologies, dynamicTechCounts]);

    // Filter projects by selected type and technology
    const filteredProjects = React.useMemo(() => {
      let projects = allProjects;
      
      // Filter by current focus
      if (showCurrentOnly) {
        projects = projects.filter(project => project.current === true);
      }
      
      // Filter by type
      if (selectedType !== 'all' && !showCurrentOnly) {
        projects = projects.filter(project => project.type === selectedType);
      }
      
      // Filter by technology
      if (selectedTech !== 'all') {
        projects = projects.filter(project => 
          project.technologies && project.technologies.includes(selectedTech)
        );
      }
      
      // Sort to put current projects first
      projects.sort((a, b) => {
        if (a.current && !b.current) return -1;
        if (!a.current && b.current) return 1;
        return 0;
      });
      
      return projects;
    }, [allProjects, selectedType, selectedTech, showCurrentOnly]);

    // Helper functions
    const getProjectIcon = (project) => {
      if (project.type === 'enterprise') return Building;
      if (project.type === 'opensource') return Package;
      if (project.type === 'freelance') return Briefcase;
      if (project.type === 'other') return Code;
      // Secondary icon based on technology
      if (project.technologies && project.technologies.some(t => t.includes('AI') || t.includes('ML'))) return Brain;
      if (project.technologies && project.technologies.some(t => t.includes('AWS') || t.includes('Azure'))) return Cloud;
      if (project.technologies && project.technologies.some(t => t.includes('Mobile') || t.includes('Native'))) return Rocket;
      return Code;
    };

    const getProjectTheme = (project) => {
      if (project.current) return 'dark:from-cyan-900/30 dark:via-cyan-800/25 dark:to-yellow-700/20 from-green-50 via-cyan-50 to-yellow-50 border-green-500 dark:border-green-500/40';
      if (project.type === 'enterprise') return 'dark:from-purple-900/20 dark:to-pink-900/20 from-purple-50 to-pink-50 border-purple-500 dark:border-purple-500/30';
      if (project.type === 'opensource') return 'dark:from-blue-900/20 dark:to-cyan-900/20 from-blue-50 to-cyan-50 border-blue-500 dark:border-blue-500/30';
      if (project.type === 'freelance') return 'dark:from-amber-900/20 dark:to-orange-900/20 from-amber-50 to-orange-50 border-amber-500 dark:border-amber-500/30';
      if (project.type === 'other') return 'dark:from-green-900/20 dark:to-emerald-900/20 from-green-50 to-emerald-50 border-green-500 dark:border-green-500/30';
      return 'dark:from-gray-800/20 dark:to-gray-700/20 from-gray-100 to-gray-200 border-gray-500 dark:border-gray-600/30';
    };

    const toggleProjectExpanded = (projectId) => {
      const newExpanded = new Set(expandedProjects);
      if (newExpanded.has(projectId)) {
        newExpanded.delete(projectId);
      } else {
        newExpanded.add(projectId);
      }
      setExpandedProjects(newExpanded);
    };

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-400 dark:border-blue-500/30">
          {/* GitHub Stats in top right corner */}
          <div className="absolute top-4 right-4 text-sm">
            <div className="bg-gray-200 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 flex items-center gap-2">
              <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Stars: </span>
              <span className="text-gray-900 dark:text-white font-bold inline-flex items-center gap-1">
                {githubStats.loading ? (
                  <span className="text-xs">Loading...</span>
                ) : githubStats.error ? (
                  <span className="text-xs">--</span>
                ) : (
                  <>
                    <Star className="w-3 h-3 text-yellow-500" />
                    {githubStats.totalStars}
                  </>
                )}
              </span>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <Rocket className="text-blue-400" />
              Projects & Creations
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              From enterprise transformations to open-source contributions
            </p>
            <div className="flex justify-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-gray-200 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                <span className="text-gray-600 dark:text-gray-400">Total: </span>
                <span className="text-gray-900 dark:text-white font-bold">{allProjects.length}</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                <span className="text-gray-600 dark:text-gray-400">Open Source: </span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {allProjects.filter(p => p.github).length}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                <span className="text-gray-600 dark:text-gray-400">Live Deployments: </span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {allProjects.filter(p => p.url).length}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-800/50 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                <span className="text-gray-600 dark:text-gray-400">Case Studies: </span>
                <span className="text-gray-900 dark:text-white font-bold">
                  {allProjects.filter(p => p.caseStudy).length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Type Filter Chips */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-4">
            <Tooltip content="Show all project types">
              <button
                onClick={() => {
                  setSelectedType('all');
                  setShowCurrentOnly(false);
                }}
                aria-label={`Show all project types, ${allProjects.length} total`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedType === 'all' && !showCurrentOnly
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                All Types
              </button>
            </Tooltip>
            <Tooltip content="Show projects I'm actively working on">
              <button
                onClick={() => {
                  if (showCurrentOnly) {
                    setShowCurrentOnly(false);
                    setSelectedType('all');
                  } else {
                    setShowCurrentOnly(true);
                    setSelectedType('all');
                  }
                }}
                aria-label={`${showCurrentOnly ? 'Show all projects' : 'Show only current projects'}, ${allProjects.filter(p => p.current).length} current`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  showCurrentOnly 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <Zap className="inline w-3 h-3 mr-1" />
                Current Focus ({allProjects.filter(p => p.current).length})
              </button>
            </Tooltip>
            <Tooltip content="Show open source contributions">
              <button
                onClick={() => {
                  setSelectedType('opensource');
                  setShowCurrentOnly(false);
                }}
                aria-label={`Filter by open source projects, ${dynamicTypeCounts.opensource} projects`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedType === 'opensource' && !showCurrentOnly
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                Featured/Open Source ({dynamicTypeCounts.opensource})
              </button>
            </Tooltip>
            <Tooltip content="Show large-scale corporate projects">
              <button
                onClick={() => {
                  setSelectedType('enterprise');
                  setShowCurrentOnly(false);
                }}
                aria-label={`Filter by enterprise projects, ${dynamicTypeCounts.enterprise} projects`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedType === 'enterprise' && !showCurrentOnly
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                Enterprise ({dynamicTypeCounts.enterprise})
              </button>
            </Tooltip>
            <Tooltip content="Show freelance client projects">
              <button
                onClick={() => {
                  setSelectedType('freelance');
                  setShowCurrentOnly(false);
                }}
                aria-label={`Filter by freelance projects, ${dynamicTypeCounts.freelance} projects`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedType === 'freelance' && !showCurrentOnly
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                Freelance ({dynamicTypeCounts.freelance})
              </button>
            </Tooltip>
            <Tooltip content="Show personal and experimental projects">
              <button
                onClick={() => {
                  setSelectedType('other');
                  setShowCurrentOnly(false);
                }}
                aria-label={`Filter by other projects, ${dynamicTypeCounts.other} projects`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedType === 'other' && !showCurrentOnly
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                Other ({dynamicTypeCounts.other})
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Technology Filter */}
        <div className="bg-gray-200 dark:bg-gray-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Filter by Technology
            </h3>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Tooltip content="Show projects using any technology">
              <button
                onClick={() => setSelectedTech('all')}
                aria-label={`Show all technologies, ${selectedType === 'all' ? allProjects.length : allProjects.filter(p => p.type === selectedType).length} projects`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedTech === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                All ({selectedType === 'all' ? allProjects.length : allProjects.filter(p => p.type === selectedType).length})
              </button>
            </Tooltip>
            {sortedTechnologies
              .filter(tech => dynamicTechCounts[tech] > 0)
              .slice(0, showAllTechs ? undefined : 10)
              .map(tech => {
                const count = dynamicTechCounts[tech] || 0;
                return (
                  <Tooltip key={tech} content={`Filter by ${tech} projects`}>
                    <button
                      onClick={() => setSelectedTech(tech)}
                      aria-label={`Filter by ${tech}, ${count} projects`}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        selectedTech === tech 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tech} ({count})
                    </button>
                  </Tooltip>
                );
              })}
            {sortedTechnologies.filter(tech => dynamicTechCounts[tech] > 0).length > 10 && (
              <Tooltip content={showAllTechs ? "Show fewer technology filters" : "Show all available technologies"}>
                <button
                  onClick={() => setShowAllTechs(!showAllTechs)}
                  aria-label={showAllTechs ? "Show fewer technology filters" : `Show ${sortedTechnologies.filter(tech => dynamicTechCounts[tech] > 0).length - 10} more technology filters`}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {showAllTechs ? 'Show less' : `Show ${sortedTechnologies.filter(tech => dynamicTechCounts[tech] > 0).length - 10} more`}
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(project => {
            const Icon = getProjectIcon(project);
            const theme = getProjectTheme(project);
            const isExpanded = expandedProjects.has(project.id);
            
            return (
              <div
                key={project.id}
                className={`bg-transparent dark:bg-gradient-to-br ${theme} rounded-lg p-5 border transition-all duration-200 hover:scale-[1.01] hover:shadow-lg flex flex-col ${
                  project.current 
                    ? 'ring-2 ring-green-400/60 shadow-lg shadow-green-400/10' 
                    : ''
                }`}
              >
                {/* Main Content - Flex Grow */}
                <div className="flex-grow relative z-10">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                    </div>
                    {project.current && (
                      <div className="flex items-center gap-1 bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium border border-green-400/30">
                        <Zap className="w-3 h-3" />
                        <span>Current Focus</span>
                      </div>
                    )}
                  </div>

                  {/* Project Image */}
                  <div className="relative w-full h-40 mb-3 bg-gray-800 rounded-md overflow-hidden">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800">
                        <Icon className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Project Description */}
                  <p className={`text-gray-700 dark:text-gray-300 text-sm mb-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {project.description || 'No description available'}
                  </p>

                  {/* Show more/less button */}
                  {project.description && project.description.length > 120 && (
                    <Tooltip content={isExpanded ? "Show less details" : "Show full project details"}>
                      <button
                        onClick={() => toggleProjectExpanded(project.id)}
                        aria-label={`${isExpanded ? 'Show less' : 'Show more'} details for ${project.name}`}
                        className="text-xs text-blue-400 hover:text-blue-300 mb-3"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    </Tooltip>
                  )}

                  {/* Impact */}
                  {project.impact && (
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-md px-3 py-1 mb-3">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        <span className="font-semibold">Impact:</span> {project.impact}
                      </p>
                    </div>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 5).map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer - Always at Bottom */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-700/50 mt-auto relative z-10">
                  {project.url && (
                    <a
                      href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View live deployment of ${project.name} in new tab`}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Globe className="w-3 h-3" />
                      Live Deployment
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch video demo of ${project.name} in new tab`}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Zap className="w-3 h-3" />
                      Video Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View source code for ${project.name} on GitHub in new tab`}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Github className="w-3 h-3" />
                      Source
                    </a>
                  )}
                  {project.devOps && (
                    <a
                      href={project.devOps}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View DevOps pipeline for ${project.name} in new tab`}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Zap className="w-3 h-3" />
                      DevOps
                    </a>
                  )}
                  {project.caseStudy && (
                    <Link
                      to={project.caseStudy}
                      aria-label={`Read case study for ${project.name}`}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <FileText className="w-3 h-3" />
                      Case Study
                    </Link>
                  )}
                  {project.type === 'enterprise' && project.caseStudy && (
                    <Link
                      to={project.caseStudy}
                      aria-label="View enterprise project details"
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 ml-auto"
                    >
                      <Building className="w-3 h-3" />
                      Enterprise
                    </Link>
                  )}
                  {project.type === 'freelance' && project.caseStudy && (
                    <Link
                      to={project.caseStudy}
                      aria-label="View freelance project details"
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 ml-auto"
                    >
                      <Briefcase className="w-3 h-3" />
                      Freelance
                    </Link>
                  )}
                  {project.type === 'opensource' && (
                    <a
                      href={project.github ? (project.github.startsWith('http') ? project.github : `https://${project.github}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View open source project on GitHub in new tab"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 ml-auto"
                    >
                      <Package className="w-3 h-3" />
                      Open Source
                    </a>
                  )}
                  {project.type === 'other' && project.caseStudy && (
                    <Link
                      to={project.caseStudy}
                      aria-label="View project details"
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 ml-auto"
                    >
                      <Code className="w-3 h-3" />
                      Other
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No projects found with {selectedTech} technology.</p>
            <Tooltip content="Show all technologies">
              <button
                onClick={() => setSelectedTech('all')}
                aria-label="Clear technology filter"
                className="mt-2 text-blue-400 hover:text-blue-300"
              >
                Clear filter
              </button>
            </Tooltip>
          </div>
        )}

      </div>
    );
  };

  const renderSkillsView = () => {
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [selectedLevel, setSelectedLevel] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [expandedCategories, setExpandedCategories] = React.useState(new Set(['expert', 'proficient', 'familiar']));
    const [viewMode, setViewMode] = React.useState('grid'); // grid or list
    const [showCertifications, setShowCertifications] = React.useState(false);
    
    // Flatten all skills for searching and filtering
    const allSkills = React.useMemo(() => {
      const skills = [];
      
      ['expert', 'proficient', 'familiar'].forEach(level => {
        if (profileData.skills[level]) {
          Object.entries(profileData.skills[level]).forEach(([category, skillList]) => {
            if (category !== 'description' && Array.isArray(skillList)) {
              skillList.forEach(skill => {
                skills.push({
                  name: skill,
                  level: level,
                  category: category,
                  description: profileData.skills[level].description
                });
              });
            }
          });
        }
      });
      
      return skills;
    }, [profileData]);

    // Get unique categories
    const uniqueCategories = React.useMemo(() => {
      const categories = new Set();
      allSkills.forEach(skill => categories.add(skill.category));
      return Array.from(categories).sort();
    }, [allSkills]);

    // Calculate counts
    const skillCounts = React.useMemo(() => {
      const counts = {
        total: allSkills.length,
        byLevel: { expert: 0, proficient: 0, familiar: 0 },
        byCategory: {}
      };
      
      allSkills.forEach(skill => {
        counts.byLevel[skill.level]++;
        counts.byCategory[skill.category] = (counts.byCategory[skill.category] || 0) + 1;
      });
      
      return counts;
    }, [allSkills]);

    // Filter skills
    const filteredSkills = React.useMemo(() => {
      return allSkills.filter(skill => {
        const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
        const matchesLevel = selectedLevel === 'all' || skill.level === selectedLevel;
        const matchesSearch = searchQuery === '' || 
          skill.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesLevel && matchesSearch;
      });
    }, [allSkills, selectedCategory, selectedLevel, searchQuery]);

    // Calculate dynamic counts based on active filters
    const dynamicCounts = React.useMemo(() => {
      const counts = {
        byLevel: { expert: 0, proficient: 0, familiar: 0 },
        byCategory: {}
      };
      
      // Count skills that match current filters
      filteredSkills.forEach(skill => {
        counts.byLevel[skill.level]++;
        counts.byCategory[skill.category] = (counts.byCategory[skill.category] || 0) + 1;
      });
      
      return counts;
    }, [filteredSkills]);

    // Calculate level counts when a category is selected
    const dynamicLevelCounts = React.useMemo(() => {
      const counts = { expert: 0, proficient: 0, familiar: 0 };
      
      const skillsToCount = selectedCategory === 'all' 
        ? allSkills 
        : allSkills.filter(skill => skill.category === selectedCategory);
      
      skillsToCount.forEach(skill => {
        if (skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          counts[skill.level]++;
        }
      });
      
      return counts;
    }, [allSkills, selectedCategory, searchQuery]);

    // Calculate category counts when a level is selected
    const dynamicCategoryCounts = React.useMemo(() => {
      const counts = {};
      
      const skillsToCount = selectedLevel === 'all'
        ? allSkills
        : allSkills.filter(skill => skill.level === selectedLevel);
      
      skillsToCount.forEach(skill => {
        if (skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          counts[skill.category] = (counts[skill.category] || 0) + 1;
        }
      });
      
      return counts;
    }, [allSkills, selectedLevel, searchQuery]);

    // Group filtered skills by level
    const groupedSkills = React.useMemo(() => {
      const grouped = {
        expert: { skills: [], description: profileData.skills.expert.description },
        proficient: { skills: [], description: profileData.skills.proficient.description },
        familiar: { skills: [], description: profileData.skills.familiar.description }
      };
      
      filteredSkills.forEach(skill => {
        grouped[skill.level].skills.push(skill);
      });
      
      return grouped;
    }, [filteredSkills, profileData]);

    // Toggle category expansion
    const toggleCategory = (level) => {
      const newExpanded = new Set(expandedCategories);
      if (newExpanded.has(level)) {
        newExpanded.delete(level);
      } else {
        newExpanded.add(level);
      }
      setExpandedCategories(newExpanded);
    };

    // Get icon for skill category
    const getCategoryIcon = (category) => {
      const icons = {
        languages: Code,
        frontend: Globe,
        backend: Database,
        cloud: Cloud,
        infrastructure: Building,
        aiMl: Brain,
        databases: Database,
        architecture: Rocket,
        testing: Award,
        frameworks: Package,
        tools: Briefcase,
        others: Zap
      };
      return icons[category] || Code;
    };

    // Get theme for skill level
    const getLevelTheme = (level) => {
      if (level === 'expert') return 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-400 dark:border-blue-500/30 hover:border-blue-500 dark:hover:border-blue-400/50';
      if (level === 'proficient') return 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-400 dark:border-green-500/30 hover:border-green-500 dark:hover:border-green-400/50';
      if (level === 'familiar') return 'from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-400 dark:border-orange-500/30 hover:border-orange-500 dark:hover:border-orange-400/50';
      return 'from-gray-100 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-gray-400 dark:border-gray-600/30';
    };

    const getLevelAccentColor = (level) => {
      if (level === 'expert') return 'text-blue-400';
      if (level === 'proficient') return 'text-green-400';
      if (level === 'familiar') return 'text-orange-400';
      return 'text-gray-400';
    };

    // Count certifications
    const certificationCounts = React.useMemo(() => {
      let total = 0;
      let inProgress = 0;
      
      Object.entries(profileData.certifications).forEach(([category, certs]) => {
        if (Array.isArray(certs)) {
          total += certs.length;
          // Count certifications marked as "In Progress"
          certs.forEach(cert => {
            if (cert.includes('In Progress')) {
              inProgress++;
            }
          });
        }
      });
      
      return { total, completed: total - inProgress, inProgress };
    }, [profileData]);

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-400 dark:border-purple-500/30">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <Brain className="text-purple-400" />
              Technical Skills & Expertise
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              14+ years of building production systems across the full stack
            </p>
          </div>
          
          {/* Level Filter */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-4">
            <Tooltip content="Show skills from all proficiency levels">
              <button
                onClick={() => setSelectedLevel('all')}
                disabled={showCertifications}
                aria-label="Filter by all skill levels"
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  showCertifications 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : selectedLevel === 'all'
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                All Levels
              </button>
            </Tooltip>
            <Tooltip content="Show only expert level skills">
              <button
                onClick={() => setSelectedLevel('expert')}
                disabled={showCertifications}
                aria-label={`Filter by expert level skills, ${dynamicLevelCounts.expert} skills`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  showCertifications 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : selectedLevel === 'expert'
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <Award className="inline w-3 h-3 mr-1" />
                Expert ({dynamicLevelCounts.expert})
              </button>
            </Tooltip>
            <Tooltip content="Show only proficient level skills">
              <button
                onClick={() => setSelectedLevel('proficient')}
                disabled={showCertifications}
                aria-label={`Filter by proficient level skills, ${dynamicLevelCounts.proficient} skills`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  showCertifications 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : selectedLevel === 'proficient'
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                Proficient ({dynamicLevelCounts.proficient})
              </button>
            </Tooltip>
            <Tooltip content="Show only familiar level skills">
              <button
                onClick={() => setSelectedLevel('familiar')}
                disabled={showCertifications}
                aria-label={`Filter by familiar level skills, ${dynamicLevelCounts.familiar} skills`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  showCertifications 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : selectedLevel === 'familiar'
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                Familiar ({dynamicLevelCounts.familiar})
              </button>
            </Tooltip>
            <div className="border-l border-gray-400 dark:border-gray-600 mx-2 h-6"></div>
            <Tooltip content={showCertifications ? "Show skills" : "Show certifications and credentials"}>
              <button
                onClick={() => {
                  setShowCertifications(!showCertifications);
                  if (!showCertifications) {
                    setSelectedLevel('all');
                    setSelectedCategory('all');
                  }
                }}
                aria-label={`${showCertifications ? 'Show skills' : 'Show certifications'}, ${certificationCounts.total} total`}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  showCertifications
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <Award className="inline w-3 h-3 mr-1" />
                Certifications ({certificationCounts.total})
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Skills Overview Grid */}
        {!showCertifications && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Tooltip content="The coding languages I use to build software applications">
            <div className="block hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-lg p-3 border border-blue-400 dark:border-blue-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Languages</h3>
                </div>
                <p className="text-2xl font-bold text-blue-400">{skillCounts.byCategory.languages || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Programming Languages</p>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip content="Cloud platforms and artificial intelligence tools I work with">
            <div className="block hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-600/20 dark:to-pink-600/20 rounded-lg p-3 border border-purple-400 dark:border-purple-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Cloud & AI</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">{(skillCounts.byCategory.cloud || 0) + (skillCounts.byCategory.aiMl || 0)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Cloud / AI / Machine Learning</p>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip content="Technologies for creating user interfaces and web experiences">
            <div className="block hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-600/20 dark:to-emerald-600/20 rounded-lg p-3 border border-green-400 dark:border-green-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Frontend</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">{skillCounts.byCategory.frontend || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Design / Markup / UI Frameworks</p>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip content="Server-side technologies that power applications behind the scenes">
            <div className="block hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-600/20 dark:to-amber-600/20 rounded-lg p-3 border border-orange-400 dark:border-orange-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-orange-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Backend</h3>
                </div>
                <p className="text-2xl font-bold text-orange-400">{(skillCounts.byCategory.backend || 0) + (skillCounts.byCategory.databases || 0)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Servers / Databases</p>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip content="Tools and practices for automating software deployment and operations">
            <div className="block hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-600/20 dark:to-blue-600/20 rounded-lg p-3 border border-indigo-400 dark:border-indigo-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">DevOps</h3>
                </div>
                <p className="text-2xl font-bold text-indigo-400">{skillCounts.byCategory.infrastructure || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">CI/CD & Infrastructure</p>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip content="Security operations and compliance tools to protect systems and data">
            <div className="block hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-600/20 dark:to-pink-600/20 rounded-lg p-3 border border-red-400 dark:border-red-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">SpecOps</h3>
                </div>
                <p className="text-2xl font-bold text-red-400">{skillCounts.byCategory.tools || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Security & Compliance</p>
              </div>
            </div>
          </Tooltip>
        </div>
        )}

        {/* Category & Search Filter */}
        {!showCertifications && (
          <div className="bg-gray-200 dark:bg-gray-800/30 rounded-lg p-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search skills by name"
              className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" aria-hidden="true" />
          </div>
          
          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Filter by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Tooltip content="Show skills from all categories">
                <button
                  onClick={() => setSelectedCategory('all')}
                  aria-label="Show all skill categories"
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  All Categories
                </button>
              </Tooltip>
              {uniqueCategories.map(category => {
                const Icon = getCategoryIcon(category);
                const count = dynamicCategoryCounts[category] || 0;
                return (
                  <Tooltip key={category} content={`Filter by ${category} skills`}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      aria-label={`Filter by ${category} category, ${count} skills`}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1 ${
                        selectedCategory === category 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="capitalize">{category}</span>
                      <span>({count})</span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {/* Skills by Level */}
        {!showCertifications && ['expert', 'proficient', 'familiar'].map(level => {
          const levelData = groupedSkills[level];
          const isExpanded = expandedCategories.has(level);
          const levelSkills = levelData.skills;
          const theme = getLevelTheme(level);
          const accentColor = getLevelAccentColor(level);
          
          if (levelSkills.length === 0 && (selectedCategory !== 'all' || selectedLevel !== 'all' || searchQuery)) {
            return null;
          }
          
          return (
            <div key={level} className={`bg-gradient-to-br ${theme} rounded-lg border transition-all duration-200`}>
              <button
                onClick={() => toggleCategory(level)}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${level} level skills section`}
                aria-expanded={isExpanded}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-900/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {level === 'expert' && <Award className="text-yellow-400 w-6 h-6" />}
                  {level === 'proficient' && <Zap className="text-green-400 w-6 h-6" />}
                  {level === 'familiar' && <Package className="text-orange-400 w-6 h-6" />}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {level} Level
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {levelData.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-semibold ${accentColor}`}>
                    {levelSkills.length} skills
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              {isExpanded && levelSkills.length > 0 && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {levelSkills.map((skill, idx) => {
                      const CategoryIcon = getCategoryIcon(skill.category);
                      const skillSlug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      return (
                        <Tooltip key={`${skill.name}-${idx}`} content={`${skill.name} - ${skill.category}`}>
                          <div className="block">
                            <div className="group relative bg-gray-100 dark:bg-gray-900/20 backdrop-blur-sm rounded-lg p-4 border border-gray-300 dark:border-gray-700/50 hover:border-gray-400 dark:hover:border-gray-600/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg overflow-hidden">
                              {/* Gradient overlay on hover */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${
                                level === 'expert' ? 'from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10' :
                                level === 'proficient' ? 'from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10' :
                                'from-orange-600/0 to-amber-600/0 group-hover:from-orange-600/10 group-hover:to-amber-600/10'
                              } transition-all duration-300`} />
                              
                              <div className="relative z-10 flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CategoryIcon className={`w-4 h-4 ${accentColor} group-hover:scale-110 transition-transform`} />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                      {skill.name}
                                    </h3>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                                    {skill.category}
                                  </p>
                                  {/* Skill level indicator */}
                                  <div className="mt-2 h-1 bg-gray-700/30 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-500 ${
                                        level === 'expert' ? 'w-full bg-gradient-to-r from-blue-500 to-cyan-500' :
                                        level === 'proficient' ? 'w-3/4 bg-gradient-to-r from-green-500 to-emerald-500' :
                                        'w-1/2 bg-gradient-to-r from-orange-500 to-amber-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Certifications Section */}
        {showCertifications && (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-400 dark:border-purple-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-purple-400 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Certifications & Credentials
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profileData.certifications)
              .filter(([category]) => category !== 'inProgress')
              .map(([category, certs]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-purple-400 capitalize flex items-center gap-2">
                  {category === 'cloud' && <Cloud className="w-4 h-4" />}
                  {category === 'database' && <Database className="w-4 h-4" />}
                  {category === 'projectManagement' && <Briefcase className="w-4 h-4" />}
                  {category === 'engineering' && <Building className="w-4 h-4" />}
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="space-y-2">
                  {certs.map((cert, idx) => {
                    const certDetails = profileData.certificationDetails?.[cert];
                    const isInProgress = certDetails?.inProgress || cert.includes('In Progress');
                    return (
                      <div 
                        key={idx} 
                        className={`relative bg-gray-100 dark:bg-gray-900/20 backdrop-blur-sm rounded-lg p-3 border transition-all duration-200 hover:scale-[1.01] ${
                          isInProgress 
                            ? 'border-green-500/40 ring-2 ring-green-400/60 shadow-lg shadow-green-400/10' 
                            : 'border-gray-300 dark:border-gray-700/50 hover:border-purple-400 dark:hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2 flex-1">
                              {isInProgress ? (
                                <Zap className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              ) : (
                                <span className="text-purple-400 mt-0.5">•</span>
                              )}
                              <span className={isInProgress ? 'text-gray-700 dark:text-gray-200' : ''}>{cert.replace(' (In Progress)', '')}</span>
                            </p>
                            {isInProgress && (
                              <div className="flex items-center gap-1 bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium border border-green-400/30 whitespace-nowrap">
                                <Zap className="w-3 h-3" />
                                <span>In Progress</span>
                              </div>
                            )}
                          </div>
                          {certDetails?.credentialId && (
                            <div className="pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Credential ID:</span> {certDetails.credentialId}
                              {certDetails.verifyUrl && (
                                <a 
                                  href={certDetails.verifyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Verify ${cert.replace(' (In Progress)', '')} certification in new tab`}
                                  className="ml-2 text-purple-400 hover:text-purple-300 underline"
                                >
                                  Verify
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* No results message */}
        {!showCertifications && filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No skills found matching your criteria.</p>
            <Tooltip content="Reset all skill filters">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                aria-label="Clear all skill filters"
                className="mt-2 text-purple-400 hover:text-purple-300"
              >
                Clear all filters
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  };

  const renderStandardResumeView = () => (
    <div className="space-y-8">
      {/* Resume Header */}
      <div className="text-center space-y-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{profileData.personal.name}</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">{profileData.personal.title}</p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <span>{profileData.contact.email}</span>
          <span>{profileData.contact.location}</span>
          <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            LinkedIn Profile
          </a>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">Executive Summary</h2>
        {profileData.personal.executiveSummary.map((summary, idx) => (
          <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
        ))}
      </div>

      {/* Experience */}
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">Experience</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.experience.northrop.role}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.experience.northrop.period}</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profileData.experience.northrop.description}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-green-400">Impact:</strong> {profileData.experience.northrop.impact}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profileData.experience.meridianVega.role}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.experience.meridianVega.period}</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profileData.experience.meridianVega.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Multiple Roles @ AmeriSave Mortgage Corporation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.experience.amerisave.period}</p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Progressed from Full Stack Developer to Software Architect to Development Manager. 
            {profileData.experience.amerisave.architect.description}
          </p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="text-green-400">Impact:</strong> {profileData.experience.amerisave.architect.impact}</p>
        </div>
      </div>

      {/* Technical Skills */}
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">Technical Skills</h2>
        <div className="grid gap-3">
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-blue-400">Languages:</strong> {profileData.skills.expert.languages.join(', ')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-blue-400">Frontend:</strong> {profileData.skills.expert.frontend.join(', ')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-blue-400">Backend:</strong> {profileData.skills.expert.backend.join(', ')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-blue-400">Cloud & Infrastructure:</strong> {profileData.skills.expert.cloud.join(', ')}, {profileData.skills.expert.infrastructure.join(', ')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-blue-400">AI/ML:</strong> {profileData.skills.expert.aiMl.join(', ')}
          </p>
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">Education & Certifications</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong className="text-blue-400">{profileData.education.university.degree}</strong><br/>
              {profileData.education.university.institution} | {profileData.education.university.period}
            </p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              <strong className="text-blue-400">Certifications:</strong> {profileData.certifications.cloud[0]}, {profileData.certifications.engineering[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTailoredResumeView = () => {
    const analysis = resumeData?.analysis || '';
    const relevantSkills = analysis.match(/Skills:([^]*?)(?=Experience:|$)/)?.[1]?.trim() || '';
    const relevantExperience = analysis.match(/Experience:([^]*?)(?=Projects:|$)/)?.[1]?.trim() || '';
    
    return (
      <div className="space-y-8">
        {/* Resume Header */}
        <div className="text-center space-y-4 bg-gray-800/50 rounded-lg p-6">
          <h1 className="text-4xl font-bold text-white">{profileData.personal.name}</h1>
          <p className="text-xl text-gray-300">{profileData.personal.title} | AI/ML Implementation Specialist</p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
            <span>{profileData.contact.location}</span>
            <span>{profileData.contact.location}</span>
            <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Tailored Summary */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-400 dark:border-blue-500/30">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="text-blue-400" />
            Tailored Summary for This Role
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {analysis.split('\n')[0] || profileData.personal.executiveSummary[0]}
          </p>
        </div>

        {/* Relevant Experience */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Relevant Experience</h2>
          
          {(relevantExperience.includes('Northrop') || jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml')) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{profileData.experience.northrop.role}</h3>
              <p className="text-sm text-gray-400">{profileData.experience.northrop.period}</p>
              <ul className="text-gray-300 space-y-2 pl-4">
                <li>• Implementing ML-driven predictive maintenance with 85% accuracy</li>
                <li>• Building RAG systems for technical documentation search</li>
                <li>• Reducing deployment time from 2 weeks to 2 hours</li>
                <li>• Prevented $300K+ in downtime through predictive analytics</li>
              </ul>
            </div>
          )}

          {(relevantExperience.includes('AmeriSave') || jobDescription.toLowerCase().includes('microservice') || jobDescription.toLowerCase().includes('scale')) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Software Architect @ AmeriSave Mortgage</h3>
              <p className="text-sm text-gray-400">Mar 2021 - Feb 2023</p>
              <ul className="text-gray-300 space-y-2 pl-4">
                <li>• Orchestrated 500+ microservice ecosystem with GraphQL Federation</li>
                <li>• Led database decomposition from 4000+ table monolith</li>
                <li>• Reduced loan processing time by 50%</li>
                <li>• Trained and mentored 60+ developers in modern practices</li>
              </ul>
            </div>
          )}
        </div>

        {/* Key Technical Skills for This Role */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Key Technical Skills for This Role</h2>
          {relevantSkills ? (
            <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: relevantSkills }} />
          ) : (
            <div className="grid gap-3">
              <p className="text-gray-300">
                <strong className="text-blue-400">Primary:</strong> {profileData.skills.expert.languages.slice(0, 3).join(', ')}, {profileData.skills.expert.frontend.slice(0, 2).join(', ')}, {profileData.skills.expert.backend.slice(0, 2).join(', ')}
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Cloud & Infrastructure:</strong> {profileData.skills.expert.cloud.join(', ')}
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">AI/ML:</strong> {profileData.skills.expert.aiMl.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Relevant Projects */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Relevant Projects</h2>
          <div className="space-y-3">
            {(jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml')) && (
              <p className="text-gray-300">
                <strong className="text-blue-400">Production RAG Systems:</strong> Architected enterprise-scale retrieval-augmented generation for technical documentation
              </p>
            )}
            <p className="text-gray-300">
              <strong className="text-blue-400">AssembleJS:</strong> Created modern micro-frontend framework with islands architecture
            </p>
            {jobDescription.toLowerCase().includes('scale') && (
              <p className="text-gray-300">
                <strong className="text-blue-400">500+ Microservices Migration:</strong> Led transformation handling millions of daily transactions
              </p>
            )}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Education & Certifications</h2>
          <div className="space-y-3">
            <p className="text-gray-300">
              <strong className="text-blue-400">{profileData.education.university.degree}</strong><br/>
              {profileData.education.university.institution}
            </p>
            <p className="text-gray-300">
              <strong className="text-blue-400">Relevant Certifications:</strong> {profileData.certifications.cloud[0]}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case 'me':
        return renderMeView();
      case 'projects':
        return renderProjectsView();
      case 'skills':
        return renderSkillsView();
      case 'resume-standard':
        return renderStandardResumeView();
      case 'resume-tailored':
        return renderTailoredResumeView();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in shadow-xl">
        <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
            {mode === 'resume-standard' && (
              <>
                <FileText className="h-6 w-6 text-blue-400" />
                Standard Resume
              </>
            )}
            {mode === 'resume-tailored' && (
              <>
                <FileText className="h-6 w-6 text-purple-400" />
                Tailored Resume
              </>
            )}
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
            {(mode === 'resume-standard' || mode === 'resume-tailored') && onDownloadPDF && (
              <Tooltip content="Download resume as PDF">
                <button
                  onClick={onDownloadPDF}
                  aria-label="Download resume as PDF file"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
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