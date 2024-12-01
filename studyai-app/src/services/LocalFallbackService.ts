export class LocalFallbackService {
  private static readonly RATE_LIMIT_WAIT_TIME = 3600000; // 1 hour in milliseconds
  private static lastRateLimitHit: number = 0;

  static isRateLimited(): boolean {
    const now = Date.now();
    return (now - this.lastRateLimitHit) < this.RATE_LIMIT_WAIT_TIME;
  }

  static setRateLimited() {
    this.lastRateLimitHit = Date.now();
  }

  static getLocalResponse(question: string): string {
    const timeRemaining = Math.ceil((this.RATE_LIMIT_WAIT_TIME - (Date.now() - this.lastRateLimitHit)) / 60000);
    
    return `I apologize, but I'm currently rate limited. Please try again in about ${timeRemaining} minutes.\n\n` +
           `In the meantime, you can:\n` +
           `1. Save your question for later\n` +
           `2. Try rephrasing your question\n` +
           `3. Break down complex questions into simpler parts\n\n` +
           `Your question was: "${question}"`;
  }
}
