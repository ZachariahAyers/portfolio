import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import App from './App';
import ProjectsPage from './components/ProjectsPage';
import SkillsPage from './components/SkillsPage';
import CaseStudyPage from './components/CaseStudyPage';

const AppRouter = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/casestudies/:caseStudyId" element={<CaseStudyPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter;