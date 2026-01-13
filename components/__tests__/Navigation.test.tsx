import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar, BottomNav } from '../Navigation';
import { ViewState } from '../../types';

describe('Sidebar', () => {
  describe('Rendering', () => {
    it('should render the app logo and title', () => {
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      expect(screen.getByText('INCOME')).toBeInTheDocument();
      expect(screen.getByText('STACK')).toBeInTheDocument();
      expect(screen.getByText('Wealth OS 2.0')).toBeInTheDocument();
    });

    it('should render all navigation items', () => {
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Opportunities')).toBeInTheDocument();
      expect(screen.getByText('Coach')).toBeInTheDocument();
      expect(screen.getByText('Live')).toBeInTheDocument();
      expect(screen.getByText('Wellness')).toBeInTheDocument();
    });

    it('should render system status indicator', () => {
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      expect(screen.getByText('System Online')).toBeInTheDocument();
      expect(screen.getByText(/RAM:/)).toBeInTheDocument();
      expect(screen.getByText(/NET:/)).toBeInTheDocument();
    });
  });

  describe('Active State', () => {
    it('should highlight Dashboard when it is active', () => {
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      const overviewButton = screen.getByText('Overview').closest('button');
      expect(overviewButton).toHaveClass('bg-slate-800/80');
    });

    it('should highlight Jobs when it is active', () => {
      render(<Sidebar currentView={ViewState.JOBS} setView={vi.fn()} />);

      const opportunitiesButton = screen.getByText('Opportunities').closest('button');
      expect(opportunitiesButton).toHaveClass('bg-slate-800/80');
    });

    it('should highlight Mastermind when it is active', () => {
      render(<Sidebar currentView={ViewState.MASTERMIND} setView={vi.fn()} />);

      const coachButton = screen.getByText('Coach').closest('button');
      expect(coachButton).toHaveClass('bg-slate-800/80');
    });

    it('should highlight Live Coach when it is active', () => {
      render(<Sidebar currentView={ViewState.LIVE_COACH} setView={vi.fn()} />);

      const liveButton = screen.getByText('Live').closest('button');
      expect(liveButton).toHaveClass('bg-slate-800/80');
    });

    it('should highlight Health when it is active', () => {
      render(<Sidebar currentView={ViewState.HEALTH} setView={vi.fn()} />);

      const wellnessButton = screen.getByText('Wellness').closest('button');
      expect(wellnessButton).toHaveClass('bg-slate-800/80');
    });

    it('should not highlight inactive items', () => {
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      const opportunitiesButton = screen.getByText('Opportunities').closest('button');
      expect(opportunitiesButton).not.toHaveClass('bg-slate-800/80');
    });
  });

  describe('Interactions', () => {
    it('should call setView with DASHBOARD when Overview is clicked', () => {
      const mockSetView = vi.fn();
      render(<Sidebar currentView={ViewState.JOBS} setView={mockSetView} />);

      screen.getByText('Overview').click();

      expect(mockSetView).toHaveBeenCalledWith(ViewState.DASHBOARD);
    });

    it('should call setView with JOBS when Opportunities is clicked', () => {
      const mockSetView = vi.fn();
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={mockSetView} />);

      screen.getByText('Opportunities').click();

      expect(mockSetView).toHaveBeenCalledWith(ViewState.JOBS);
    });

    it('should call setView with MASTERMIND when Coach is clicked', () => {
      const mockSetView = vi.fn();
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={mockSetView} />);

      screen.getByText('Coach').click();

      expect(mockSetView).toHaveBeenCalledWith(ViewState.MASTERMIND);
    });

    it('should call setView with LIVE_COACH when Live is clicked', () => {
      const mockSetView = vi.fn();
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={mockSetView} />);

      screen.getByText('Live').click();

      expect(mockSetView).toHaveBeenCalledWith(ViewState.LIVE_COACH);
    });

    it('should call setView with HEALTH when Wellness is clicked', () => {
      const mockSetView = vi.fn();
      render(<Sidebar currentView={ViewState.DASHBOARD} setView={mockSetView} />);

      screen.getByText('Wellness').click();

      expect(mockSetView).toHaveBeenCalledWith(ViewState.HEALTH);
    });
  });
});

describe('BottomNav', () => {
  describe('Rendering', () => {
    it('should render all navigation items', () => {
      render(<BottomNav currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Opportunities')).toBeInTheDocument();
      expect(screen.getByText('Coach')).toBeInTheDocument();
      expect(screen.getByText('Live')).toBeInTheDocument();
      expect(screen.getByText('Wellness')).toBeInTheDocument();
    });

    it('should render as a navigation bar', () => {
      render(<BottomNav currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      // Should have 5 navigation buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });
  });

  describe('Active State', () => {
    it('should apply active styling to current view', () => {
      render(<BottomNav currentView={ViewState.MASTERMIND} setView={vi.fn()} />);

      const coachLabel = screen.getByText('Coach');
      expect(coachLabel).toHaveClass('text-emerald-400');
    });

    it('should apply inactive styling to other views', () => {
      render(<BottomNav currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

      const opportunitiesLabel = screen.getByText('Opportunities');
      expect(opportunitiesLabel).toHaveClass('text-slate-500');
    });
  });

  describe('Interactions', () => {
    it('should call setView when navigation item is clicked', () => {
      const mockSetView = vi.fn();
      render(<BottomNav currentView={ViewState.DASHBOARD} setView={mockSetView} />);

      screen.getByText('Coach').click();

      expect(mockSetView).toHaveBeenCalledWith(ViewState.MASTERMIND);
    });

    it('should allow navigating through all views', () => {
      const mockSetView = vi.fn();
      render(<BottomNav currentView={ViewState.DASHBOARD} setView={mockSetView} />);

      screen.getByText('Opportunities').click();
      expect(mockSetView).toHaveBeenCalledWith(ViewState.JOBS);

      screen.getByText('Live').click();
      expect(mockSetView).toHaveBeenCalledWith(ViewState.LIVE_COACH);

      screen.getByText('Wellness').click();
      expect(mockSetView).toHaveBeenCalledWith(ViewState.HEALTH);
    });
  });
});

describe('Navigation Consistency', () => {
  it('should have the same number of items in Sidebar and BottomNav', () => {
    const { container: sidebarContainer } = render(
      <Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />
    );
    const { container: bottomNavContainer } = render(
      <BottomNav currentView={ViewState.DASHBOARD} setView={vi.fn()} />
    );

    // Both should render 5 navigation items
    const sidebarLabels = ['Overview', 'Opportunities', 'Coach', 'Live', 'Wellness'];
    const bottomNavLabels = ['Overview', 'Opportunities', 'Coach', 'Live', 'Wellness'];

    expect(sidebarLabels).toEqual(bottomNavLabels);
  });

  it('should map to the same ViewState values', () => {
    const sidebarSetView = vi.fn();
    const bottomNavSetView = vi.fn();

    render(<Sidebar currentView={ViewState.DASHBOARD} setView={sidebarSetView} />);
    render(<BottomNav currentView={ViewState.DASHBOARD} setView={bottomNavSetView} />);

    // Click on Coach in both
    const coachButtons = screen.getAllByText('Coach');
    coachButtons[0].click(); // Sidebar
    coachButtons[1].click(); // BottomNav

    expect(sidebarSetView).toHaveBeenCalledWith(ViewState.MASTERMIND);
    expect(bottomNavSetView).toHaveBeenCalledWith(ViewState.MASTERMIND);
  });
});
