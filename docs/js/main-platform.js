/**
 * main-platform.js - Main Platform Class and Coordination
 *
 * This is the main orchestrator class that coordinates all other managers
 * and handles the primary application logic and state management.
 */

import { CONFIG, DEFAULTS } from "./config.js";
import { UIManager } from "./ui-manager.js";
import { DataManager } from "./data-manager.js";
import { NavigationManager } from "./navigation-manager.js";
import { EventManager } from "./event-manager.js";
import { downloadFile, getSubTree } from "./utils.js";

export class LeetCodePlatform {
  constructor() {
    // Initialize state
    this.currentView = DEFAULTS.VIEW;
    this.currentFilter = DEFAULTS.FILTER;
    this.searchQuery = DEFAULTS.SEARCH_QUERY;
    this.filteredPaths = [];

    // Initialize managers
    this.uiManager = new UIManager();
    this.dataManager = new DataManager();
    this.navigationManager = new NavigationManager();
    this.eventManager = new EventManager(this);

    // Start the application
    this.initialize();
  }

  /**
   * Initializes the platform
   */
  async initialize() {
    try {
      await this.loadData();
      this.updateStats();
      this.applyFilters();
    } catch (error) {
      console.error("Initialization error:", error);
      this.uiManager.showError(error.message);
    }
  }

  /**
   * Loads data using the data manager
   */
  async loadData() {
    this.uiManager.showLoading();
    await this.dataManager.loadData();
  }

  /**
   * Updates application statistics
   */
  updateStats() {
    const stats = this.dataManager.getStats();
    // Update stats display if needed
    console.log("Stats:", stats);
  }

  /**
   * Applies current filters and renders results
   */
  applyFilters() {
    // If there is a search – display all the results
    if (this.searchQuery) {
      const filteredPaths = this.dataManager.filterPaths(
        this.searchQuery,
        this.currentFilter
      );
      this.filteredPaths = filteredPaths;
      this.renderResults(filteredPaths, "Search Results");
    } else {
      // If there is no search – display only the current level
      if (this.navigationManager.isViewingLevel()) {
        const currentState = this.navigationManager.getCurrentState();
        this.renderLevel(currentState.level, currentState.title);
      } else {
        // Displays the root level of the tree
        const rootLevel = this.dataManager.getFullTree();
        this.renderLevel(rootLevel, "Explore Solutions");
      }
    }
  }

  /**
   * Renders filtered results
   * @param {string[]} paths - Array of file paths
   * @param {string} title - Page title
   */
  renderResults(paths, title) {
    this.uiManager.setTitle(title);
    this.uiManager.clearContent();
    this.uiManager.updateBreadcrumb([title]);
    this.uiManager.toggleBackButton(this.navigationManager.hasHistory());

    if (paths.length === 0) {
      this.uiManager.showNoResults();
      return;
    }

    this.renderPaths(paths);
  }

  /**
   * Renders a list of paths as cards
   * @param {string[]} paths - Array of paths to render
   */
  renderPaths(paths) {
    paths.forEach((path, index) => {
      const data = this.dataManager.getProblemData(path);
      const isFile = path.endsWith(CONFIG.FILE_TYPES.CODE_EXTENSION);
      const displayName = path
        .split("/")
        .pop()
        .replace(CONFIG.FILE_TYPES.CODE_EXTENSION, "");

      const onClick = this.eventManager.createCardClickHandler(
        path,
        isFile,
        displayName
      );

      const card = this.uiManager.createCard(
        path,
        data,
        index,
        this.currentView,
        this.dataManager.getFavorites(),
        onClick
      );

      this.uiManager.elements.container.appendChild(card);
    });
  }

  /**
   * Renders a specific level of the tree structure
   * @param {Object} level - Tree level object
   * @param {string} title - Level title
   */
  renderLevel(level, title) {
    this.uiManager.setTitle(title);
    this.uiManager.clearContent();
    this.uiManager.updateBreadcrumb(
      this.navigationManager.getBreadcrumbPath(title)
    );
    this.uiManager.toggleBackButton(this.navigationManager.hasHistory());

    const items = Object.keys(level);
    items.forEach((key, index) => {
      const isFile = typeof level[key] === "string";
      const displayName = key.replace(CONFIG.FILE_TYPES.CODE_EXTENSION, "");
      const path = isFile ? level[key] : key;
      const data = isFile ? this.dataManager.getProblemData(level[key]) : null;

      const onClick = () => {
        if (isFile) {
          this.loadFile(level[key]);
        } else {
          this.navigationManager.pushLevel(level[key], key);
          this.renderLevel(level[key], key);
        }
      };

      const card = this.uiManager.createCard(
        path,
        data,
        index,
        this.currentView,
        this.dataManager.getFavorites(),
        onClick
      );

      this.uiManager.elements.container.appendChild(card);
    });
  }

