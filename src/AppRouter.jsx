import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './App';
import StandalonePage from './components/StandalonePage';
import profileData from './portfolio-data.json';

const ProjectsView = lazy(() => import('./components/ProjectsView'));
const SkillsView = lazy(() => import('./components/SkillsView'));
const CaseStudyDashboard = lazy(() => import('./components/CaseStudyDashboard'));

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<StandalonePage title="All Projects"><ProjectsView profileData={profileData} /></StandalonePage>} />
        <Route path="/skills" element={<StandalonePage title="All Skills"><SkillsView profileData={profileData} /></StandalonePage>} />
        <Route path="/casestudies/:caseStudyId" element={<CaseStudyDashboard />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
