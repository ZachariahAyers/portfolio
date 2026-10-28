import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { companyProjects } from '../../../content/company.ts';
import { renderPage } from '../../../test/render.tsx';
import { PortfolioApp } from './PortfolioApp.tsx';
import { buildTree, findItem, flatItems, nextId } from './portfolioTree.ts';

const tree = buildTree(companyProjects);
const northrop = companyProjects.clients.northrop!;

describe('PortfolioApp', () => {
  it('lists every project in the tree', () => {
    renderPage(<PortfolioApp projects={companyProjects} />);
    const list = within(screen.getByRole('tree', { name: 'Projects' }));
    for (const item of flatItems(tree)) {
      expect(
        list
          .getAllByRole('treeitem', { name: item.name })
          .find((node) => node.id === `portfolio-option-${item.id}`),
      ).toBeInTheDocument();
    }
  });

  it('opens on Northrop Grumman with its description from the profile', () => {
    renderPage(<PortfolioApp projects={companyProjects} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Northrop Grumman' })).toBeInTheDocument();
    expect(screen.getByText(northrop.description)).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { selected: true })).toHaveTextContent('Northrop Grumman');
  });

  it('uses current company product copy without the deprecated case study', async () => {
    const user = userEvent.setup();
    renderPage(<PortfolioApp projects={companyProjects} />);
    await user.click(screen.getByRole('treeitem', { name: 'Magpie' }));
    expect(screen.getByText(companyProjects.products.magpie!.description)).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visit website' })).toHaveAttribute(
      'href',
      'https://magpietv.com/',
    );
    expect(screen.queryByText(/ARLO|This portfolio/)).not.toBeInTheDocument();
  });

  it('moves the selection with the arrow keys', async () => {
    const user = userEvent.setup();
    renderPage(<PortfolioApp projects={companyProjects} />);
    screen.getByRole('tree').focus();

    await user.keyboard('{ArrowDown}');

    const next = findItem(tree, nextId(tree, 'clients-northrop', 1));
    expect(screen.getByRole('treeitem', { selected: true })).toHaveTextContent(next!.name);
  });
});
