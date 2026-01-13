# Test Coverage Analysis & Improvement Proposal

## Executive Summary

**Current Test Coverage: 0%**

This codebase has no testing infrastructure in place. There are:
- No test files
- No testing frameworks installed
- No test configuration
- No CI/CD test integration

This analysis identifies priority areas for test coverage and provides a roadmap for implementation.

---

## 1. Current Codebase Overview

| File | Lines | Complexity | Priority |
|------|-------|------------|----------|
| `App.tsx` | 619 | High | Critical |
| `services/geminiService.ts` | 295 | High | Critical |
| `components/Navigation.tsx` | 120 | Medium | High |
| `components/JobCard.tsx` | 84 | Low | Medium |
| `components/WealthFluid.tsx` | 87 | Medium | Low |
| `types.ts` | 46 | N/A | N/A |
| `constants.ts` | 64 | Low | Low |

---

## 2. Recommended Testing Infrastructure

### Install Required Dependencies

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
```

### Create `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts']
    }
  }
});
```

### Add test scripts to `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 3. Priority Test Areas

### Priority 1: Gemini Service (`services/geminiService.ts`) - CRITICAL

This is the core business logic layer with external API dependencies. Testing is essential.

**Functions requiring tests:**

| Function | Risk Level | Test Type |
|----------|------------|-----------|
| `encode()` | Low | Unit |
| `decode()` | Low | Unit |
| `decodeAudioData()` | Medium | Unit |
| `createBlob()` | Medium | Unit |
| `getMarketInsights()` | High | Unit + Integration |
| `getMastermindAdvice()` | High | Unit + Integration |
| `analyzeJobMatch()` | High | Unit + Integration |
| `generateVisionBoardImage()` | High | Unit + Integration |
| `LiveSession` class | High | Unit + Integration |

**Recommended tests:**

```typescript
// services/__tests__/geminiService.test.ts

describe('Audio Encoding Utilities', () => {
  describe('encode()', () => {
    it('should encode Uint8Array to base64 string', () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]);
      expect(encode(input)).toBe('SGVsbG8=');
    });
  });

  describe('decode()', () => {
    it('should decode base64 string to Uint8Array', () => {
      const result = decode('SGVsbG8=');
      expect(Array.from(result)).toEqual([72, 101, 108, 108, 111]);
    });

    it('should be reversible with encode', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5]);
      expect(decode(encode(original))).toEqual(original);
    });
  });

  describe('createBlob()', () => {
    it('should convert Float32Array to PCM blob format', () => {
      const input = new Float32Array([0.5, -0.5, 1.0]);
      const result = createBlob(input);
      expect(result.mimeType).toBe('audio/pcm;rate=16000');
      expect(typeof result.data).toBe('string');
    });
  });
});

describe('API Functions', () => {
  describe('getMarketInsights()', () => {
    it('should return market data for valid query', async () => {
      // Mock the Google GenAI response
      const result = await getMarketInsights('tech stocks');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('grounding');
    });

    it('should handle API errors gracefully', async () => {
      // Force an error condition
      const result = await getMarketInsights('');
      expect(result.text).toContain('Unable to fetch');
    });
  });

  describe('analyzeJobMatch()', () => {
    it('should return JobAnalysis object with required fields', async () => {
      const result = await analyzeJobMatch(
        'Senior Developer',
        'Build React apps',
        ['React', 'TypeScript']
      );

      if (result) {
        expect(result).toHaveProperty('matchAnalysis');
        expect(result).toHaveProperty('pros');
        expect(result).toHaveProperty('cons');
        expect(result).toHaveProperty('growthPotential');
        expect(result.growthPotential).toBeGreaterThanOrEqual(0);
        expect(result.growthPotential).toBeLessThanOrEqual(100);
      }
    });
  });
});

describe('LiveSession', () => {
  it('should initialize with disconnected status', () => {
    const session = new LiveSession();
    // Test initial state
  });

  it('should call onStatusChange when connecting', async () => {
    const mockCallback = vi.fn();
    const session = new LiveSession();
    session.onStatusChange = mockCallback;

    // Mock browser APIs and test connection flow
  });
});
```

---

### Priority 2: App.tsx State Management - CRITICAL

The main App component has complex state management that needs testing.

**Functions requiring tests:**

