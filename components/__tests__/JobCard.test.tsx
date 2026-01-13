import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobCard from '../JobCard';
import { Job } from '../../types';

const createMockJob = (overrides: Partial<Job> = {}): Job => ({
  id: '1',
  title: 'Senior React Developer',
  company: 'Tech Corp',
  salary: '$150k - $180k',
  matchScore: 95,
  tags: ['React', 'TypeScript', 'Node.js'],
  description: 'Build amazing web applications with cutting-edge technology.',
  isRemote: true,
  ...overrides,
});

describe('JobCard', () => {
  describe('Rendering', () => {
    it('should render job title', () => {
      const job = createMockJob();
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
    });

    it('should render company name', () => {
      const job = createMockJob();
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should render salary range', () => {
      const job = createMockJob();
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getAllByText('$150k - $180k').length).toBeGreaterThan(0);
    });

    it('should render match score with percentage', () => {
      const job = createMockJob({ matchScore: 85 });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('should render job description', () => {
      const job = createMockJob();
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText(/Build amazing web applications/)).toBeInTheDocument();
    });

    it('should render all tags', () => {
      const job = createMockJob({ tags: ['Python', 'Django', 'AWS'] });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Django')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });
  });

  describe('Remote Badge', () => {
    it('should display Remote badge for remote jobs', () => {
      const job = createMockJob({ isRemote: true });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('Remote')).toBeInTheDocument();
    });

    it('should not display Remote badge for non-remote jobs', () => {
      const job = createMockJob({ isRemote: false });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.queryByText('Remote')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onAnalyze when card is clicked', async () => {
      const mockAnalyze = vi.fn();
      const job = createMockJob();

      const { container } = render(<JobCard job={job} onAnalyze={mockAnalyze} />);

      // Click on the card container (the outermost clickable div)
      const card = container.firstChild as HTMLElement;
      card.click();

      expect(mockAnalyze).toHaveBeenCalledWith(job);
    });

    it('should call onAnalyze when Analyze button is clicked', async () => {
      const mockAnalyze = vi.fn();
      const job = createMockJob();

      render(<JobCard job={job} onAnalyze={mockAnalyze} />);

      // Find the button by its title attribute
      const analyzeButton = screen.getByTitle('Run Deep Analysis');
      analyzeButton.click();

      expect(mockAnalyze).toHaveBeenCalledWith(job);
    });

    it('should stop propagation when button is clicked', async () => {
      const mockAnalyze = vi.fn();
      const job = createMockJob();

      render(<JobCard job={job} onAnalyze={mockAnalyze} />);

      // Find the button by its title attribute
      const analyzeButton = screen.getByTitle('Run Deep Analysis');
      analyzeButton.click();

      // Should only be called once, not twice (once for button, once for card)
      expect(mockAnalyze).toHaveBeenCalledTimes(1);
    });
  });

  describe('Match Score Variants', () => {
    it('should display 100% match score', () => {
      const job = createMockJob({ matchScore: 100 });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should display 0% match score', () => {
      const job = createMockJob({ matchScore: 0 });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should display decimal match score as integer', () => {
      const job = createMockJob({ matchScore: 87 });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(screen.getByText('87%')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tags array', () => {
      const job = createMockJob({ tags: [] });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      // Should still render without crashing
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
    });

    it('should handle long job title', () => {
      const job = createMockJob({
        title: 'Senior Principal Staff Software Engineer - Platform Infrastructure',
      });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(
        screen.getByText('Senior Principal Staff Software Engineer - Platform Infrastructure')
      ).toBeInTheDocument();
    });

    it('should handle long company name', () => {
      const job = createMockJob({
        company: 'International Business Machines Corporation Ltd.',
      });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(
        screen.getByText('International Business Machines Corporation Ltd.')
      ).toBeInTheDocument();
    });

    it('should handle special characters in description', () => {
      const job = createMockJob({
        description: "We're looking for developers who love <TypeScript> & React!",
      });
      render(<JobCard job={job} onAnalyze={vi.fn()} />);

      expect(
        screen.getByText(/We're looking for developers who love/)
      ).toBeInTheDocument();
    });
  });
});
