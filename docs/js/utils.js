/**
 * utils.js - Utility Functions
 * 
 * This file contains helper functions and utilities used across
 * the application for common operations like string manipulation,
 * DOM operations, and data processing.
 */

import { PROBLEM_DESCRIPTIONS } from './config.js';

/**
 * Escapes HTML characters in a string to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
export function escapeHtml(text) {
  return text.replace(
    /[&<>"']/g,
    (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m])
  );
}

/**
 * Builds a tree structure from an array of file paths
 * @param {string[]} paths - Array of file paths
 * @returns {Object} - Tree structure object
 */
export function buildTree(paths) {
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

/**
 * Extracts problem number from a filename
 * @param {string} name - The filename
 * @returns {number} - The extracted problem number or 0 if not found
 */
export function extractProblemNumber(name) {
  const match = name.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Formats a problem name by adding spaces and removing numbers
 * @param {string} name - The raw problem name
 * @returns {string} - The formatted problem name
 */
export function formatProblemName(name) {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^\s+/, "")
    .replace(/\d+\s*/, "")
    .trim();
}

/**
 * Generates a random description for a problem
 * @param {string} name - The problem name (unused but kept for future use)
 * @returns {string} - A random description
 */
export function generateDescription(name) {
  return PROBLEM_DESCRIPTIONS[Math.floor(Math.random() * PROBLEM_DESCRIPTIONS.length)];
}

/**
 * Creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Animates a number from start to end value
 * @param {HTMLElement} element - The element to update
 * @param {number} start - Starting number
 * @param {number} end - Ending number
 * @param {number} duration - Animation duration in ms
 */
export function animateNumber(element, start, end, duration) {
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

/**
 * Downloads a file with given content
 * @param {string} fileName - Name of the file
 * @param {string} content - File content
 * @param {string} mimeType - MIME type of the file
 */
export function downloadFile(fileName, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Gets a subtree from a tree structure given a path
 * @param {Object} tree - The tree structure
 * @param {string[]} parts - Path parts array
 * @returns {Object|null} - The subtree or null if not found
 */
export function getSubTree(tree, parts) {
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