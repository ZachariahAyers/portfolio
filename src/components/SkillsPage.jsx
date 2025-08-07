import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Code, Brain, Server, Database, Cloud, Layers, Award, Filter, Star, Book, Zap, Briefcase, Building, Globe, Shield, Package, ChevronDown } from 'lucide-react';
import profileData from '../portfolio-data.json';
import { Tooltip } from './Tooltip';

const SkillsPage = () => {
  const [selectedLevel, setSelectedLevel] = React.useState('all');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showCertifications, setShowCertifications] = React.useState(false);
  const [expandedSkills, setExpandedSkills] = React.useState(new Set());
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  const [expandedCategories, setExpandedCategories] = React.useState(new Set(['expert', 'proficient', 'familiar']));
  const [searchQuery, setSearchQuery] = React.useState('');

  // Flatten all skills into a single array with metadata
  const allSkills = React.useMemo(() => {
    const skills = [];
    
    Object.entries(profileData.skills).forEach(([level, levelData]) => {
      if (levelData.description) {
        Object.entries(levelData).forEach(([category, items]) => {
          if (category !== 'description' && Array.isArray(items)) {
            items.forEach((skill, idx) => {
              skills.push({
                id: `${level}-${category}-${idx}`,
                name: skill,
                level: level,
                category: category,
                description: levelData.description
              });
            });
          }
        });
      }
    });

    return skills;
  }, []);

  // Extract unique categories
  const uniqueCategories = React.useMemo(() => {
    const categorySet = new Set();
    allSkills.forEach(skill => {
      categorySet.add(skill.category);
    });
    return Array.from(categorySet).sort();
  }, [allSkills]);


  // Dynamic category counts based on selected level
  const dynamicCategoryCounts = React.useMemo(() => {
    const counts = {};
    
    const skillsToCount = selectedLevel === 'all' 
      ? allSkills 
      : allSkills.filter(skill => skill.level === selectedLevel);
    
    skillsToCount.forEach(skill => {
      counts[skill.category] = (counts[skill.category] || 0) + 1;
    });

    return counts;
  }, [allSkills, selectedLevel]);

  // Dynamic level counts based on selected category
  const dynamicLevelCounts = React.useMemo(() => {
    const counts = { expert: 0, proficient: 0, familiar: 0 };
    
    const skillsToCount = selectedCategory === 'all'
      ? allSkills
      : allSkills.filter(skill => skill.category === selectedCategory);
    
    skillsToCount.forEach(skill => {
      if (Object.prototype.hasOwnProperty.call(counts, skill.level)) {
        counts[skill.level]++;
      }
    });
    
    return counts;
  }, [allSkills, selectedCategory]);

  // Filter skills
  const filteredSkills = React.useMemo(() => {
    let skills = allSkills;
    
    if (selectedLevel !== 'all') {
      skills = skills.filter(skill => skill.level === selectedLevel);
    }
    
    if (selectedCategory !== 'all') {
      skills = skills.filter(skill => skill.category === selectedCategory);
    }
    
    if (searchQuery) {
      skills = skills.filter(skill => 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by level (expert > proficient > familiar) and then alphabetically
    const levelOrder = { expert: 0, proficient: 1, familiar: 2 };
    skills.sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
      return a.name.localeCompare(b.name);
    });
    
    return skills;
  }, [allSkills, selectedLevel, selectedCategory, searchQuery]);

  // Get certifications
  const certifications = React.useMemo(() => {
    const certs = [];
    
    Object.entries(profileData.certifications).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach((cert, idx) => {
          certs.push({
            id: `cert-${category}-${idx}`,
            name: cert,
            category: category,
            inProgress: cert.includes('In Progress')
          });
        });
      }
    });
    
    return certs;
  }, []);

  // Count certifications
  const certificationCounts = React.useMemo(() => {
    let total = 0;
    let inProgress = 0;
    
    certifications.forEach(cert => {
      total++;
      if (cert.inProgress) {
        inProgress++;
      }
    });
    
    return { total, completed: total - inProgress, inProgress };
  }, [certifications]);

  // Helper functions
  const getCategoryIcon = (category) => {
    const icons = {
      'languages': Code,
      'frontend': Layers,
      'backend': Server,
      'cloud': Cloud,
      'infrastructure': Server,
      'aiMl': Brain,
      'databases': Database,
      'architecture': Layers,
      'testing': Code,
      'frameworks': Code,
      'tools': Code,
      'others': Code
    };
    return icons[category] || Code;
  };

  const getLevelTheme = (level) => {
    if (level === 'expert') return 'dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-500 dark:border-blue-500/30';
    if (level === 'proficient') return 'dark:from-green-900/20 dark:to-emerald-900/20 border-green-500 dark:border-green-500/30';
    if (level === 'familiar') return 'dark:from-orange-900/20 dark:to-amber-900/20 border-orange-500 dark:border-orange-500/30';
    return 'dark:from-gray-800/20 dark:to-gray-700/20 border-gray-500 dark:border-gray-600/30';
  };


  const formatCategoryName = (category) => {
    const names = {
      'languages': 'Languages',
      'frontend': 'Frontend',
      'backend': 'Backend',
      'cloud': 'Cloud',
      'infrastructure': 'Infrastructure',
      'aiMl': 'AI/ML',
      'databases': 'Databases',
      'architecture': 'Architecture',
      'testing': 'Testing',
      'frameworks': 'Frameworks',
      'tools': 'Tools',
      'others': 'Others'
    };
    return names[category] || category;
  };

  const toggleSkillExpanded = (skillId) => {
    const newExpanded = new Set(expandedSkills);
    if (newExpanded.has(skillId)) {
      newExpanded.delete(skillId);
    } else {
      newExpanded.add(skillId);
    }
    setExpandedSkills(newExpanded);
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getLevelAccentColor = (level) => {
    if (level === 'expert') return 'text-blue-400';
    if (level === 'proficient') return 'text-green-400';
    if (level === 'familiar') return 'text-orange-400';
    return 'text-gray-400';
  };

  // Group skills by level
  const groupedSkills = React.useMemo(() => {
    const grouped = {
      expert: { skills: [], description: profileData.skills.expert?.description || '' },
      proficient: { skills: [], description: profileData.skills.proficient?.description || '' },
      familiar: { skills: [], description: profileData.skills.familiar?.description || '' }
    };
    
    filteredSkills.forEach(skill => {
      if (grouped[skill.level]) {
        grouped[skill.level].skills.push(skill);
      }
    });
    
    return grouped;
  }, [filteredSkills]);

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
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">All Skills</h1>
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
          <div className="relative bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 md:p-6 border border-purple-400 dark:border-purple-500/30">
            <div className="text-center space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
                <Brain className="text-purple-400" />
                Technical Skills & Expertise
              </h1>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                14+ years of building production systems across the full stack
              </p>
            </div>
            
            {/* Level Filter */}
            <div className="flex justify-center gap-2 mt-4">
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
              <Tooltip content="Show skills I have mastered and use daily">
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
                  <Star className="inline w-3 h-3 mr-1" />
                  Expert ({dynamicLevelCounts.expert})
                </button>
              </Tooltip>
              <Tooltip content="Show skills I use regularly with confidence">
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
              <Tooltip content="Show skills I have experience with">
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
              <Tooltip content={showCertifications ? "View technical skills" : "View professional certifications"}>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            <Tooltip content="The coding languages I use to build software applications">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-lg p-3 border border-blue-400 dark:border-blue-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Languages</h3>
                </div>
                <p className="text-2xl font-bold text-blue-400">{allSkills.filter(skill => skill.category === 'languages').length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Programming Languages</p>
              </div>
            </Tooltip>
            
            <Tooltip content="Cloud platforms and artificial intelligence tools I work with">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-600/20 dark:to-pink-600/20 rounded-lg p-3 border border-purple-400 dark:border-purple-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Cloud & AI</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">{allSkills.filter(skill => skill.category === 'cloud' || skill.category === 'aiMl').length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Cloud / AI / Machine Learning</p>
              </div>
            </Tooltip>
            
            <Tooltip content="Technologies for creating user interfaces and web experiences">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-600/20 dark:to-emerald-600/20 rounded-lg p-3 border border-green-400 dark:border-green-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Frontend</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">{allSkills.filter(skill => skill.category === 'frontend').length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Design / Markup / UI Frameworks</p>
              </div>
            </Tooltip>
            
            <Tooltip content="Server-side technologies that power applications behind the scenes">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-600/20 dark:to-amber-600/20 rounded-lg p-3 border border-orange-400 dark:border-orange-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-orange-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Backend</h3>
                </div>
                <p className="text-2xl font-bold text-orange-400">{allSkills.filter(skill => skill.category === 'backend' || skill.category === 'databases').length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Servers / Databases</p>
              </div>
            </Tooltip>
            
            <Tooltip content="Tools and practices for automating software deployment and operations">
              <div className="bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-600/20 dark:to-blue-600/20 rounded-lg p-3 border border-indigo-400 dark:border-indigo-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">DevOps</h3>
                </div>
                <p className="text-2xl font-bold text-indigo-400">{allSkills.filter(skill => skill.category === 'infrastructure').length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">CI/CD & Infrastructure</p>
              </div>
            </Tooltip>
            
            <Tooltip content="Security operations and compliance tools to protect systems and data">
              <div className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-600/20 dark:to-pink-600/20 rounded-lg p-3 border border-red-400 dark:border-red-500/30 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">SpecOps</h3>
                </div>
                <p className="text-2xl font-bold text-red-400">{allSkills.filter(skill => skill.category === 'tools').length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-auto pt-1">Security & Compliance</p>
              </div>
            </Tooltip>
          </div>
          )}

          {!showCertifications ? (
            <>
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
              <div className="bg-gray-300/50 dark:bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Filter by Category
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Tooltip content="Show skills from all categories">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      aria-label={`Show all skill categories, ${selectedLevel === 'all' ? allSkills.length : filteredSkills.length} skills`}
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        selectedCategory === 'all' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      All ({selectedLevel === 'all' ? allSkills.length : filteredSkills.length})
                    </button>
                  </Tooltip>
                  {uniqueCategories
                    .filter(cat => dynamicCategoryCounts[cat] > 0)
                    .slice(0, showAllCategories ? undefined : 8)
                    .map(category => {
                      const count = dynamicCategoryCounts[category] || 0;
                      const Icon = getCategoryIcon(category);
                      return (
                        <Tooltip key={category} content={`Filter by ${formatCategoryName(category)} skills`}>
                          <button
                            onClick={() => setSelectedCategory(category)}
                            aria-label={`Filter by ${formatCategoryName(category)} category, ${count} skills`}
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                              selectedCategory === category 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Icon className="inline w-3 h-3 mr-1" />
                            {formatCategoryName(category)} ({count})
                          </button>
                        </Tooltip>
                      );
                    })}
                  {uniqueCategories.filter(cat => dynamicCategoryCounts[cat] > 0).length > 8 && (
                    <Tooltip content={showAllCategories ? "Show fewer categories" : "Show all available categories"}>
                      <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        aria-label={showAllCategories ? "Show fewer category filters" : `Show ${uniqueCategories.filter(cat => dynamicCategoryCounts[cat] > 0).length - 8} more category filters`}
                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all"
                      >
                        {showAllCategories ? 'Show less' : `Show ${uniqueCategories.filter(cat => dynamicCategoryCounts[cat] > 0).length - 8} more`}
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Skills by Level */}
              {['expert', 'proficient', 'familiar'].map(level => {
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
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${level} level skills section, ${levelSkills.length} skills`}
                      aria-expanded={isExpanded}
                      className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-900/10 transition-colors"
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
                        <span className={`text-base md:text-lg font-semibold ${accentColor}`}>
                          {levelSkills.length} skills
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    
                    {isExpanded && levelSkills.length > 0 && (
                      <div className="px-4 md:px-6 pb-4 md:pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {levelSkills.map((skill, idx) => {
                            const CategoryIcon = getCategoryIcon(skill.category);
                            return (
                              <div key={`${skill.name}-${idx}`} className="group relative bg-gray-100 dark:bg-gray-900/20 backdrop-blur-sm rounded-lg p-4 border border-gray-300 dark:border-gray-700/50 hover:border-gray-400 dark:hover:border-gray-600/50 transition-all duration-200 hover:shadow-lg overflow-hidden">
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
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* No results message */}
              {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No skills found
                    {searchQuery && ` matching "${searchQuery}"`}
                    {selectedLevel !== 'all' && ` at "${selectedLevel}" level`}
                    {selectedLevel !== 'all' && selectedCategory !== 'all' && ' and'}
                    {selectedCategory !== 'all' && ` in "${formatCategoryName(selectedCategory)}" category`}
                    .
                  </p>
                  <div className="mt-2 space-x-2">
                    {searchQuery && (
                      <Tooltip content="Remove search filter">
                        <button
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search query"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          Clear search
                        </button>
                      </Tooltip>
                    )}
                    {selectedLevel !== 'all' && (
                      <Tooltip content="Show all skill levels">
                        <button
                          onClick={() => setSelectedLevel('all')}
                          aria-label="Clear skill level filter"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          Clear level filter
                        </button>
                      </Tooltip>
                    )}
                    {selectedCategory !== 'all' && (
                      <Tooltip content="Show all skill categories">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          aria-label="Clear skill category filter"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          Clear category filter
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Certifications View */
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 md:p-6 border border-purple-400 dark:border-purple-500/30">
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
                    <h3 className="text-base md:text-lg font-semibold text-purple-400 capitalize flex items-center gap-2">
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

        </div>
      </main>
    </div>
  );
};

export default SkillsPage;