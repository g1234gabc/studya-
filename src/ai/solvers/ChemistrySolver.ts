import { BaseSolver } from './BaseSolver';
import { ProblemContext, SolutionStep } from '../KnowledgeEngine';

export class ChemistrySolver extends BaseSolver {
  async solve(
    problem: string, 
    context: ProblemContext
  ): Promise<{
    solution: SolutionStep[],
    confidence: number
  }> {
    const sanitizedProblem = this.sanitizeInput(problem);

    const topics = {
      stoichiometry: /stoichiometry|reaction|mole|balance/i,
      atomic: /atom|electron|proton|neutron|element/i,
      organic: /organic|carbon|hydrocarbon/i,
      acid_base: /acid|base|ph|neutralization/i
    };

    const topic = Object.entries(topics).find(([, regex]) => regex.test(sanitizedProblem))?.[0] || 'general';

    const solutions: Record<string, () => SolutionStep[]> = {
      stoichiometry: () => this.solveStoichiometryProblem(sanitizedProblem),
      atomic: () => this.solveAtomicStructureProblem(sanitizedProblem),
      organic: () => this.solveOrganicChemistryProblem(sanitizedProblem),
      acid_base: () => this.solveAcidBaseProblem(sanitizedProblem),
      general: () => this.solveGeneralChemistryProblem(sanitizedProblem)
    };

    const solutionSteps = solutions[topic]();

    return {
      solution: solutionSteps,
      confidence: 0.85
    };
  }

  private solveStoichiometryProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Solving chemical reaction stoichiometry", 0.8);
  }

  private solveAtomicStructureProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Analyzing atomic structure and electron configuration", 0.7);
  }

  private solveOrganicChemistryProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Exploring organic chemistry molecular structures", 0.6);
  }

  private solveAcidBaseProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Calculating pH and acid-base reactions", 0.7);
  }

  private solveGeneralChemistryProblem(problem: string): SolutionStep[] {
    return this.generateSteps("Applying general chemistry problem-solving techniques", 0.5);
  }
}
