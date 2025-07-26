import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import ProjectsPage from './components/ProjectsPage';
import SkillsPage from './components/SkillsPage';
import CaseStudyDashboard from './components/CaseStudyDashboard';

const AppRouter = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/casestudies/:caseStudyId" element={<CaseStudyDashboard />} />
        </Routes>
      </Router>
  );
};

export default AppRouter;