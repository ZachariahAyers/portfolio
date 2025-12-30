import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import profileData from '../portfolio-data.json';
import useGitHubStats from '../hooks/useGitHubStats';
import { Tooltip } from './Tooltip';

// Import the projects view logic from DetailedView
import { 
  Briefcase, Code, Building, Package, Brain, Cloud, 
  Rocket, Globe, Github, Filter, Zap, ExternalLink, FileText, Star 
} from 'lucide-react';

const ProjectsPage = () => {
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
    const categories = ['opensource', 'enterprise', 'freelance', 'leadership']; // opensource acts as featured
    
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
            image: project.image || project.screenshot || null
          });
        });
      }
    });

    return projects;
  }, []);

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
      leadership: 0
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
    
    // Sort to always show current projects first
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
    if (project.type === 'leadership') return Code;
    // Secondary icon based on technology
    if (project.technologies && project.technologies.some(t => t.includes('AI') || t.includes('ML'))) return Brain;
    if (project.technologies && project.technologies.some(t => t.includes('AWS') || t.includes('Azure'))) return Cloud;
    if (project.technologies && project.technologies.some(t => t.includes('Mobile') || t.includes('Native'))) return Rocket;
    return Code;
  };

  const getProjectTheme = (project) => {
    if (project.current) return 'dark:from-cyan-900/30 dark:via-cyan-800/25 dark:to-yellow-700/20 border-green-500 dark:border-green-500/40';
    if (project.type === 'enterprise') return 'dark:from-purple-900/20 dark:to-pink-900/20 border-purple-500 dark:border-purple-500/30';
    if (project.type === 'opensource') return 'dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-500 dark:border-blue-500/30';
    if (project.type === 'freelance') return 'dark:from-amber-900/20 dark:to-orange-900/20 border-amber-500 dark:border-amber-500/30';
    if (project.type === 'leadership') return 'dark:from-green-900/20 dark:to-emerald-900/20 border-green-500 dark:border-green-500/30';
    return 'dark:from-gray-800/20 dark:to-gray-700/20 border-gray-500 dark:border-gray-600/30';
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
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip content="Return to the main portfolio page">
                <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Navigate back to portfolio">
                  <ArrowLeft size={20} />
                  <span>Back to Portfolio</span>
                </Link>
              </Tooltip>
              <span className="text-gray-400 dark:text-gray-600">|</span>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">All Projects</h1>
            </div>
            <Tooltip content="Go to homepage">
              <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Navigate to homepage">
                <Home size={20} />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 md:p-6 border border-blue-400 dark:border-blue-500/30">
            <div className="text-center space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
                <Rocket className="text-blue-400" />
                Projects & Creations
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                From enterprise transformations to open-source contributions
              </p>
              <div className="flex justify-center flex-wrap gap-4 text-sm">
                <div className="bg-gray-300 dark:bg-gray-800/50 rounded-lg px-3 py-1">
                  <span className="text-gray-600 dark:text-gray-400">Total: </span>
                  <span className="text-gray-900 dark:text-white font-bold">{allProjects.length}</span>
                </div>
                <div className="bg-gray-300 dark:bg-gray-800/50 rounded-lg px-3 py-1">
                  <span className="text-gray-600 dark:text-gray-400">Open Source: </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {allProjects.filter(p => p.github).length}
                  </span>
                </div>
                <div className="bg-gray-300 dark:bg-gray-800/50 rounded-lg px-3 py-1">
                  <span className="text-gray-600 dark:text-gray-400">Live Deployments: </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {allProjects.filter(p => p.url).length}
                  </span>
                </div>
                <div className="bg-gray-300 dark:bg-gray-800/50 rounded-lg px-3 py-1">
                  <span className="text-gray-600 dark:text-gray-400">Case Studies: </span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {allProjects.filter(p => p.caseStudy).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="bg-gray-300/50 dark:bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Filter by Type
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Tooltip content="Show all projects">
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setShowCurrentOnly(false);
                  }}
                  aria-label={`Show all projects, ${allProjects.length} total`}
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedType === 'all' && !showCurrentOnly
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  All ({allProjects.length})
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
                <Tooltip content="Show leadership and organizational impact projects">
                  <button
                    onClick={() => {
                      setSelectedType('leadership');
                      setShowCurrentOnly(false);
                    }}
                    aria-label={`Filter by leadership projects, ${dynamicTypeCounts.leadership} projects`}
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedType === 'leadership' && !showCurrentOnly
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                    }`}
                  >
                    Leadership ({dynamicTypeCounts.leadership})
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
                    Open Source ({dynamicTypeCounts.opensource})
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Technology Filter */}
            <div className="bg-gray-300/50 dark:bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-400" />
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
                      className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
                    >
                      {showAllTechs ? 'Show less' : `Show ${sortedTechnologies.filter(tech => dynamicTechCounts[tech] > 0).length - 10} more`}
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredProjects.map(project => {
              const Icon = getProjectIcon(project);
              const theme = getProjectTheme(project);
              const isExpanded = expandedProjects.has(project.id);
              
              return (
                <div
                  key={project.id}
                  className={`bg-transparent dark:bg-gradient-to-br ${theme} rounded-lg p-4 md:p-5 border transition-all duration-200 hover:scale-[1.01] hover:shadow-lg flex flex-col ${
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
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
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
                          <Icon className="w-12 h-12 text-gray-600" />
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
                          aria-label={`${isExpanded ? 'Show less' : 'Show more'} details for ${project.title}`}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 mb-3"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      </Tooltip>
                    )}

                    {/* Impact */}
                    {project.impact && (
                      <div className="bg-green-900/30 rounded-md px-3 py-1 mb-3">
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
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <Globe className="w-3 h-3" />
                        Live Deployment
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
                    {project.caseStudy && (
                      <Link
                        to={project.caseStudy}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <FileText className="w-3 h-3" />
                        Case Study
                      </Link>
                    )}
                    {project.type === 'enterprise' && (
                      <span className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 ml-auto">
                        <Building className="w-3 h-3" />
                        Enterprise
                      </span>
                    )}
                    {project.type === 'freelance' && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 ml-auto">
                        <Briefcase className="w-3 h-3" />
                        Freelance
                      </span>
                    )}
                    {project.type === 'opensource' && (
                      <span className="flex items-center gap-1 text-xs text-blue-400 ml-auto">
                        <Package className="w-3 h-3" />
                        Open Source
                      </span>
                    )}
                    {project.type === 'leadership' && (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 ml-auto">
                        <Code className="w-3 h-3" />
                        Leadership
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No projects found
                {selectedType !== 'all' && ` of type "${selectedType}"`}
                {selectedType !== 'all' && selectedTech !== 'all' && ' and'}
                {selectedTech !== 'all' && ` with "${selectedTech}" technology`}
                .
              </p>
              <div className="mt-2 space-x-2">
                {selectedType !== 'all' && (
                  <Tooltip content="Show all project types">
                    <button
                      onClick={() => setSelectedType('all')}
                      aria-label="Clear project type filter"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Clear type filter
                    </button>
                  </Tooltip>
                )}
                {selectedTech !== 'all' && (
                  <Tooltip content="Show all technologies">
                    <button
                      onClick={() => setSelectedTech('all')}
                      aria-label="Clear technology filter"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Clear technology filter
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;