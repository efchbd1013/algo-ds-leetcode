const owner = "efrat-dev";
const repo = "algo-ds-leetcode";
const branch = "main";
const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

let fullTree = {};
let allPaths = []; // גם קבצים וגם תיקיות
let history = [];

fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
  .then(res => res.json())
  .then(data => {
    const treeItems = data.tree.filter(item => item.type === "blob" || item.type === "tree");
    allPaths = treeItems.map(item => item.path);
    const filesOnly = treeItems.filter(item => item.type === "blob" && item.path.endsWith(".cs"));
    fullTree = buildTree(filesOnly.map(f => f.path));
    renderLevel(fullTree, "Click to view solutions");
  });

  document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    if (query === "") {
      renderLevel(fullTree, "Click to view solutions");
    } else {
      // שלוף רק פריטים ששמם (ולא כל הנתיב) תואם לחיפוש
      const results = allPaths.filter(path => {
        const parts = path.split("/");
        const name = parts[parts.length - 1];
        return name.toLowerCase().includes(query);
      });
      renderFlatResults(results, "Search results");
    }
  });
function buildTree(paths) {
  const root = {};
  for (const path of paths) {
    const parts = path.split("/");
    let curr = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!curr[part]) {
        curr[part] = (i === parts.length - 1) ? path : {};
      }
      curr = curr[part];
    }
  }
  return root;
}

function renderLevel(level, title) {
  const container = document.getElementById("container");
  container.innerHTML = "";
  document.getElementById("codeViewer").innerHTML = "";
  document.getElementById("pathTitle").innerText = title;
  document.getElementById("backBtn").style.display = history.length ? "inline-block" : "none";

  for (const key in level) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = key.replace(/\.cs$/, "");
    card.onclick = () => {
      if (typeof level[key] === "string") {
        loadFile(level[key]);
      } else {
        history.push({ level, title });
        renderLevel(level[key], key);
      }
    };
    container.appendChild(card);
  }
}

function renderFlatResults(paths, title) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    document.getElementById("codeViewer").innerHTML = "";
    document.getElementById("pathTitle").innerText = title;
    document.getElementById("backBtn").style.display = "inline-block";
  
    if (paths.length === 0) {
      container.innerHTML = "<p>No results found</p>";
      return;
    }
  
    for (const path of paths) {
      const parts = path.split("/");
      const name = parts[parts.length - 1].replace(/\.cs$/, "");
  
      const card = document.createElement("div");
      card.className = "card";
      card.innerText = name;
  
      card.onclick = () => {
        if (path.endsWith(".cs")) {
          loadFile(path);
        } else {
          const subtree = getSubTree(fullTree, path.split("/"));
          if (subtree) {
            history.push({ level: fullTree, title: "Click to view solutions" });
            renderLevel(subtree, name);
          } else {
            alert("Folder not found.");
          }
        }
      };
  
      container.appendChild(card);
    }
  }
  
  // פונקציה שמקבלת fullTree ונתיב, ומחזירה את הסאב-עץ המתאים
  function getSubTree(tree, parts) {
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
  
  

function loadFile(path) {
  const url = baseUrl + path;
  fetch(url)
    .then(res => res.text())
    .then(code => {
      document.getElementById("container").innerHTML = "";
      document.getElementById("pathTitle").innerText = path;
      document.getElementById("codeViewer").innerHTML = `
        <pre><code class="language-csharp">${escapeHtml(code)}</code></pre>
      `;
      hljs.highlightAll();
      document.getElementById("backBtn").style.display = "inline-block";
    });
}

document.getElementById("backBtn").onclick = () => {
  const prev = history.pop();
  if (prev) {
    renderLevel(prev.level, prev.title);
  } else {
    renderLevel(fullTree, "Click to view solutions");
  }
};

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}
