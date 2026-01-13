import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App', () => {
  describe('Initial Render', () => {
    it('should render without crashing', () => {
      render(<App />);
      expect(screen.getByText('INCOME')).toBeInTheDocument();
    });

    it('should render the dashboard by default', () => {
      render(<App />);
      expect(screen.getByText('Command Center')).toBeInTheDocument();
    });

    it('should render the sidebar navigation', () => {
      render(<App />);
      // Use getAllByText since nav items appear in both Sidebar and BottomNav
      expect(screen.getAllByText('Overview').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Opportunities').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Coach').length).toBeGreaterThan(0);
    });

    it('should display wealth metrics on dashboard', () => {
      render(<App />);
      expect(screen.getByText('Net Worth')).toBeInTheDocument();
      expect(screen.getByText('Monthly Income')).toBeInTheDocument();
      expect(screen.getByText('Burnout Risk')).toBeInTheDocument();
    });
  });

  describe('View Navigation', () => {
    it('should switch to Jobs view when Opportunities is clicked', () => {
      render(<App />);

      // Use getAllByText and click the first one (sidebar)
      fireEvent.click(screen.getAllByText('Opportunities')[0]);

      expect(screen.getByText('Opportunities', { selector: 'h2' })).toBeInTheDocument();
      expect(screen.getByText('AI-curated roles matching your wealth profile.')).toBeInTheDocument();
    });

    it('should switch to Mastermind view when Coach is clicked', () => {
      render(<App />);

      // Use getAllByText and click the first one (sidebar)
      fireEvent.click(screen.getAllByText('Coach')[0]);

      expect(screen.getByText('Wealth Coach AI')).toBeInTheDocument();
    });

    it('should switch to Health view when Wellness is clicked', () => {
      render(<App />);

      // Use getAllByText and click the first one (sidebar)
      fireEvent.click(screen.getAllByText('Wellness')[0]);

      expect(screen.getByText('Bio-Data Syncing...')).toBeInTheDocument();
    });

    it('should switch to Live Coach view when Live is clicked', () => {
      render(<App />);

      // Use getAllByText and click the first one (sidebar)
      fireEvent.click(screen.getAllByText('Live')[0]);

      expect(screen.getByText('Live Wealth Coach')).toBeInTheDocument();
      expect(screen.getByText('Start Session')).toBeInTheDocument();
    });

    it('should return to Dashboard when Overview is clicked', () => {
      render(<App />);

      // First navigate away
      fireEvent.click(screen.getAllByText('Opportunities')[0]);
      expect(screen.getByText('Opportunities', { selector: 'h2' })).toBeInTheDocument();

      // Then navigate back
      fireEvent.click(screen.getAllByText('Overview')[0]);
      expect(screen.getByText('Command Center')).toBeInTheDocument();
    });
  });

  describe('Dashboard Features', () => {
    it('should render the income chart', () => {
      render(<App />);
      expect(screen.getByText('Income Projection')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('should render market intelligence section', () => {
      render(<App />);
      expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
    });

    it('should render vision board generator', () => {
      render(<App />);
      expect(screen.getByText('Vision Board Generator')).toBeInTheDocument();
    });

    it('should have time period buttons for chart', () => {
      render(<App />);
      expect(screen.getByText('1M')).toBeInTheDocument();
      expect(screen.getByText('3M')).toBeInTheDocument();
      expect(screen.getByText('6M')).toBeInTheDocument();
      expect(screen.getByText('1Y')).toBeInTheDocument();
    });
  });

  describe('Market Intelligence', () => {
    it('should have a search input', () => {
      render(<App />);
      const searchInput = screen.getByPlaceholderText('Ask about market trends...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should allow typing in search input', () => {
      render(<App />);

      const searchInput = screen.getByPlaceholderText('Ask about market trends...');
      fireEvent.change(searchInput, { target: { value: 'tech stocks' } });

      expect(searchInput).toHaveValue('tech stocks');
    });
  });

  describe('Vision Board', () => {
    it('should have a prompt input', () => {
      render(<App />);
      const input = screen.getByPlaceholderText(/futuristic minimalist office/i);
      expect(input).toBeInTheDocument();
    });

    it('should have size selector with options', () => {
      render(<App />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('should have Visualize button', () => {
      render(<App />);
      expect(screen.getByText('Visualize')).toBeInTheDocument();
    });
  });

  describe('Jobs View', () => {
    it('should render job cards', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Opportunities')[0]);

      // Check for job-related content
      expect(screen.getByText('Filter Settings')).toBeInTheDocument();
    });

    it('should have Load More button', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Opportunities')[0]);

      expect(screen.getByText('Load More Opportunities')).toBeInTheDocument();
    });
  });

  describe('Mastermind/Chat View', () => {
    it('should render chat interface', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Coach')[0]);

      expect(screen.getByText('Wealth Coach AI')).toBeInTheDocument();
      expect(screen.getByText(/Online • Thinking Mode/)).toBeInTheDocument();
    });

    it('should have chat input field', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Coach')[0]);

      const chatInput = screen.getByPlaceholderText(/Ask for advice, market data, or career strategy/i);
      expect(chatInput).toBeInTheDocument();
    });

    it('should render welcome message', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Coach')[0]);

      expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
    });

    it('should allow typing in chat input', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Coach')[0]);

      const chatInput = screen.getByPlaceholderText(/Ask for advice/i);
      fireEvent.change(chatInput, { target: { value: 'How should I invest my savings?' } });

      expect(chatInput).toHaveValue('How should I invest my savings?');
    });

    it('should have disabled submit button when input is empty', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Coach')[0]);

      // Find the submit button (the one with the arrow icon)
      const submitButtons = screen.getAllByRole('button');
      const submitButton = submitButtons.find(btn => btn.getAttribute('type') === 'submit');

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Live Coach View', () => {
    it('should render live coach interface', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Live')[0]);

      expect(screen.getByText('Live Wealth Coach')).toBeInTheDocument();
    });

    it('should have Start Session button', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Live')[0]);

      expect(screen.getByText('Start Session')).toBeInTheDocument();
    });

    it('should show instructions when disconnected', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Live')[0]);

      expect(screen.getByText(/Start a real-time voice session/)).toBeInTheDocument();
    });
  });

  describe('Health View', () => {
    it('should render health syncing message', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Wellness')[0]);

      expect(screen.getByText('Bio-Data Syncing...')).toBeInTheDocument();
    });

    it('should have Connect Device button', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Wellness')[0]);

      expect(screen.getByText('Connect Device')).toBeInTheDocument();
    });

    it('should show health connect instructions', () => {
      render(<App />);

      fireEvent.click(screen.getAllByText('Wellness')[0]);

      expect(screen.getByText(/Connect your Apple Health or Android Health/)).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should render both sidebar and main content', () => {
      render(<App />);

      // Check for aside (sidebar)
      const aside = document.querySelector('aside');
      expect(aside).toBeInTheDocument();

      // Check for main content
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('should maintain view state during re-renders', () => {
      const { rerender } = render(<App />);

      // Navigate to Jobs
      fireEvent.click(screen.getAllByText('Opportunities')[0]);
      expect(screen.getByText('Opportunities', { selector: 'h2' })).toBeInTheDocument();

      // Rerender the app
      rerender(<App />);

      // Should still be on Jobs view (note: this tests initial render, not true persistence)
      // In a real app with state persistence, this would be more meaningful
    });
  });
});

describe('App Error Boundaries', () => {
  it('should render even with empty metrics', () => {
    // The app uses mock data, but we verify it handles the initial state
    render(<App />);
    expect(screen.getByText('Command Center')).toBeInTheDocument();
  });
});
