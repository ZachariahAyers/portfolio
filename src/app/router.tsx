import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { profile } from '../../shared/profile.ts';
import { StandalonePage } from '../components/StandalonePage.tsx';
import ChatPage from '../features/chat/ChatPage.tsx';

const CaseStudyRoute = lazy(() => import('../features/case-studies/CaseStudyPage.tsx'));
const ProjectsView = lazy(() =>
  import('../features/profile/ProjectsView.tsx').then((m) => ({ default: m.ProjectsView })),
);
const SkillsView = lazy(() =>
  import('../features/profile/SkillsView.tsx').then((m) => ({ default: m.SkillsView })),
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route
            path="/projects"
            element={
              <StandalonePage title="All Projects">
                <ProjectsView profile={profile} />
              </StandalonePage>
            }
          />
          <Route
            path="/skills"
            element={
              <StandalonePage title="All Skills">
                <SkillsView profile={profile} />
              </StandalonePage>
            }
          />
          <Route path="/casestudies/:caseStudyId" element={<CaseStudyRoute />} />
          <Route
            path="*"
            element={
              <StandalonePage title="Page not found">
                <p>That page does not exist. Use the links above to get back to the portfolio.</p>
              </StandalonePage>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
