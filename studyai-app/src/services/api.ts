import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const askQuestion = async (subject: string, question: string) => {
  try {
    const response = await axios.post(`${API_URL}/ask`, {
      subject,
      question
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to get answer');
    }
    throw error;
  }
};
