/**
 * event-manager.js - Event Handling and User Interactions
 * 
 * This file manages all user interactions, event listeners,
 * keyboard shortcuts, and user input handling throughout the application.
 */

import { CONFIG } from './config.js';
import { debounce } from './utils.js';

export class EventManager {
  constructor(platform) {
    this.platform = platform;
    this.searchTimeout = null;
    this.setupEventListeners();
  }

  /**
   * Sets up all event listeners for the application
   */
  setupEventListeners() {
    this.setupSearchEvents();
    this.setupFilterEvents();
    this.setupViewEvents();
    this.setupNavigationEvents();
    this.setupKeyboardShortcuts();
  }

  /**
   * Sets up search input events
   */
  setupSearchEvents() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.platform.searchQuery = e.target.value.trim().toLowerCase();
        this.debounceSearch();
      });
    }
  }

  /**
   * Sets up filter button events
   */
  setupFilterEvents() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Remove active class from all filter buttons
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        
        // Add active class to clicked button
        e.target.classList.add("active");
        
        // Update current filter
        this.platform.currentFilter = e.target.dataset.filter;
        this.platform.applyFilters();
      });
    });
  }

  /**
   * Sets up view toggle events
   */
  setupViewEvents() {
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Remove active class from all view buttons
        document
          .querySelectorAll(".view-btn")
          .forEach((b) => b.classList.remove("active"));
        
        // Add active class to clicked button
        e.target.classList.add("active");
        
        // Update current view
        this.platform.currentView = e.target.dataset.view;
        this.platform.navigationManager.setView(this.platform.currentView);
        this.platform.uiManager.setViewMode(this.platform.currentView);
        this.platform.renderCurrentLevel();
      });
    });
  }

  /**
   * Sets up navigation events
   */
  setupNavigationEvents() {
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.platform.navigateBack();
      });
    }
  }

  /**
   * Sets up keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Escape key - navigate back
      if (e.key === "Escape") {
        this.platform.navigateBack();
      }
      // Forward slash - focus search (if not already in input)
      else if (e.key === "/" && !e.target.matches("input")) {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Ctrl/Cmd + K - focus search
      else if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /**
   * Debounces search input to avoid excessive API calls
   */
  debounceSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.platform.applyFilters();
    }, CONFIG.UI.SEARCH_DEBOUNCE_DELAY);
  }

  /**
   * Handles card click events
   * @param {string} path - File/folder path
   * @param {boolean} isFile - Whether the item is a file
   * @param {string} displayName - Display name for folders
   * @returns {Function} - Click handler function
   */
  createCardClickHandler(path, isFile, displayName) {
    return () => {
      if (isFile) {
        this.platform.loadFile(path);
      } else {
        this.platform.navigateToFolder(path, displayName);
      }
    };
  }

  /**
   * Handles favorite button click events
   * @param {string} path - File path
   * @returns {Function} - Click handler function
   */
  createFavoriteClickHandler(path) {
    return (event) => {
      event.stopPropagation();
      this.platform.toggleFavorite(path);
    };
  }

  /**
   * Handles breadcrumb click events
   * @param {number} index - Breadcrumb index
   * @returns {Function} - Click handler function
   */
  createBreadcrumbClickHandler(index) {
    return () => {
      this.platform.navigateToBreadcrumb(index);
    };
  }

  /**
   * Sets up code viewer action events
   */
  setupCodeViewerEvents() {
    // Copy code button
    const copyBtn = document.querySelector('[onclick*="copyCode"]');
    if (copyBtn) {
      copyBtn.onclick = () => this.platform.copyCode();
    }

    // Download code button
    const downloadBtn = document.querySelector('[onclick*="downloadCode"]');
    if (downloadBtn) {
      const match = downloadBtn.onclick.toString().match(/downloadCode\('([^']+)', `([^`]+)`\)/);
      if (match) {
        const [, fileName, code] = match;
        downloadBtn.onclick = () => this.platform.downloadCode(fileName, code);
      }
    }
  }

  /**
   * Handles window resize events
   */
  setupResizeEvents() {
    window.addEventListener("resize", debounce(() => {
      // Handle responsive layout changes if needed
      this.platform.handleResize();
    }, 250));
  }

  /**
   * Sets up click outside events for modals/dropdowns
   * @param {HTMLElement} element - Element to detect clicks outside of
   * @param {Function} callback - Callback function to execute
   */
  setupClickOutsideEvent(element, callback) {
    const handleClickOutside = (event) => {
      if (!element.contains(event.target)) {
        callback();
        document.removeEventListener("click", handleClickOutside);
      }
    };

    // Add slight delay to avoid immediate triggering
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
  }

  /**
   * Removes all event listeners (cleanup)
   */
  cleanup() {
    clearTimeout(this.searchTimeout);
    // Remove any dynamically added event listeners
    document.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("resize", this.resizeHandler);
  }

  /**
   * Updates event handlers after DOM changes
   */
  updateEventHandlers() {
    // Re-setup events that might have been lost during DOM updates
    this.setupCodeViewerEvents();
  }
}