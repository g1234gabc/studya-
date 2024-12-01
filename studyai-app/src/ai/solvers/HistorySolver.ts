import { BaseSolver } from './BaseSolver';
import { ProblemContext, SolutionStep } from '../KnowledgeEngine';

export class HistorySolver extends BaseSolver {
  private historicalDatabase = {
    'ottoman empire': {
      summary: 'The Ottoman Empire was a powerful Islamic empire that ruled from the 14th to early 20th century.',
      key_periods: ['Rise (1299-1453)', 'Golden Age (1453-1566)', 'Decline (1566-1922)'],
      significant_rulers: ['Osman I', 'Mehmet the Conqueror', 'Suleiman the Magnificent']
    },
    'french revolution': {
      summary: 'A period of radical social and political upheaval in France from 1789 to 1799.',
      key_events: ['Storming of the Bastille', 'Declaration of the Rights of Man', 'Execution of Louis XVI'],
      impact: ['End of absolute monarchy', 'Rise of nationalism', 'Inspiration for future revolutions']
    }
  };

  async solve(
    problem: string, 
    context: ProblemContext
  ): Promise<{
    solution: SolutionStep[],
    confidence: number
  }> {
    const sanitizedProblem = this.sanitizeInput(problem.toLowerCase());

    // Detect historical topic
    const topic = Object.keys(this.historicalDatabase)
      .find(key => sanitizedProblem.includes(key));

    if (topic) {
      const historicalInfo = this.historicalDatabase[topic];
      
      const steps: SolutionStep[] = [
        {
          explanation: historicalInfo.summary,
          difficulty: 0.5
        },
        {
          explanation: `Key Periods: ${historicalInfo.key_periods?.join(', ') || 'Not specified'}`,
          difficulty: 0.6
        },
        {
          explanation: `Significant Figures: ${historicalInfo.significant_rulers?.join(', ') || 'Not specified'}`,
          difficulty: 0.7
        },
        {
          explanation: `Historical Impact: ${historicalInfo.impact?.join(', ') || 'Not specified'}`,
          difficulty: 0.8
        }
      ];

      return {
        solution: steps,
        confidence: 0.9
      };
    }

    // Fallback for unrecognized topics
    return {
      solution: this.generateSteps("Unable to find specific historical information", 0.2),
      confidence: 0.3
    };
  }
}
