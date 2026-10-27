import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { profile } from '../content/profile.ts';
import { StandalonePage } from '../components/StandalonePage.tsx';
import ChatPage from '../features/chat/ChatPage.tsx';

const DesktopPage = lazy(() => import('../features/codeos/DesktopPage.tsx'));
const CaseStudyRoute = lazy(() => import('../features/case-studies/CaseStudyPage.tsx'));
const ProjectsView = lazy(() =>
  import('../features/profile/ProjectsView.tsx').then((m) => ({ default: m.ProjectsView })),
);
const SkillsView = lazy(() =>
  import('../features/profile/SkillsView.tsx').then((m) => ({ default: m.SkillsView })),
);

/**
 * Hash routing: the path lives after the #, so every page loads from the one
 * index.html under any base path, and a refresh never asks the host for a page it lacks.
 */
export function AppRouter() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/desktop" element={<DesktopPage />} />
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
    </HashRouter>
  );
}
