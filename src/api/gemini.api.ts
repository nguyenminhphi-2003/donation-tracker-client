import axios from 'axios';

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiPart[];
}

interface GeminiRequest {
  contents: GeminiContent[];
}

interface GeminiResponsePart {
  text: string;
}

interface GeminiResponseContent {
  parts: GeminiResponsePart[];
  role: string;
}

interface GeminiCandidate {
  content: GeminiResponseContent;
  finishReason: string;
  avgLogprobs: number;
}

interface TokensDetail {
  modality: string;
  tokenCount: number;
}

interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: TokensDetail[];
  candidatesTokensDetails: TokensDetail[];
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  usageMetadata: UsageMetadata;
  modelVersion: string;
}

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const geminiApi = {
  /**
   * Get a message response from Gemini AI
   * @param prompt The text prompt to send to Gemini
   * @returns The response text from Gemini AI
   */
  getMessage: async (prompt: string): Promise<string> => {
    try {
      const requestData: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      };

      const response = await axios.post<GeminiResponse>(
        `${API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text;
        }
      }

      throw new Error('No response from Gemini');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  },

  /**
   * Get response text with token usage data from Gemini AI
   * @param prompt The text prompt to send to Gemini
   * @returns An object with the response text and token usage information
   */
  getDetailedResponse: async (prompt: string): Promise<{text: string, totalTokens: number}> => {
    try {
      const requestData: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      };

      const response = await axios.post<GeminiResponse>(
        `${API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      let responseText = '';
      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          responseText = candidate.content.parts[0].text;
        }
      }

      return {
        text: responseText,
        totalTokens: response.data.usageMetadata?.totalTokenCount || 0
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
};