| Function | Risk Level | Description |
|----------|------------|-------------|
| `handleChatSubmit()` | High | Chat submission and API integration |
| `handleMarketSearch()` | High | Market search with loading states |
| `handleGenerateImage()` | Medium | Vision board generation |
| `handleAnalyzeJob()` | High | Job analysis modal workflow |
| `handleCopyAnalysis()` | Low | Clipboard operations |
| `toggleLiveSession()` | High | Live session connect/disconnect |

**Recommended tests:**

```typescript
// __tests__/App.test.tsx

describe('App Component', () => {
  describe('Chat Functionality', () => {
    it('should add user message to chat history on submit', async () => {
      render(<App />);

      // Navigate to Mastermind view
      // Enter message
      // Submit form
      // Assert message appears in history
    });

    it('should show thinking indicator while waiting for response', async () => {
      render(<App />);

      // Submit message
      // Assert loading indicator is visible
    });

    it('should not submit empty messages', async () => {
      render(<App />);

      // Try to submit empty form
      // Assert no API call made
    });
  });

  describe('Job Analysis', () => {
    it('should open modal when job card is clicked', async () => {
      render(<App />);

      // Click on job card
      // Assert modal is visible
    });

    it('should display analysis results after loading', async () => {
      render(<App />);

      // Trigger analysis
      // Wait for results
      // Assert pros/cons are displayed
    });

    it('should copy analysis to clipboard', async () => {
      render(<App />);

      // Complete analysis
      // Click copy button
      // Assert clipboard contains expected text
    });
  });

  describe('View Navigation', () => {
    it('should render dashboard by default', () => {
      render(<App />);
      expect(screen.getByText('Command Center')).toBeInTheDocument();
    });

    it('should switch views when navigation clicked', async () => {
      render(<App />);

      // Click on Jobs nav item
      // Assert Jobs view is rendered
    });
  });
});
```

---

### Priority 3: Component Tests - HIGH

**JobCard.tsx:**

```typescript
// components/__tests__/JobCard.test.tsx

describe('JobCard', () => {
  const mockJob: Job = {
    id: '1',
    title: 'Senior Developer',
    company: 'Tech Corp',
    salary: '$150k - $180k',
    matchScore: 95,
    tags: ['React', 'TypeScript'],
    description: 'Build amazing apps',
    isRemote: true
  };

  it('should render job title and company', () => {
    render(<JobCard job={mockJob} onAnalyze={vi.fn()} />);

    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  it('should display Remote badge for remote jobs', () => {
    render(<JobCard job={mockJob} onAnalyze={vi.fn()} />);

    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('should not display Remote badge for non-remote jobs', () => {
    const nonRemoteJob = { ...mockJob, isRemote: false };
    render(<JobCard job={nonRemoteJob} onAnalyze={vi.fn()} />);

    expect(screen.queryByText('Remote')).not.toBeInTheDocument();
  });

  it('should display match score', () => {
    render(<JobCard job={mockJob} onAnalyze={vi.fn()} />);

    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('should call onAnalyze when card is clicked', async () => {
    const mockAnalyze = vi.fn();
    render(<JobCard job={mockJob} onAnalyze={mockAnalyze} />);

    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));

    expect(mockAnalyze).toHaveBeenCalledWith(mockJob);
  });

  it('should render all tags', () => {
    render(<JobCard job={mockJob} onAnalyze={vi.fn()} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
```

**Navigation.tsx:**

```typescript
// components/__tests__/Navigation.test.tsx

describe('Sidebar', () => {
  it('should render all navigation items', () => {
    render(<Sidebar currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Coach')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Wellness')).toBeInTheDocument();
  });

  it('should highlight active navigation item', () => {
    render(<Sidebar currentView={ViewState.JOBS} setView={vi.fn()} />);

    const jobsButton = screen.getByText('Opportunities').closest('button');
    expect(jobsButton).toHaveClass('bg-slate-800/80');
  });

  it('should call setView when nav item clicked', async () => {
    const mockSetView = vi.fn();
    render(<Sidebar currentView={ViewState.DASHBOARD} setView={mockSetView} />);

    await userEvent.click(screen.getByText('Opportunities'));

    expect(mockSetView).toHaveBeenCalledWith(ViewState.JOBS);
  });
});

describe('BottomNav', () => {
  it('should render mobile navigation', () => {
    render(<BottomNav currentView={ViewState.DASHBOARD} setView={vi.fn()} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('should show active indicator for current view', () => {
    render(<BottomNav currentView={ViewState.MASTERMIND} setView={vi.fn()} />);

    // Assert active styling on Coach button
  });
});
```

