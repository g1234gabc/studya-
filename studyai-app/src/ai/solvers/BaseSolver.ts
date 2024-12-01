import { ProblemContext, SolutionStep } from '../KnowledgeEngine';

export abstract class BaseSolver {
  abstract solve(
    problem: string, 
    context: ProblemContext
  ): Promise<{
    solution: SolutionStep[],
    confidence: number
  }>;

  // Common utility methods for all solvers
  protected sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input.replace(/[<>]/g, '');
  }

  protected generateSteps(
    explanation: string, 
    difficulty: number = 0.5
  ): SolutionStep[] {
    return [{
      explanation,
      difficulty
    }];
  }
}
