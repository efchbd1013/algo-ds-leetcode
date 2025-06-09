/**
 * config.js - Configuration and Constants
 * 
 * This file contains all configuration constants, default values,
 * and application settings used throughout the platform.
 */

export const CONFIG = {
    // GitHub repository settings
    GITHUB: {
      OWNER: "efrat-dev",
      REPO: "algo-ds-leetcode",
      BRANCH: "main"
    },
  
    // API endpoints
    API: {
      BASE_URL: "https://raw.githubusercontent.com/efrat-dev/algo-ds-leetcode/main/",
      GITHUB_API: "https://api.github.com/repos/efrat-dev/algo-ds-leetcode/git/trees/main?recursive=1"
    },
  
    // UI configuration
    UI: {
      SEARCH_DEBOUNCE_DELAY: 300,
      ANIMATION_DELAY_INCREMENT: 0.1,
      NOTIFICATION_DURATION: 3000,
      ANIMATION_DURATION: 1000
    },
  
    // Local storage keys
    STORAGE_KEYS: {
      FAVORITES: "favorites"
    },
  
    // File extensions and types
    FILE_TYPES: {
      CODE_EXTENSION: ".cs",
      SUPPORTED_FILES: [".cs"]
    }
  };
  
  // Problem descriptions pool for random generation
  export const PROBLEM_DESCRIPTIONS = [
    "A challenging algorithmic problem that tests your understanding of data structures.",
    "An elegant solution showcasing advanced programming techniques.",
    "A classic problem from technical interviews at top tech companies.",
    "An optimized approach to a common computational challenge.",
    "A fundamental algorithm every programmer should master."
  ];
  
  // Default views and filters
  export const DEFAULTS = {
    VIEW: "grid",
    FILTER: "all",
    SEARCH_QUERY: ""
  };