import { HashRouter } from 'react-router';
import DesktopPage from '../features/codeos/DesktopPage.tsx';

export function AppRouter() {
  return (
    <HashRouter>
      <DesktopPage />
    </HashRouter>
  );
}
