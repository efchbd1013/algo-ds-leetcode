 // Enhanced TypeScript-like JavaScript implementation
 class LeetCodePlatform {
    constructor() {
      this.owner = "efrat-dev";
      this.repo = "algo-ds-leetcode";
      this.branch = "main";
      this.baseUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/`;

      this.fullTree = {};
      this.allPaths = [];
      this.filteredPaths = [];
      this.history = [];
      this.favorites = new Set(
        JSON.parse(localStorage.getItem("favorites") || "[]")
      );
      this.currentView = "grid";
      this.currentFilter = "all";
      this.searchQuery = "";
      this.problemData = new Map();

      this.initializeElements();
      this.setupEventListeners();
      this.loadData();
    }

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

    setupEventListeners() {
      // Search functionality
      this.elements.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.debounceSearch();
      });

      // Filter buttons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          document
            .querySelectorAll(".filter-btn")
            .forEach((b) => b.classList.remove("active"));
          e.target.classList.add("active");
          this.currentFilter = e.target.dataset.filter;
          this.applyFilters();
        });
      });

      // View toggle
      document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          document
            .querySelectorAll(".view-btn")
            .forEach((b) => b.classList.remove("active"));
          e.target.classList.add("active");
          this.currentView = e.target.dataset.view;
          this.elements.container.className =
            this.currentView === "grid" ? "grid-view" : "list-view";
          this.renderCurrentLevel();
        });
      });

      // Back button
      this.elements.backBtn.addEventListener("click", () => {
        this.navigateBack();
      });

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.navigateBack();
        } else if (e.key === "/" && !e.target.matches("input")) {
          e.preventDefault();
          this.elements.searchInput.focus();
        }
      });
    }

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.applyFilters();
      }, 300);
    }

    async loadData() {
      try {
        this.showLoading();
        const response = await fetch(
          `https://api.github.com/repos/${this.owner}/${this.repo}/git/trees/${this.branch}?recursive=1`
        );
        const data = await response.json();

        const treeItems = data.tree.filter(
          (item) => item.type === "blob" || item.type === "tree"
        );
        this.allPaths = treeItems.map((item) => item.path);

        const filesOnly = treeItems.filter(
          (item) => item.type === "blob" && item.path.endsWith(".cs")
        );

        this.fullTree = this.buildTree(filesOnly.map((f) => f.path));
        this.generateProblemData();
        this.updateStats();
        this.applyFilters();
      } catch (error) {
        console.error("Error loading data:", error);
        this.showError("Failed to load solutions. Please try again.");
      }
    }

    buildTree(paths) {
      const root = {};
      for (const path of paths) {
        const parts = path.split("/");
        let curr = root;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!curr[part]) {
            curr[part] = i === parts.length - 1 ? path : {};
          }
          curr = curr[part];
        }
      }
      return root;
    }

    generateProblemData() {
      this.allPaths.forEach((path) => {
        if (path.endsWith(".cs")) {
          const name = path.split("/").pop().replace(".cs", "");
          const problemNum = this.extractProblemNumber(name);

          this.problemData.set(path, {
            name: this.formatProblemName(name),
            description: this.generateDescription(name),
          });
        }
      });
    }

    extractProblemNumber(name) {
      const match = name.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }

    formatProblemName(name) {
      return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^\s+/, "")
        .replace(/\d+\s*/, "")
        .trim();
    }

    generateDescription(name) {
      const descriptions = [
        "A challenging algorithmic problem that tests your understanding of data structures.",
        "An elegant solution showcasing advanced programming techniques.",
        "A classic problem from technical interviews at top tech companies.",
        "An optimized approach to a common computational challenge.",
        "A fundamental algorithm every programmer should master.",
      ];
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    updateStats() {
      const totalFiles = this.allPaths.filter((p) =>
        p.endsWith(".cs")
      ).length;
    }

    animateNumber(element, start, end, duration) {
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }

    applyFilters() {
      let paths = [...this.allPaths];

      // Apply search filter
      if (this.searchQuery) {
        paths = paths.filter((path) => {
          const name = path.split("/").pop();
          return name.toLowerCase().includes(this.searchQuery);
        });
      }

      if (this.currentFilter !== "all") {
        if (this.currentFilter === "favorites") {
          paths = paths.filter((path) => this.favorites.has(path));
        }
      }

      this.filteredPaths = paths;
      this.renderResults(
        paths,
        this.searchQuery ? "Search Results" : "Explore Solutions"
      );
    }

    renderResults(paths, title) {
      this.elements.pathTitle.textContent = title;
      this.elements.container.innerHTML = "";
      this.elements.codeViewer.innerHTML = "";
      this.updateBreadcrumb([title]);
      this.elements.backBtn.style.display = this.history.length
        ? "inline-block"
        : "none";

      if (paths.length === 0) {
        this.showNoResults();
        return;
      }

      paths.forEach((path, index) => {
        const card = this.createCard(path, index);
        this.elements.container.appendChild(card);
      });
    }

    createCard(path, index) {
      const parts = path.split("/");
      const fileName = parts[parts.length - 1];
      const isFile = fileName.endsWith(".cs");
      const displayName = fileName.replace(/\.cs$/, "");
      const data = this.problemData.get(path);

      const card = document.createElement("div");
      card.className = `card fade-in ${
        this.currentView === "list" ? "list-card" : ""
      }`;
      card.style.animationDelay = `${index * 0.1}s`;

      if (isFile && data) {
        card.innerHTML = this.createFileCardContent(
          displayName,
          data,
          path
        );
      } else {
        card.innerHTML = this.createFolderCardContent(displayName);
      }

      card.onclick = () => {
        if (isFile) {
          this.loadFile(path);
        } else {
          this.navigateToFolder(path, displayName);
        }
      };

      return card;
    }

    createFileCardContent(name, data, path) {
      return `
                <div class="card-header">
                    <div>
                        <div class="card-title">${name}</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button class="favorite-btn ${
                          this.favorites.has(path) ? "favorited" : ""
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

    toggleFavorite(path) {
      if (this.favorites.has(path)) {
        this.favorites.delete(path);
      } else {
        this.favorites.add(path);
      }
      localStorage.setItem(
        "favorites",
        JSON.stringify([...this.favorites])
      );

      // Update the UI
      if (this.currentFilter === "favorites") {
        this.applyFilters();
      } else {
        this.updateFavoriteButtons();
      }
    }

    updateFavoriteButtons() {
      document.querySelectorAll(".favorite-btn").forEach((btn) => {
        const path = btn.onclick.toString().match(/'([^']+)'/)[1];
        btn.classList.toggle("favorited", this.favorites.has(path));
      });
    }

    navigateToFolder(path, name) {
      const subtree = this.getSubTree(this.fullTree, path.split("/"));
      if (subtree) {
        this.history.push({
          level: this.filteredPaths,
          title: this.elements.pathTitle.textContent,
          filter: this.currentFilter,
          search: this.searchQuery,
        });
        this.renderLevel(subtree, name);
      }
    }

    renderLevel(level, title) {
      this.elements.pathTitle.textContent = title;
      this.elements.container.innerHTML = "";
      this.elements.codeViewer.innerHTML = "";
      this.updateBreadcrumb(this.getBreadcrumbPath(title));
      this.elements.backBtn.style.display = this.history.length
        ? "inline-block"
        : "none";

      const items = Object.keys(level);
      items.forEach((key, index) => {
        const card = document.createElement("div");
        card.className = `card fade-in ${
          this.currentView === "list" ? "list-card" : ""
        }`;
        card.style.animationDelay = `${index * 0.1}s`;

        const isFile = typeof level[key] === "string";
        const displayName = key.replace(/\.cs$/, "");

        if (isFile) {
          const data = this.problemData.get(level[key]);
          if (data) {
            card.innerHTML = this.createFileCardContent(
              displayName,
              data,
              level[key]
            );
          }
        } else {
          card.innerHTML = this.createFolderCardContent(displayName);
        }

        card.onclick = () => {
          if (isFile) {
            this.loadFile(level[key]);
          } else {
            this.history.push({ level, title });
            this.renderLevel(level[key], key);
          }
        };

        this.elements.container.appendChild(card);
      });
    }

    renderCurrentLevel() {
      // Re-render current view with new display settings
      this.applyFilters();
    }

    getSubTree(tree, parts) {
      let curr = tree;
      for (const part of parts) {
        if (curr[part] && typeof curr[part] === "object") {
          curr = curr[part];
        } else {
          return null;
        }
      }
      return curr;
    }

    getBreadcrumbPath(title) {
      const path = ["Home"];
      if (title !== "Explore Solutions") {
        path.push(title);
      }
      return path;
    }

    updateBreadcrumb(path) {
      this.elements.breadcrumb.innerHTML = path
        .map((item, index) => {
          const isLast = index === path.length - 1;
          return `
                    <span class="breadcrumb-item ${
                      isLast ? "current" : ""
                    }" 
                          ${
                            !isLast
                              ? `onclick="platform.navigateToBreadcrumb(${index})"`
                              : ""
                          }>
                        ${item}
                    </span>
                    ${
                      !isLast
                        ? '<span class="breadcrumb-separator">›</span>'
                        : ""
                    }
                `;
        })
        .join("");
    }

    navigateToBreadcrumb(index) {
      if (index === 0) {
        this.history = [];
        this.applyFilters();
      }
    }

    async loadFile(path) {
      try {
        this.showCodeLoading();
        const url = this.baseUrl + path;
        const response = await fetch(url);
        const code = await response.text();

        this.elements.container.innerHTML = "";
        this.renderCodeViewer(path, code);
        this.elements.backBtn.style.display = "inline-block";
      } catch (error) {
        console.error("Error loading file:", error);
        this.showError("Failed to load code. Please try again.");
      }
    }

    renderCodeViewer(path, code) {
      const data = this.problemData.get(path);
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
                          this.favorites.has(path) ? "favorited" : ""
                        }" 
                                onclick="platform.toggleFavorite('${path}')" data-tooltip="Add to favorites">
                            ♥ Favorite
                        </button>
                    </div>
                </div>
                <pre class="fade-in"><code class="language-csharp">${this.escapeHtml(
                  code
                )}</code></pre>
            `;

      // Highlight code
      hljs.highlightAll();
    }

    copyCode() {
      const codeElement = document.querySelector("#codeViewer code");
      if (codeElement) {
        navigator.clipboard
          .writeText(codeElement.textContent)
          .then(() => {
            this.showNotification("Code copied to clipboard!", "success");
          })
          .catch(() => {
            this.showNotification("Failed to copy code", "error");
          });
      }
    }

    downloadCode(fileName, code) {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.cs`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showNotification("File downloaded!", "success");
    }

    navigateBack() {
      const prev = this.history.pop();
      if (prev) {
        if (Array.isArray(prev.level)) {
          this.currentFilter = prev.filter || "all";
          this.searchQuery = prev.search || "";
          this.elements.searchInput.value = this.searchQuery;
          this.renderResults(prev.level, prev.title);
        } else {
          this.renderLevel(prev.level, prev.title);
        }
      } else {
        this.applyFilters();
      }
    }

    showLoading() {
      this.elements.container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            `;
    }

    showCodeLoading() {
      this.elements.codeViewer.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            `;
    }

    showNoResults() {
      this.elements.container.innerHTML = `
                <div class="no-results fade-in">
                    <div class="no-results-icon">🔍</div>
                    <h3>No solutions found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
    }

    showError(message) {
      this.elements.container.innerHTML = `
                <div class="no-results fade-in">
                    <div class="no-results-icon">⚠️</div>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
    }

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
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }

    escapeHtml(text) {
      return text.replace(
        /[&<>"']/g,
        (m) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
          }[m])
      );
    }
  }

  // Initialize the platform
  const platform = new LeetCodePlatform();

  // Add some CSS animations
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