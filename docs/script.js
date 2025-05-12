const owner = "efrat-dev";
const repo = "algo-ds-leetcode";
const branch = "main";
const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

let fullTree = {};
let history = [];

fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
  .then(res => res.json())
  .then(data => {
    const files = data.tree.filter(item => item.type === "blob" && item.path.endsWith(".cs"));
    fullTree = buildTree(files.map(f => f.path));
    renderLevel(fullTree, "Click to view solutions");
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
  renderLevel(prev.level, prev.title);
};

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[m]);
}
