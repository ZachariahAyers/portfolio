import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, ExternalLink, Github, Globe, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CaseStudyHero from './CaseStudyHero';
import CaseStudyMetrics from './CaseStudyMetrics';
import CaseStudyContent from './CaseStudyContent';
import CaseStudyTOC from './CaseStudyTOC';
import CaseStudyNavigation from './CaseStudyNavigation';
import CaseStudyRelated from './CaseStudyRelated';
import { Tooltip } from './Tooltip';
import caseStudiesData from '../case-studies.json';

const CaseStudyPage = () => {
  const { caseStudyId } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [activeSection, setActiveSection] = useState('executive');
  const [allCaseStudies, setAllCaseStudies] = useState([]);

  useEffect(() => {
    // Load case study data
    const studyData = caseStudiesData[caseStudyId];
    if (studyData) {
      setCaseStudy(studyData);
      // Set page title
      document.title = `${studyData.title} | Zach Ayers Case Study`;
    } else {
      // Redirect to 404 or home if case study not found
      navigate('/');
    }

    // Get all case studies for navigation
    const studies = Object.keys(caseStudiesData).map(key => ({
      id: key,
      title: caseStudiesData[key].title,
      category: caseStudiesData[key].category
    }));
    setAllCaseStudies(studies);
  }, [caseStudyId, navigate]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [caseStudyId]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const currentIndex = allCaseStudies.findIndex(s => s.id === caseStudyId);
  const prevStudy = currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < allCaseStudies.length - 1 ? allCaseStudies[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip content="Return to portfolio">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Navigate back to portfolio"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back to Portfolio</span>
                </Link>
              </Tooltip>
              <span className="text-gray-400 dark:text-gray-600">|</span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Case Study</h1>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip content="View all projects">
                <Link 
                  to="/projects" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="View all projects"
                >
                  <FileText size={20} />
                </Link>
              </Tooltip>
              <Tooltip content="Go to homepage">
                <Link 
                  to="/" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Navigate to homepage"
                >
                  <Home size={20} />
                </Link>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <CaseStudyHero caseStudy={caseStudy} />

      {/* Metrics Section */}
      <CaseStudyMetrics metrics={caseStudy.metrics} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <CaseStudyTOC 
                sections={caseStudy.sections} 
                activeSection={activeSection}
                onSectionClick={setActiveSection}
              />
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <CaseStudyContent 
                sections={caseStudy.sections}
                technologies={caseStudy.technologies}
                links={caseStudy.links}
                testimonials={caseStudy.testimonials}
                onSectionChange={setActiveSection}
              />

              {/* Navigation */}
              <CaseStudyNavigation 
                prevStudy={prevStudy}
                nextStudy={nextStudy}
              />

              {/* Related Case Studies */}
              {caseStudy.relatedCaseStudies && caseStudy.relatedCaseStudies.length > 0 && (
                <CaseStudyRelated 
                  relatedIds={caseStudy.relatedCaseStudies}
                  currentId={caseStudyId}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseStudyPage;