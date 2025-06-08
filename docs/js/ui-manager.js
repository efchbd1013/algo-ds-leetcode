/**
 * ui-manager.js - UI Management and DOM Operations
 * 
 * This file handles all UI-related operations including DOM manipulation,
 * rendering components, showing notifications, and managing visual states.
 */

import { escapeHtml } from './utils.js';
import { CONFIG } from './config.js';

export class UIManager {
  constructor() {
    this.elements = {};
    this.initializeElements();
    this.initializeAnimations();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    this.elements = {
      searchInput: document.getElementById("searchInput"),
      container: document.getElementById("container"),
      codeViewer: document.getElementById("codeViewer"),
      pathTitle: document.getElementById("pathTitle"),
      backBtn: document.getElementById("backBtn"),
      breadcrumb: document.getElementById("breadcrumb"),
      statsBar: document.getElementById("statsBar"),
    };
  }

  /**
   * Initialize CSS animations
   */
  initializeAnimations() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideOut {
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .notification {
        animation: slideIn 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Creates a card element for files or folders
   * @param {string} path - File/folder path
   * @param {Object} data - Problem data
   * @param {number} index - Card index for animation delay
   * @param {string} currentView - Current view mode (grid/list)
   * @param {Set} favorites - Set of favorite paths
   * @param {Function} onClick - Click handler function
   * @returns {HTMLElement} - The created card element
   */
  createCard(path, data, index, currentView, favorites, onClick) {
    const parts = path.split("/");
    const fileName = parts[parts.length - 1];
    const isFile = fileName.endsWith(CONFIG.FILE_TYPES.CODE_EXTENSION);
    const displayName = fileName.replace(/\.cs$/, "");

    const card = document.createElement("div");
    card.className = `card fade-in ${
      currentView === "list" ? "list-card" : ""
    }`;
    card.style.animationDelay = `${index * CONFIG.UI.ANIMATION_DELAY_INCREMENT}s`;

    if (isFile && data) {
      card.innerHTML = this.createFileCardContent(displayName, data, path, favorites);
    } else {
      card.innerHTML = this.createFolderCardContent(displayName);
    }

    card.onclick = onClick;
    return card;
  }

  /**
   * Creates HTML content for file cards
   * @param {string} name - Display name
   * @param {Object} data - Problem data
   * @param {string} path - File path
   * @param {Set} favorites - Set of favorite paths
   * @returns {string} - HTML content
   */
  createFileCardContent(name, data, path, favorites) {
    return `
      <div class="card-header">
        <div>
          <div class="card-title">${name}</div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="favorite-btn ${
            favorites.has(path) ? "favorited" : ""
          }" 
                  onclick="event.stopPropagation(); platform.toggleFavorite('${path}')"
                  data-tooltip="Add to favorites">
            ♥
          </button>
        </div>
      </div>
      <div class="card-description">${data.description}</div>
    `;
  }

  /**
   * Creates HTML content for folder cards
   * @param {string} name - Folder name
   * @returns {string} - HTML content
   */
  createFolderCardContent(name) {
    return `
      <div class="card-header">
        <div class="card-title">📁 ${name}</div>
        <div class="tag">Folder</div>
      </div>
      <div class="card-description">
        Explore solutions in this category
      </div>
    `;
  }

  /**
   * Renders the code viewer with syntax highlighting
   * @param {string} path - File path
   * @param {string} code - Code content
   * @param {Object} data - Problem data
   * @param {Set} favorites - Set of favorite paths
   */
  renderCodeViewer(path, code, data, favorites) {
    const fileName = path.split("/").pop().replace(".cs", "");

    this.elements.pathTitle.textContent = fileName;
    this.updateBreadcrumb(["Home", "...", fileName]);

    this.elements.codeViewer.innerHTML = `
      <div class="code-header slide-in">
        <div>
          <div class="code-title">${fileName}</div>
        </div>
        <div class="code-actions">
          <button class="action-btn tooltip" onclick="platform.copyCode()" data-tooltip="Copy code">
            📋 Copy
          </button>
          <button class="action-btn tooltip" onclick="platform.downloadCode('${fileName}', \`${code.replace(
            /`/g,
            "\\`"
          )}\`)" data-tooltip="Download file">
            💾 Download
          </button>
          <button class="action-btn tooltip favorite-btn ${
            favorites.has(path) ? "favorited" : ""
          }" 
                  onclick="platform.toggleFavorite('${path}')" data-tooltip="Add to favorites">
            ♥ Favorite
          </button>
        </div>
      </div>
      <pre class="fade-in"><code class="language-csharp">${escapeHtml(code)}</code></pre>
    `;

    // Highlight code
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  }

  /**
   * Updates the breadcrumb navigation
   * @param {string[]} path - Array of breadcrumb items
   */
  updateBreadcrumb(path) {
    this.elements.breadcrumb.innerHTML = path
      .map((item, index) => {
        const isLast = index === path.length - 1;
        return `
          <span class="breadcrumb-item ${isLast ? "current" : ""}" 
                ${!isLast ? `onclick="platform.navigateToBreadcrumb(${index})"` : ""}>
            ${item}
          </span>
          ${!isLast ? '<span class="breadcrumb-separator">›</span>' : ""}
        `;
      })
      .join("");
  }

  /**
   * Shows loading spinner
   */
  showLoading() {
    this.elements.container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `;
  }

  /**
   * Shows loading spinner in code viewer
   */
  showCodeLoading() {
    this.elements.codeViewer.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `;
  }

  /**
   * Shows no results message
   */
  showNoResults() {
    this.elements.container.innerHTML = `
      <div class="no-results fade-in">
        <div class="no-results-icon">🔍</div>
        <h3>No solutions found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
  }

  /**
   * Shows error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.elements.container.innerHTML = `
      <div class="no-results fade-in">
        <div class="no-results-icon">⚠️</div>
        <h3>Error</h3>
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * Shows a notification toast
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "success"
          ? "var(--success)"
          : type === "error"
          ? "var(--error)"
          : "var(--primary)"
      };
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-in forwards";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, CONFIG.UI.NOTIFICATION_DURATION);
  }

  /**
   * Updates favorite buttons state
   * @param {Set} favorites - Set of favorite paths
   */
  updateFavoriteButtons(favorites) {
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      const pathMatch = btn.onclick.toString().match(/'([^']+)'/);
      if (pathMatch) {
        const path = pathMatch[1];
        btn.classList.toggle("favorited", favorites.has(path));
      }
    });
  }

  /**
   * Clears the container and code viewer
   */
  clearContent() {
    this.elements.container.innerHTML = "";
    this.elements.codeViewer.innerHTML = "";
  }

  /**
   * Sets the view mode class on container
   * @param {string} viewMode - View mode (grid/list)
   */
  setViewMode(viewMode) {
    this.elements.container.className = viewMode === "grid" ? "grid-view" : "list-view";
  }

  /**
   * Shows/hides the back button
   * @param {boolean} show - Whether to show the button
   */
  toggleBackButton(show) {
    this.elements.backBtn.style.display = show ? "inline-block" : "none";
  }

  /**
   * Sets the page title
   * @param {string} title - Page title
   */
  setTitle(title) {
    this.elements.pathTitle.textContent = title;
  }
}