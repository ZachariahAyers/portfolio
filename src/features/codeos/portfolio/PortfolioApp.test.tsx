import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { profile } from '../../../content/profile.ts';
import { renderPage } from '../../../test/render.tsx';
import { PortfolioApp } from './PortfolioApp.tsx';
import { buildTree, findItem, flatItems, nextId } from './portfolioTree.ts';

const tree = buildTree(profile.projects);
const northrop = profile.projects.clients.northrop!;

describe('PortfolioApp', () => {
  it('lists every project in the tree', () => {
    renderPage(<PortfolioApp profile={profile} />);
    const list = within(screen.getByRole('tree', { name: 'Projects' }));
    for (const item of flatItems(tree)) {
      expect(list.getByRole('treeitem', { name: item.name })).toBeInTheDocument();
    }
  });

  it('opens on Northrop Grumman with its description from the profile', () => {
    renderPage(<PortfolioApp profile={profile} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Northrop Grumman' })).toBeInTheDocument();
    expect(screen.getByText(northrop.description)).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { selected: true })).toHaveTextContent('Northrop Grumman');
  });

  it('shows the case study in place, without a link to its page', async () => {
    const user = userEvent.setup();
    renderPage(<PortfolioApp profile={profile} />);
    await user.click(screen.getByRole('treeitem', { name: 'Magpie' }));

    expect(
      await screen.findByText('Your own movies and shows as live channels with a guide'),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    for (const anchor of screen.queryAllByRole('link')) {
      expect(anchor.getAttribute('href')).not.toContain('/casestudies');
    }
  });

  it('moves the selection with the arrow keys', async () => {
    const user = userEvent.setup();
    renderPage(<PortfolioApp profile={profile} />);
    screen.getByRole('tree').focus();

    await user.keyboard('{ArrowDown}');

    const next = findItem(tree, nextId(tree, 'clients-northrop', 1));
    expect(screen.getByRole('treeitem', { selected: true })).toHaveTextContent(next!.name);
  });
});
