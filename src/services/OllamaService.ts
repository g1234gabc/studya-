import axios from 'axios';

class OllamaService {
  private baseUrl = 'http://localhost:11434/api';

  async generateResponse(query: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/generate`, {
        model: 'mistral',
        prompt: query,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2048
        }
      });

      return response.data.response || 'No response generated.';
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

export const ollamaService = new OllamaService();
