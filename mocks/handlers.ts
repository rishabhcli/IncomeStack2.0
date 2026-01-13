import { http, HttpResponse } from 'msw';

// Mock responses for Gemini API
const mockMarketInsightsResponse = {
  text: 'The tech sector is showing strong growth with AI companies leading the way. Key trends include increased enterprise adoption and new product launches.',
  candidates: [
    {
      content: {
        parts: [{ text: 'The tech sector is showing strong growth with AI companies leading the way.' }]
      },
      groundingMetadata: {
        groundingChunks: [
          {
            web: {
              uri: 'https://example.com/tech-trends',
              title: 'Tech Market Trends 2025'
            }
          }
        ]
      }
    }
  ]
};

const mockMastermindResponse = {
  text: 'Based on your current financial situation, I recommend diversifying your portfolio with a mix of growth stocks and index funds. Consider allocating 60% to stocks and 40% to bonds for a balanced approach.',
  candidates: [
    {
      content: {
        parts: [
          {
            text: 'Based on your current financial situation, I recommend diversifying your portfolio with a mix of growth stocks and index funds.'
          }
        ]
      }
    }
  ]
};

const mockJobAnalysisResponse = {
  matchAnalysis: 'Strong alignment with your React and TypeScript skills, with growth opportunities in AI.',
  pros: ['Remote work option', 'Competitive salary', 'AI-focused team'],
  cons: ['Fast-paced environment', 'On-call requirements'],
  growthPotential: 85
};

const mockImageGenerationResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' // 1x1 transparent PNG
            }
          }
        ]
      }
    }
  ]
};

export const handlers = [
  // Mock Gemini generateContent endpoint
  http.post('https://generativelanguage.googleapis.com/v1beta/models/*', async ({ request }) => {
    const url = new URL(request.url);
    const body = await request.json() as { contents?: string };

    // Determine response based on model or content
    if (url.pathname.includes('gemini-2.5-flash')) {
      // Market insights (search grounding)
      return HttpResponse.json(mockMarketInsightsResponse);
    }

    if (url.pathname.includes('gemini-3-pro-image-preview')) {
      // Image generation
      return HttpResponse.json(mockImageGenerationResponse);
    }

    if (url.pathname.includes('gemini-3-pro-preview')) {
      // Check if it's job analysis (JSON response) or mastermind (text)
      const contentStr = JSON.stringify(body.contents || '');
      if (contentStr.includes('Analyze this job') || contentStr.includes('matchAnalysis')) {
        return HttpResponse.json({
          text: JSON.stringify(mockJobAnalysisResponse),
          candidates: [
            {
              content: {
                parts: [{ text: JSON.stringify(mockJobAnalysisResponse) }]
              }
            }
          ]
        });
      }

      // Default to mastermind response
      return HttpResponse.json(mockMastermindResponse);
    }

    // Default response
    return HttpResponse.json(mockMastermindResponse);
  }),

  // Mock for chats endpoint
  http.post('https://generativelanguage.googleapis.com/v1beta/chats/*', () => {
    return HttpResponse.json(mockMastermindResponse);
  }),

  // Mock live API endpoint
  http.post('https://generativelanguage.googleapis.com/v1beta/live/*', () => {
    return HttpResponse.json({ connected: true });
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = [
  http.post('https://generativelanguage.googleapis.com/v1beta/models/*', () => {
    return HttpResponse.json(
      { error: { message: 'Rate limit exceeded', code: 429 } },
      { status: 429 }
    );
  }),
];

// Network failure handlers
export const networkErrorHandlers = [
  http.post('https://generativelanguage.googleapis.com/v1beta/models/*', () => {
    return HttpResponse.error();
  }),
];
