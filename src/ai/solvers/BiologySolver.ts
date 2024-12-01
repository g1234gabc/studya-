import { BaseSolver } from './BaseSolver';
import { ProblemContext, SolutionStep } from '../KnowledgeEngine';

export class BiologySolver extends BaseSolver {
  async solve(
    problem: string, 
    context: ProblemContext
  ): Promise<{
    solution: SolutionStep[],
    confidence: number
  }> {
    const sanitizedProblem = this.sanitizeInput(problem);

    const topics = {
      cellular: /cell|mitosis|meiosis|organelle/i,
      genetics: /gene|dna|chromosome|inheritance/i,
      ecology: /ecosystem|population|environment/i,
      human_biology: /human|organ|system|anatomy/i
    };

    const topic = Object.entries(topics).find(([, regex]) => regex.test(sanitizedProblem))?.[0] || 'general';

    const solutions: Record<string, () => SolutionStep[]> = {
      cellular: () => this.solveCellularBiologyProblem(sanitizedProblem),
      genetics: () => this.solveGeneticsProblem(sanitizedProblem),
      ecology: () => this.solveEcologyProblem(sanitizedProblem),
      human_biology: () => this.solveHumanBiologyProblem(sanitizedProblem),
      general: () => this.solveGeneralBiologyProblem(sanitizedProblem)
    };

    const solutionSteps = solutions[topic]();

    return {
      solution: solutionSteps,
      confidence: 0.85
    };
  }

  private solveCellularBiologyProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Exploring cellular structures and processes", 0.7);
  }

  private solveGeneticsProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Analyzing genetic inheritance and DNA mechanisms", 0.8);
  }

  private solveEcologyProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Investigating ecological interactions and systems", 0.6);
  }

  private solveHumanBiologyProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Examining human physiological systems", 0.7);
  }

  private solveGeneralBiologyProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Applying general biology problem-solving techniques", 0.5);
  }
}