---

### Priority 4: Integration Tests - MEDIUM

**API Mocking with MSW:**

```typescript
// mocks/handlers.ts

import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/v1/models/gemini-*:generateContent', () => {
    return HttpResponse.json({
      candidates: [{
        content: {
          parts: [{ text: 'Mocked AI response' }]
        }
      }]
    });
  }),
];
```

**Integration test example:**

```typescript
// __tests__/integration/chat.test.tsx

describe('Chat Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should complete full chat flow', async () => {
    render(<App />);

    // Navigate to mastermind
    await userEvent.click(screen.getByText('Coach'));

    // Send message
    const input = screen.getByPlaceholderText(/ask for advice/i);
    await userEvent.type(input, 'How should I invest?');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });
  });
});
```

---

## 4. Test Coverage Goals

| Phase | Target Coverage | Timeline |
|-------|-----------------|----------|
| Phase 1 | 30% (Critical paths) | - |
| Phase 2 | 50% (Core features) | - |
| Phase 3 | 70% (Comprehensive) | - |
| Phase 4 | 80%+ (Production-ready) | - |

### Coverage Requirements by Area

| Area | Minimum Coverage | Rationale |
|------|------------------|-----------|
| `geminiService.ts` | 80% | Core business logic, external APIs |
| `App.tsx` handlers | 70% | Critical user flows |
| Components | 60% | UI reliability |
| Utility functions | 90% | Pure functions, easy to test |

---

## 5. Untested Edge Cases & Risks

### High Risk Areas Without Tests

1. **API Error Handling**
   - Network failures in `geminiService.ts`
   - Rate limiting responses
   - Invalid API key handling

2. **State Corruption**
   - Concurrent state updates in chat
   - Modal state conflicts
   - Live session cleanup on unmount

3. **Audio Processing**
   - Browser compatibility for `AudioContext`
   - Memory leaks in `LiveSession.sources`
   - Invalid audio data handling

4. **Clipboard Operations**
   - `handleCopyAnalysis()` permission failures
   - Empty analysis state

5. **Data Validation**
   - `analyzeJobMatch()` returning malformed JSON
   - Missing fields in API responses

---

## 6. Recommended Test File Structure

```
IncomeStack2.0/
├── __tests__/
│   ├── integration/
│   │   ├── chat.test.tsx
│   │   ├── jobAnalysis.test.tsx
│   │   └── marketSearch.test.tsx
│   └── App.test.tsx
├── components/
│   └── __tests__/
│       ├── JobCard.test.tsx
│       ├── Navigation.test.tsx
│       └── WealthFluid.test.tsx
├── services/
│   └── __tests__/
│       └── geminiService.test.ts
├── mocks/
│   ├── handlers.ts
│   └── server.ts
├── setupTests.ts
└── vitest.config.ts
```

---

## 7. Summary of Recommendations

### Immediate Actions (Critical)

1. **Install Vitest and Testing Library** - Required for any testing
2. **Create test setup files** - Configure jsdom environment
3. **Add MSW for API mocking** - Essential for testing API integrations
4. **Write tests for `geminiService.ts`** - Core business logic

### Short-term Actions (High Priority)

5. **Test App.tsx state handlers** - User-facing functionality
6. **Component tests for JobCard and Navigation** - UI reliability
7. **Set up coverage reporting** - Track progress

### Medium-term Actions

8. **Integration tests for complete flows** - End-to-end user journeys
9. **Error boundary testing** - Graceful failure handling
10. **Accessibility testing** - Ensure WCAG compliance

### Long-term Actions

11. **E2E tests with Playwright/Cypress** - Full application testing
12. **Performance testing** - Canvas animations, audio processing
13. **CI/CD integration** - Automated test runs on PR

---

## Conclusion

This codebase has **zero test coverage**, which represents significant technical debt. The Gemini service layer and App.tsx state management are the highest priority areas due to their complexity and importance to core functionality.

Implementing the recommended testing infrastructure and prioritized test suites will significantly improve code reliability, catch regressions early, and enable confident refactoring.
