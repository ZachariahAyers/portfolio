import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { profile } from '../../content/profile.ts';
import { renderPage } from '../../test/render.tsx';
import { flattenProjects } from './projects.ts';
import { ProjectsView } from './ProjectsView.tsx';

describe('ProjectsView', () => {
  it('shows every project, then narrows to one type', async () => {
    const user = userEvent.setup();
    renderPage(<ProjectsView profile={profile} />);
    const all = flattenProjects(profile.projects);
    expect(screen.getAllByRole('article')).toHaveLength(all.length);

    await user.click(screen.getByRole('button', { name: /^Clients/ }));

    const clients = all.filter((p) => p.type === 'clients');
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(clients.length);
    expect(within(cards[0]!).getAllByText('Clients').length).toBeGreaterThan(0);
  });

  it('links each project to its case study', () => {
    renderPage(<ProjectsView profile={profile} />);
    const withCaseStudy = flattenProjects(profile.projects).filter((p) => p.caseStudy);
    expect(screen.getAllByRole('link', { name: 'Case Study' })).toHaveLength(withCaseStudy.length);
  });
});
