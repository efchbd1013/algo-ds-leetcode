/**
 * navigation-manager.js - Navigation and History Management
 * 
 * This file handles navigation between different views, managing
 * browser history, breadcrumb navigation, and view state management.
 */

import { getSubTree } from './utils.js';

export class NavigationManager {
  constructor() {
    this.history = [];
    this.currentState = {
      level: null,
      title: "Explore Solutions",
      filter: "all",
      search: "",
      view: "grid"
    };
  }

  /**
   * Navigates to a folder/directory
   * @param {Object} fullTree - Complete tree structure
   * @param {string} path - Folder path
   * @param {string} name - Display name
   * @param {Object} currentState - Current application state
   * @returns {Object|null} - Subtree or null if not found
   */
  navigateToFolder(fullTree, path, name, currentState) {
    const subtree = getSubTree(fullTree, path.split("/"));
    if (subtree) {
      // Save current state to history
      this.history.push({
        level: currentState.filteredPaths || [],
        title: currentState.title || "Explore Solutions",
        filter: currentState.filter || "all",
        search: currentState.search || "",
        view: currentState.view || "grid"
      });
      
      // Update current state
      this.currentState = {
        level: subtree,
        title: name,
        filter: "all",
        search: "",
        view: currentState.view || "grid"
      };
      
      return subtree;
    }
    return null;
  }

  /**
   * Navigates back to previous level
   * @returns {Object|null} - Previous state or null if no history
   */
  navigateBack() {
    if (this.history.length > 0) {
      const prevState = this.history.pop();
      this.currentState = prevState;
      return prevState;
    }
    return null;
  }

  /**
   * Navigates to a specific breadcrumb level
   * @param {number} index - Breadcrumb index
   * @returns {boolean} - Whether navigation was successful
   */
  navigateToBreadcrumb(index) {
    if (index === 0) {
      // Navigate to home
      this.history = [];
      this.currentState = {
        level: null,
        title: "Explore Solutions",
        filter: "all",
        search: "",
        view: this.currentState.view
      };
      return true;
    }
    return false;
  }

  /**
   * Adds a level to navigation history
   * @param {Object} level - Level data
   * @param {string} title - Level title
   */
  pushLevel(level, title) {
    this.history.push({
      level: this.currentState.level,
      title: this.currentState.title
    });
    
    this.currentState = {
      level,
      title
    };
  }

  /**
   * Gets breadcrumb path for current navigation state
   * @param {string} title - Current page title
   * @returns {string[]} - Array of breadcrumb items
   */
  getBreadcrumbPath(title) {
    const path = ["Home"];
    if (title && title !== "Explore Solutions" && title !== "Search Results") {
      path.push(title);
    }
    return path;
  }

  /**
   * Checks if there's navigation history
   * @returns {boolean} - Whether there's history to go back to
   */
  hasHistory() {
    return this.history.length > 0;
  }

  /**
   * Gets current navigation state
   * @returns {Object} - Current state object
   */
  getCurrentState() {
    return { ...this.currentState };
  }

  /**
   * Sets current search and filter state
   * @param {string} search - Search query
   * @param {string} filter - Filter type
   */
  setSearchAndFilter(search, filter) {
    this.currentState.search = search;
    this.currentState.filter = filter;
  }

  /**
   * Sets current view mode
   * @param {string} view - View mode (grid/list)
   */
  setView(view) {
    this.currentState.view = view;
  }

  /**
   * Resets navigation to initial state
   */
  reset() {
    this.history = [];
    this.currentState = {
      level: null,
      title: "Explore Solutions",
      filter: "all",
      search: "",
      view: "grid"
    };
  }

  /**
   * Gets the current level being displayed
   * @returns {Object|null} - Current level or null
   */
  getCurrentLevel() {
    return this.currentState.level;
  }

  /**
   * Gets the current title
   * @returns {string} - Current title
   */
  getCurrentTitle() {
    return this.currentState.title;
  }

  /**
   * Checks if currently viewing a specific level (not search results)
   * @returns {boolean} - Whether viewing a specific level
   */
  isViewingLevel() {
    return this.currentState.level !== null && typeof this.currentState.level === 'object';
  }
}