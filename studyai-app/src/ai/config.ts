export const CONFIG = {
  VERSION: '1.0.0',
  SUPPORTED_LANGUAGES: ['en', 'tr', 'de', 'fr'],
  EDUCATION_LEVELS: ['elementary', 'middle', 'high'],
  SUBJECTS: ['math', 'physics', 'chemistry', 'biology', 'history'],
  
  // AI Behavior Configuration
  AI_SETTINGS: {
    DEFAULT_CONFIDENCE_THRESHOLD: 0.7,
    MAX_SOLUTION_STEPS: 10,
    ADAPTIVE_LEARNING_ENABLED: true
  },

  // Logging and Debugging
  DEBUG_MODE: process.env.NODE_ENV !== 'production',

  // Performance Optimization
  CACHING_ENABLED: true,
  MAX_CACHE_SIZE: 1000,

  // External API Configurations (placeholders)
  EXTERNAL_APIS: {
    TRANSLATION_SERVICE: null,
    ADVANCED_COMPUTATION: null
  }
};

export const DIFFICULTY_LEVELS = {
  elementary: {
    complexity: 0.3,
    explanation_style: 'simple'
  },
  middle: {
    complexity: 0.6,
    explanation_style: 'moderate'
  },
  high: {
    complexity: 0.9,
    explanation_style: 'advanced'
  }
};
