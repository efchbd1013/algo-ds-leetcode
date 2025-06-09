/**
 * app.js - Application Entry Point
 * 
 * This is the main entry point of the application that initializes
 * the platform and makes it globally available for HTML onclick handlers.
 */

import { LeetCodePlatform } from './main-platform.js';

// Initialize the platform when DOM is ready
let platform;

/**
 * Initializes the application
 */
function initializeApp() {
  try {
    platform = new LeetCodePlatform();
    
    // Make platform globally available for HTML onclick handlers
    window.platform = platform;
    
    console.log("CodeMaster Pro platform initialized successfully");
  } catch (error) {
    console.error("Failed to initialize platform:", error);
    
    // Show error message to user
    const container = document.getElementById("container");
    if (container) {
      container.innerHTML = `
        <div class="no-results fade-in">
          <div class="no-results-icon">⚠️</div>
          <h3>Initialization Error</h3>
          <p>Failed to start the application. Please refresh the page and try again.</p>
          <button onclick="window.location.reload()" class="action-btn">
            🔄 Refresh Page
          </button>
        </div>
      `;
    }
  }
}

/**
 * Handles cleanup when the page is unloaded
 */
function cleanup() {
  if (platform && typeof platform.destroy === 'function') {
    platform.destroy();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Export for potential module usage
export { platform };