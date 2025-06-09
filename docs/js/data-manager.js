/**
 * data-manager.js - Data Management and API Operations
 * 
 * This file handles all data-related operations including API calls,
 * data processing, local storage management, and problem data generation.
 */

import { CONFIG } from './config.js';
import { buildTree, extractProblemNumber, formatProblemName, generateDescription } from './utils.js';

export class DataManager {
  constructor() {
    this.fullTree = {};
    this.allPaths = [];
    this.problemData = new Map();
    this.favorites = new Set(this.loadFavorites());
  }

  /**
   * Loads data from GitHub API
   * @returns {Promise<void>}
   */
  async loadData() {
    try {
      const response = await fetch(CONFIG.API.GITHUB_API);
      const data = await response.json();

      const treeItems = data.tree.filter(
        (item) => item.type === "blob" || item.type === "tree"
      );
      this.allPaths = treeItems.map((item) => item.path);

      const filesOnly = treeItems.filter(
        (item) => item.type === "blob" && item.path.endsWith(CONFIG.FILE_TYPES.CODE_EXTENSION)
      );

      this.fullTree = buildTree(filesOnly.map((f) => f.path));
      this.generateProblemData();
    } catch (error) {
      console.error("Error loading data:", error);
      throw new Error("Failed to load solutions. Please try again.");
    }
  }

  /**
   * Loads a specific file from GitHub
   * @param {string} path - File path
   * @returns {Promise<string>} - File content
   */
  async loadFile(path) {
    try {
      const url = CONFIG.API.BASE_URL + path;
      const response = await fetch(url);
      const code = await response.text();
      return code;
    } catch (error) {
      console.error("Error loading file:", error);
      throw new Error("Failed to load code. Please try again.");
    }
  }

  /**
   * Generates problem data for all files
   */
  generateProblemData() {
    this.allPaths.forEach((path) => {
      if (path.endsWith(CONFIG.FILE_TYPES.CODE_EXTENSION)) {
        const name = path.split("/").pop().replace(CONFIG.FILE_TYPES.CODE_EXTENSION, "");
        const problemNum = extractProblemNumber(name);

        this.problemData.set(path, {
          name: formatProblemName(name),
          description: generateDescription(name),
          number: problemNum
        });
      }
    });
  }

  /**
   * Filters paths based on search query and filter type
   * @param {string} searchQuery - Search query string
   * @param {string} filterType - Filter type (all, favorites)
   * @returns {string[]} - Filtered paths
   */
  filterPaths(searchQuery, filterType) {
    let paths = [...this.allPaths];

    // Apply search filter
    if (searchQuery) {
      paths = paths.filter((path) => {
        const name = path.split("/").pop();
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply type filter
    if (filterType === "favorites") {
      paths = paths.filter((path) => this.favorites.has(path));
    }

    return paths;
  }

  /**
   * Toggles favorite status for a path
   * @param {string} path - File path
   * @returns {boolean} - New favorite status
   */
  toggleFavorite(path) {
    if (this.favorites.has(path)) {
      this.favorites.delete(path);
    } else {
      this.favorites.add(path);
    }
    this.saveFavorites();
    return this.favorites.has(path);
  }

  /**
   * Loads favorites from localStorage
   * @returns {string[]} - Array of favorite paths
   */
  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES) || "[]");
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  }

  /**
   * Saves favorites to localStorage
   */
  saveFavorites() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.FAVORITES,
        JSON.stringify([...this.favorites])
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }

  /**
   * Gets statistics about the loaded data
   * @returns {Object} - Statistics object
   */
  getStats() {
    const totalFiles = this.allPaths.filter((p) =>
      p.endsWith(CONFIG.FILE_TYPES.CODE_EXTENSION)
    ).length;

    const totalFolders = this.allPaths.filter((p) =>
      !p.endsWith(CONFIG.FILE_TYPES.CODE_EXTENSION)
    ).length;

    return {
      totalFiles,
      totalFolders,
      totalFavorites: this.favorites.size
    };
  }

  /**
   * Gets problem data for a specific path
   * @param {string} path - File path
   * @returns {Object|null} - Problem data or null
   */
  getProblemData(path) {
    return this.problemData.get(path) || null;
  }

  /**
   * Gets the full tree structure
   * @returns {Object} - Tree structure
   */
  getFullTree() {
    return this.fullTree;
  }

  /**
   * Gets all paths
   * @returns {string[]} - Array of all paths
   */
  getAllPaths() {
    return [...this.allPaths];
  }

  /**
   * Checks if a path is favorited
   * @param {string} path - File path
   * @returns {boolean} - Whether the path is favorited
   */
  isFavorite(path) {
    return this.favorites.has(path);
  }

  /**
   * Gets favorites set
   * @returns {Set} - Set of favorite paths
   */
  getFavorites() {
    return this.favorites;
  }
}