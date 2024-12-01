import axios from 'axios';

class OllamaService {
  private baseUrl = 'http://localhost:11434/api';

  async generateResponse(query: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: query,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.5,
            top_k: 20,
            max_tokens: 500,
            repeat_penalty: 1.2,
            num_ctx: 512,
            num_thread: 8
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Ollama API');
      }

      const data = await response.json();
      return data.response || 'No response generated.';
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/version`);
      return response.ok;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      return false;
    }
  }
}

export const ollamaService = new OllamaService();