  /**
   * Re-renders the current level with updated view settings
   */
  renderCurrentLevel() {
    if (this.navigationManager.isViewingLevel()) {
      const currentState = this.navigationManager.getCurrentState();
      this.renderLevel(currentState.level, currentState.title);
    } else {
      this.applyFilters();
    }
  }

  /**
   * Navigates to a folder
   * @param {string} path - Folder path
   * @param {string} name - Display name
   */
  navigateToFolder(path, name) {
    const currentState = {
      filteredPaths: this.filteredPaths,
      title: this.uiManager.elements.pathTitle.textContent,
      filter: this.currentFilter,
      search: this.searchQuery,
      view: this.currentView,
    };

    const subtree = this.navigationManager.navigateToFolder(
      this.dataManager.getFullTree(),
      path,
      name,
      currentState
    );

    if (subtree) {
      this.renderLevel(subtree, name);
    }
  }

  /**
   * Navigates back to previous level
   */
  navigateBack() {
    const prevState = this.navigationManager.navigateBack();

    if (prevState) {
      if (Array.isArray(prevState.level)) {
        // Restore search results view
        this.currentFilter = prevState.filter || "all";
        this.searchQuery = prevState.search || "";
        this.currentView = prevState.view || "grid";
        this.uiManager.elements.searchInput.value = this.searchQuery;
        this.uiManager.setViewMode(this.currentView);
        this.renderResults(prevState.level, prevState.title);
      } else {
        // Restore tree level view
        this.renderLevel(prevState.level, prevState.title);
      }
    } else {
      // No history, go back to main view
      this.applyFilters();
    }
  }

  /**
   * Navigates to a breadcrumb level
   * @param {number} index - Breadcrumb index
   */
  navigateToBreadcrumb(index) {
    if (this.navigationManager.navigateToBreadcrumb(index)) {
      this.applyFilters();
    }
  }

  /**
   * Loads and displays a file
   * @param {string} path - File path
   */
  async loadFile(path) {
    try {
      this.uiManager.showCodeLoading();
      const code = await this.dataManager.loadFile(path);
      const data = this.dataManager.getProblemData(path);

      this.uiManager.elements.container.innerHTML = "";
      this.uiManager.renderCodeViewer(
        path,
        code,
        data,
        this.dataManager.getFavorites()
      );
      this.uiManager.toggleBackButton(true);
      this.eventManager.updateEventHandlers();
    } catch (error) {
      console.error("Error loading file:", error);
      this.uiManager.showError(error.message);
    }
  }

  /**
   * Toggles favorite status for a file
   * @param {string} path - File path
   */
  toggleFavorite(path) {
    const newStatus = this.dataManager.toggleFavorite(path);

    // Update the UI
    if (this.currentFilter === "favorites") {
      this.applyFilters();
    } else {
      this.uiManager.updateFavoriteButtons(this.dataManager.getFavorites());
    }

    // Show notification
    const message = newStatus
      ? "Added to favorites!"
      : "Removed from favorites!";
    this.uiManager.showNotification(message, "success");
  }

  /**
   * Copies code to clipboard
   */
  copyCode() {
    const codeElement = document.querySelector("#codeViewer code");
    if (codeElement) {
      navigator.clipboard
        .writeText(codeElement.textContent)
        .then(() => {
          this.uiManager.showNotification(
            "Code copied to clipboard!",
            "success"
          );
        })
        .catch(() => {
          this.uiManager.showNotification("Failed to copy code", "error");
        });
    }
  }

  /**
   * Downloads code as a file
   * @param {string} fileName - File name
   * @param {string} code - Code content
   */
  downloadCode(fileName, code) {
    downloadFile(`${fileName}.cs`, code);
    this.uiManager.showNotification("File downloaded!", "success");
  }

  /**
   * Handles window resize events
   */
  handleResize() {
    // Handle responsive layout changes if needed
  }

  /**
   * Cleanup method for when the platform is destroyed
   */
  destroy() {
    this.eventManager.cleanup();
  }
}
