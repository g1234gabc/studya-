import { BaseSolver } from './BaseSolver';
import { ProblemContext, SolutionStep } from '../KnowledgeEngine';
import * as math from 'mathjs';

export class MathSolver extends BaseSolver {
  async solve(
    problem: string, 
    context: ProblemContext
  ): Promise<{
    solution: SolutionStep[],
    confidence: number
  }> {
    const sanitizedProblem = this.sanitizeInput(problem);

    // Enhanced complexity detection
    const complexityIndicators = [
      { 
        pattern: /piecewise|multi-layered|derivative|continuity|transformation/i, 
        complexity: 0.9 
      },
      { 
        pattern: /integral|limit|asymptote/i, 
        complexity: 0.8 
      }
    ];

    const complexityMatch = complexityIndicators.find(indicator => 
      indicator.pattern.test(sanitizedProblem)
    );

    if (complexityMatch && complexityMatch.complexity > 0.7) {
      return this.handleHighComplexityProblem(sanitizedProblem, context);
    }

    // Existing mathematical problem solving logic
    try {
      const result = this.evaluateMathExpression(sanitizedProblem);

      return {
        solution: this.generateSteps(
          `Solution: ${result}`, 
          this.determineDifficulty(context)
        ),
        confidence: 0.95
      };
    } catch (error) {
      return {
        solution: this.generateSteps(
          `Unable to solve: ${error.message}`, 
          0.2
        ),
        confidence: 0.3
      };
    }
  }

  private handleHighComplexityProblem(
    problem: string, 
    context: ProblemContext
  ): Promise<{
    solution: SolutionStep[],
    confidence: number
  }> {
    const complexProblemSteps: SolutionStep[] = [
      {
        explanation: " Detected Highly Complex Mathematical Problem",
        difficulty: 0.9
      },
      {
        explanation: " Problem Characteristics:",
        difficulty: 0.9
      },
      {
        explanation: "- Multi-layered function definition detected",
        difficulty: 0.9
      },
      {
        explanation: "- Requires advanced mathematical analysis",
        difficulty: 0.9
      },
      {
        explanation: " Recommended Problem-Solving Strategy:",
        difficulty: 0.9
      },
      {
        explanation: "1. Break problem into smaller, manageable sub-problems",
        difficulty: 0.8
      },
      {
        explanation: "2. Analyze each mathematical component separately",
        difficulty: 0.8
      },
      {
        explanation: "3. Apply specialized mathematical techniques",
        difficulty: 0.8
      },
      {
        explanation: " Professional Recommendation:",
        difficulty: 0.9
      },
      {
        explanation: "Consult a professional mathematician or advanced computational tool for precise solution",
        difficulty: 0.9
      }
    ];

    return Promise.resolve({
      solution: complexProblemSteps,
      confidence: 0.75
    });
  }

  private evaluateMathExpression(expression: string): string {
    try {
      // Safe mathematical evaluation
      const result = math.evaluate(expression);
      return result.toString();
    } catch (error) {
      throw new Error(`Mathematical evaluation error: ${error.message}`);
    }
  }

  private determineDifficulty(context: ProblemContext): number {
    const difficultyMap = {
      elementary: 0.3,
      middle: 0.6,
      high: 0.9
    };

    return difficultyMap[context.educationLevel] || 0.5;
  }
}
