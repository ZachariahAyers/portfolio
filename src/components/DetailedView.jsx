import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Briefcase, Code, Award, Calendar, MapPin, ExternalLink, Github, Globe, Users, Zap, FileText, Download, Rocket, Building, GraduationCap, Package, Brain, Cloud, Database, Filter, Maximize2 } from 'lucide-react';
import StreamingText from './StreamingText';
import StreamingTextSimple from './StreamingTextSimple';

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
            console.error('Executive summary generation failed:', error);
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
            console.error('AI generation failed:', error);
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
          <h1 className="text-3xl font-bold text-white">{profileData.personal.name}</h1>
          <p className="text-lg text-gray-300 whitespace-nowrap">{profileData.personal.title}</p>
          <p className="text-blue-400 italic text-sm mt-1">"{profileData.personal.tagline}"</p>
        </div>

        {/* Contact Info */}
        <div className="flex-shrink-0 bg-gray-800/50 rounded-lg p-4 min-w-[280px]">
          <h2 className="text-lg font-bold text-white mb-3">Connect With Me</h2>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (onContactClick) onContactClick();
              }}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              <ExternalLink size={14} /> {profileData.contact.email}
            </a>
            <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <ExternalLink size={14} /> LinkedIn Profile
            </a>
            <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Github size={14} /> GitHub Portfolio
            </a>
            <a href={profileData.contact.calendly} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Calendar size={14} /> Schedule a Call
            </a>
          </div>
        </div>
      </div>

      {/* Executive Summary Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-lg p-6 border border-blue-500/30">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
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
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
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
      if (project.current) return 'from-cyan-900/30 via-cyan-800/25 to-yellow-700/20 border-green-500/40';
      if (project.type === 'enterprise') return 'from-purple-900/20 to-pink-900/20 border-purple-500/30';
      if (project.type === 'opensource') return 'from-blue-900/20 to-cyan-900/20 border-blue-500/30';
      if (project.type === 'freelance') return 'from-amber-900/20 to-orange-900/20 border-amber-500/30';
      if (project.type === 'other') return 'from-green-900/20 to-emerald-900/20 border-green-500/30';
      return 'from-gray-800/20 to-gray-700/20 border-gray-600/30';
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
        <div className="text-center space-y-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/30">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Rocket className="text-blue-400" />
            Projects & Creations
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From enterprise transformations to open-source contributions
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg px-3 py-1">
              <span className="text-gray-400">Total: </span>
              <span className="text-white font-bold">{allProjects.length}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg px-3 py-1">
              <span className="text-gray-400">Open Source: </span>
              <span className="text-white font-bold">
                {allProjects.filter(p => p.github).length}
              </span>
            </div>
            <div className="bg-gray-800/50 rounded-lg px-3 py-1">
              <span className="text-gray-400">Live Deployments: </span>
              <span className="text-white font-bold">
                {allProjects.filter(p => p.url).length}
              </span>
            </div>
          </div>
          
          {/* Type Filter Chips */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => {
                setSelectedType('all');
                setShowCurrentOnly(false);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === 'all' && !showCurrentOnly
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Types
            </button>
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
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                showCurrentOnly 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Zap className="inline w-3 h-3 mr-1" />
              Current Focus ({allProjects.filter(p => p.current).length})
            </button>
            <button
              onClick={() => {
                setSelectedType('opensource');
                setShowCurrentOnly(false);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === 'opensource' && !showCurrentOnly
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Featured/Open Source ({dynamicTypeCounts.opensource})
            </button>
            <button
              onClick={() => {
                setSelectedType('enterprise');
                setShowCurrentOnly(false);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === 'enterprise' && !showCurrentOnly
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Enterprise ({dynamicTypeCounts.enterprise})
            </button>
            <button
              onClick={() => {
                setSelectedType('freelance');
                setShowCurrentOnly(false);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === 'freelance' && !showCurrentOnly
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Freelance ({dynamicTypeCounts.freelance})
            </button>
            <button
              onClick={() => {
                setSelectedType('other');
                setShowCurrentOnly(false);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedType === 'other' && !showCurrentOnly
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Other ({dynamicTypeCounts.other})
            </button>
          </div>
        </div>

        {/* Technology Filter */}
        <div className="bg-gray-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Filter by Technology
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedTech === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All ({selectedType === 'all' ? allProjects.length : allProjects.filter(p => p.type === selectedType).length})
            </button>
            {sortedTechnologies
              .filter(tech => dynamicTechCounts[tech] > 0)
              .slice(0, showAllTechs ? undefined : 10)
              .map(tech => {
                const count = dynamicTechCounts[tech] || 0;
                return (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedTech === tech 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tech} ({count})
                  </button>
                );
              })}
            {sortedTechnologies.filter(tech => dynamicTechCounts[tech] > 0).length > 10 && (
              <button
                onClick={() => setShowAllTechs(!showAllTechs)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
              >
                {showAllTechs ? 'Show less' : `Show ${sortedTechnologies.filter(tech => dynamicTechCounts[tech] > 0).length - 10} more`}
              </button>
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
                className={`bg-gradient-to-br ${theme} rounded-lg p-5 border transition-all duration-200 hover:scale-[1.01] hover:shadow-lg flex flex-col ${
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
                      <h3 className="text-lg font-bold text-white">
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
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                        <Icon className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Project Description */}
                  <p className={`text-gray-300 text-sm mb-3 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {project.description || 'No description available'}
                  </p>

                  {/* Show more/less button */}
                  {project.description && project.description.length > 120 && (
                    <button
                      onClick={() => toggleProjectExpanded(project.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 mb-3"
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}

                  {/* Impact */}
                  {project.impact && (
                    <div className="bg-green-900/30 rounded-md px-3 py-1 mb-3">
                      <p className="text-xs text-green-300">
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
                          className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full text-xs">
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
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Zap className="w-3 h-3" />
                      DevOps
                    </a>
                  )}
                  {project.caseStudy && (
                    <a
                      href={project.caseStudy.startsWith('http') ? project.caseStudy : `https://${project.caseStudy}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <FileText className="w-3 h-3" />
                      Case Study
                    </a>
                  )}
                  {project.type === 'enterprise' && (
                    <a
                      href={project.caseStudy ? (project.caseStudy.startsWith('http') ? project.caseStudy : `https://${project.caseStudy}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 ml-auto"
                    >
                      <Building className="w-3 h-3" />
                      Enterprise
                    </a>
                  )}
                  {project.type === 'freelance' && (
                    <a
                      href={project.caseStudy ? (project.caseStudy.startsWith('http') ? project.caseStudy : `https://${project.caseStudy}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 ml-auto"
                    >
                      <Briefcase className="w-3 h-3" />
                      Freelance
                    </a>
                  )}
                  {project.type === 'opensource' && (
                    <a
                      href={project.github ? (project.github.startsWith('http') ? project.github : `https://${project.github}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 ml-auto"
                    >
                      <Package className="w-3 h-3" />
                      Open Source
                    </a>
                  )}
                  {project.type === 'other' && (
                    <a
                      href={project.caseStudy ? (project.caseStudy.startsWith('http') ? project.caseStudy : `https://${project.caseStudy}`) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 ml-auto"
                    >
                      <Code className="w-3 h-3" />
                      Other
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No projects found with {selectedTech} technology.</p>
            <button
              onClick={() => setSelectedTech('all')}
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              Clear filter
            </button>
          </div>
        )}

      </div>
    );
  };

  const renderSkillsView = () => (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Technical Skills</h1>
      
      {/* Expert Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="text-yellow-400" /> Expert Level
        </h2>
        <p className="text-gray-400 italic">{profileData.skills.expert.description}</p>
        <div className="grid gap-4">
          {Object.entries(profileData.skills.expert).map(([category, skills]) => {
            if (category === 'description') return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-blue-400 capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proficient Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Proficient</h2>
        <p className="text-gray-400 italic">{profileData.skills.proficient.description}</p>
        <div className="grid gap-4">
          {Object.entries(profileData.skills.proficient).map(([category, skills]) => {
            if (category === 'description') return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-green-400 capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Familiar Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Familiar</h2>
        <p className="text-gray-400 italic">{profileData.skills.familiar.description}</p>
        <div className="grid gap-4">
          {Object.entries(profileData.skills.familiar).map(([category, skills]) => {
            if (category === 'description') return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-orange-400 capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Certifications</h2>
        <div className="grid gap-4">
          {Object.entries(profileData.certifications).map(([category, certs]) => {
            if (category === 'inProgress') {
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">In Progress</h3>
                  <div className="space-y-1">
                    {certs.map((cert, idx) => (
                      <p key={idx} className="text-gray-300 pl-4">• {cert}</p>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-purple-400 capitalize mb-2">{category}</h3>
                <div className="space-y-1">
                  {certs.map((cert, idx) => (
                    <p key={idx} className="text-gray-300 pl-4">• {cert}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStandardResumeView = () => (
    <div className="space-y-8">
      {/* Resume Header */}
      <div className="text-center space-y-4 bg-gray-800/50 rounded-lg p-6">
        <h1 className="text-4xl font-bold text-white">{profileData.personal.name}</h1>
        <p className="text-xl text-gray-300">{profileData.personal.title}</p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
          <span>{profileData.contact.email}</span>
          <span>{profileData.contact.location}</span>
          <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            LinkedIn Profile
          </a>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Executive Summary</h2>
        {profileData.personal.executiveSummary.map((summary, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed">{summary}</p>
        ))}
      </div>

      {/* Experience */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Experience</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{profileData.experience.northrop.role}</h3>
          <p className="text-sm text-gray-400">{profileData.experience.northrop.period}</p>
          <p className="text-gray-300 leading-relaxed">{profileData.experience.northrop.description}</p>
          <p className="text-gray-300"><strong className="text-green-400">Impact:</strong> {profileData.experience.northrop.impact}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{profileData.experience.meridianVega.role}</h3>
          <p className="text-sm text-gray-400">{profileData.experience.meridianVega.period}</p>
          <p className="text-gray-300 leading-relaxed">{profileData.experience.meridianVega.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Multiple Roles @ AmeriSave Mortgage Corporation</h3>
          <p className="text-sm text-gray-400">{profileData.experience.amerisave.period}</p>
          <p className="text-gray-300 leading-relaxed">
            Progressed from Full Stack Developer to Software Architect to Development Manager. 
            {profileData.experience.amerisave.architect.description}
          </p>
          <p className="text-gray-300"><strong className="text-green-400">Impact:</strong> {profileData.experience.amerisave.architect.impact}</p>
        </div>
      </div>

      {/* Technical Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Technical Skills</h2>
        <div className="grid gap-3">
          <p className="text-gray-300">
            <strong className="text-blue-400">Languages:</strong> {profileData.skills.expert.languages.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">Frontend:</strong> {profileData.skills.expert.frontend.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">Backend:</strong> {profileData.skills.expert.backend.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">Cloud & Infrastructure:</strong> {profileData.skills.expert.cloud.join(', ')}, {profileData.skills.expert.infrastructure.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">AI/ML:</strong> {profileData.skills.expert.aiMl.join(', ')}
          </p>
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Education & Certifications</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-300">
              <strong className="text-blue-400">{profileData.education.university.degree}</strong><br/>
              {profileData.education.university.institution} | {profileData.education.university.period}
            </p>
          </div>
          <div>
            <p className="text-gray-300">
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
            <span>{profileData.contact.email}</span>
            <span>{profileData.contact.location}</span>
            <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Tailored Summary */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="sticky top-0 bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
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
              <button
                onClick={() => {
                  window.open('/projects', '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
              >
                <ExternalLink size={16} />
                See All Projects
              </button>
            )}
            {(mode === 'resume-standard' || mode === 'resume-tailored') && onDownloadPDF && (
              <button
                onClick={onDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] dialog-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DetailedView;