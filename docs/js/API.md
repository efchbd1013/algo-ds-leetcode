# API Documentation

Detailed reference for all modules, classes, and functions in CodeMaster Pro.

## 📚 Table of Contents

- [MainPlatform](#mainplatform) - Central orchestrator
- [DataManager](#datamanager) - Data operations
- [UIManager](#uimanager) - UI rendering
- [NavigationManager](#navigationmanager) - Navigation control
- [EventManager](#eventmanager) - Event handling
- [Utils](#utils) - Utility functions
- [Config](#config) - Configuration constants

---

## MainPlatform

Central coordinator that manages all other components and application state.

### Constructor

```javascript
new MainPlatform()
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `dataManager` | DataManager | Data operations manager |
| `uiManager` | UIManager | UI rendering manager |
| `navigationManager` | NavigationManager | Navigation manager |
| `eventManager` | EventManager | Event handling manager |
| `currentView` | string | Current view mode ('grid' \| 'list') |
| `currentFilter` | string | Current filter ('all' \| 'favorites') |
| `searchQuery` | string | Active search query |
| `filteredPaths` | string[] | Filtered file paths |

### Methods

#### `initialize()`
Sets up the application and initializes all managers.

```javascript
await platform.initialize()
```

**Returns:** `Promise<void>`

#### `applyFilters()`
Applies current search and filter settings to update the displayed content.

```javascript
platform.applyFilters()
```

#### `loadFile(path)`
Loads and displays a specific code file.

```javascript
await platform.loadFile('path/to/solution.cs')
```

**Parameters:**
- `path` (string): File path to load

**Returns:** `Promise<void>`

#### `navigateToFolder(folder, title?)`
Navigates to a specific folder in the tree structure.

```javascript
platform.navigateToFolder(folderObject, 'Folder Title')
```

**Parameters:**
- `folder` (Object): Folder object from tree structure
- `title` (string, optional): Display title for the folder

#### `toggleFavorite(path)`
Toggles favorite status for a file.

```javascript
platform.toggleFavorite('path/to/solution.cs')
```

**Parameters:**
- `path` (string): File path to toggle

---

## DataManager

Handles all data operations including API calls and local storage.

### Constructor

```javascript
new DataManager()
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `fullTree` | Object | Complete folder structure |
| `allPaths` | string[] | All file paths |
| `problemData` | Map | Problem metadata |
| `fileCache` | Map | Cached file contents |
| `favorites` | Set | User favorite files |

### Methods

#### `loadData()`
Fetches repository structure from GitHub API and builds the tree.

```javascript
await dataManager.loadData()
```

**Returns:** `Promise<void>`

**Throws:** Error if API request fails

#### `loadFile(path)`
Loads content for a specific file.

```javascript
const content = await dataManager.loadFile('path/to/file.cs')
```

**Parameters:**
- `path` (string): File path to load

**Returns:** `Promise<string>` - File content

#### `filterPaths(query, filter)`
Filters file paths based on search query and filter type.

```javascript
const filtered = dataManager.filterPaths('binary search', 'favorites')
```

**Parameters:**
- `query` (string): Search query
- `filter` (string): Filter type ('all' | 'favorites')

**Returns:** `string[]` - Filtered paths

#### `toggleFavorite(path)`
Toggles favorite status and persists to localStorage.

```javascript
const isFavorite = dataManager.toggleFavorite('path/to/file.cs')
```

**Parameters:**
- `path` (string): File path

**Returns:** `boolean` - New favorite status

#### `getStats()`
Returns statistics about loaded data.

```javascript
const stats = dataManager.getStats()
// { totalFiles: 150, totalFavorites: 12, loadedFiles: 5 }
```

**Returns:** `Object` - Statistics object

---

## UIManager

Manages all DOM operations and visual components.

### Constructor

```javascript
new UIManager()
```

### Methods

#### `createCard(item, path, type)`
Creates a DOM element for a file or folder card.

```javascript
const cardElement = uiManager.createCard(
  { name: 'TwoSum', description: '...' },
  'path/to/file.cs',
  'file'
)
```

**Parameters:**
- `item` (Object): Item data with name and description
- `path` (string): Item path
- `type` (string): Item type ('file' | 'folder')

**Returns:** `HTMLElement` - Card DOM element

#### `renderCodeViewer(code, filename, path)`
Displays code with syntax highlighting in a modal viewer.

```javascript
uiManager.renderCodeViewer(
  'public class Solution { ... }',
  'TwoSum.cs',
  'path/to/TwoSum.cs'
)
```

**Parameters:**
- `code` (string): Code content
- `filename` (string): Display filename
- `path` (string): File path

#### `updateBreadcrumb(path)`
Updates the breadcrumb navigation display.

```javascript
uiManager.updateBreadcrumb(['Easy', 'Array', 'TwoSum'])
```

**Parameters:**
- `path` (string[]): Breadcrumb path segments

#### `showNotification(message, type, duration?)`
Shows a toast notification to the user.

```javascript
uiManager.showNotification('File saved successfully!', 'success', 3000)
```

**Parameters:**
- `message` (string): Notification message
- `type` (string): Notification type ('success' | 'error' | 'info' | 'warning')
- `duration` (number, optional): Display duration in ms (default: 3000)

#### `setViewMode(mode)`
Switches between grid and list view modes.

```javascript
uiManager.setViewMode('list')
```

**Parameters:**
- `mode` (string): View mode ('grid' | 'list')

#### `renderCards(items, searchQuery?)`
Renders multiple cards with optional search highlighting.

```javascript
uiManager.renderCards(fileArray, 'binary search')
```

**Parameters:**
- `items` (Array): Array of items to render
- `searchQuery` (string, optional): Query for highlighting

---

## NavigationManager

Manages application navigation state and history.

### Constructor

```javascript
new NavigationManager()
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `history` | Array | Navigation history stack |
| `currentState` | Object | Current navigation state |

### Methods

#### `navigateToFolder(level, title, preserveState?)`
Navigate to a specific folder and update history.

```javascript
navigationManager.navigateToFolder(
  folderObject,
  'Arrays',
  { search: 'binary', filter: 'all' }
)
```

**Parameters:**
- `level` (Object | Array): Target navigation level
- `title` (string): Display title
- `preserveState` (Object, optional): State to preserve

#### `navigateBack()`
Navigate back to previous state in history.

```javascript
const success = navigationManager.navigateBack()
```

**Returns:** `boolean` - True if navigation successful

#### `getBreadcrumbPath()`
Generate breadcrumb path for current location.

```javascript
const breadcrumb = navigationManager.getBreadcrumbPath()
// ['Home', 'Easy', 'Arrays']
```

**Returns:** `string[]` - Breadcrumb segments

#### `hasHistory()`
Check if back navigation is available.

```javascript
const canGoBack = navigationManager.hasHistory()
```

**Returns:** `boolean` - True if history exists

#### `getCurrentLevel()`
Get the current navigation level.

```javascript
const level = navigationManager.getCurrentLevel()
```

**Returns:** `Object | Array` - Current level data

---

## EventManager

Manages all user interactions and event listeners.

### Constructor

```javascript
new EventManager(platform)
```

**Parameters:**
- `platform` (MainPlatform): Reference to main platform

### Methods

#### `initialize()`
Sets up all event listeners and keyboard shortcuts.

```javascript
eventManager.initialize()
```

#### `cleanup()`
Removes all event listeners to prevent memory leaks.

```javascript
eventManager.cleanup()
```

### Event Handlers

#### Search Events
- **Input debouncing** - 300ms delay to prevent excessive API calls
- **Real-time filtering** - Updates results as user types

#### Keyboard Shortcuts
- **`/` or `Ctrl+K`** - Focus search input
- **`Escape`** - Navigate back or close modals

#### Click Events
- **File cards** - Load and display file content
- **Folder cards** - Navigate to folder
- **Favorite buttons** - Toggle favorite status
- **View toggles** - Switch between grid/list views

---

## Utils

Common utility functions used across the application.

### String Processing

#### `escapeHtml(text)`
Escapes HTML characters to prevent XSS attacks.

```javascript
const safe = escapeHtml('<script>alert("xss")</script>')
// '&lt;script&gt;alert("xss")&lt;/script&gt;'
```

#### `formatProblemName(filename)`
Converts filename to readable problem name.

```javascript
const name = formatProblemName('twoSumSolution.cs')
// 'Two Sum Solution'
```

#### `extractProblemNumber(path)`
Extracts problem number from file path.

```javascript
const number = extractProblemNumber('001-two-sum/solution.cs')
// 1
```

### Data Structures

#### `buildTree(paths)`
Converts flat array of paths to hierarchical tree structure.

```javascript
const tree = buildTree([
  'easy/arrays/twoSum.cs',
  'easy/strings/reverseString.cs'
])
```

**Parameters:**
- `paths` (string[]): Array of file paths

**Returns:** `Object` - Tree structure

#### `getSubTree(tree, pathArray)`
Navigate to specific branch in tree structure.

```javascript
const subtree = getSubTree(fullTree, ['easy', 'arrays'])
```

**Parameters:**
- `tree` (Object): Tree structure
- `pathArray` (string[]): Path to navigate

**Returns:** `Object` - Subtree at specified path

### UI Helpers

#### `debounce(func, delay)`
Creates a debounced version of a function.

```javascript
const debouncedSearch = debounce((query) => search(query), 300)
```

**Parameters:**
- `func` (Function): Function to debounce
- `delay` (number): Delay in milliseconds

**Returns:** `Function` - Debounced function

#### `animateNumber(element, start, end, duration)`
Animates numerical value changes in DOM element.

```javascript
animateNumber(counterElement, 0, 150, 1000)
```

**Parameters:**
- `element` (HTMLElement): Target DOM element
- `start` (number): Starting value
- `end` (number): Ending value
- `duration` (number): Animation duration in ms

#### `downloadFile(content, filename, mimeType?)`
Triggers file download in browser.

```javascript
downloadFile(
  'public class Solution { ... }',
  'TwoSum.cs',
  'text/plain'
)
```

**Parameters:**
- `content` (string): File content
- `filename` (string): Download filename
- `mimeType` (string, optional): MIME type (default: 'text/plain')

---

## Config

Application configuration and constants.

### CONFIG Object

Main configuration object containing all application settings.

```javascript
CONFIG = {
  GITHUB: {
    OWNER: "efrat-dev",
    REPO: "algo-ds-leetcode",
    BRANCH: "main"
  },
  API: {
    BASE_URL: "https://api.github.com",
    RATE_LIMIT_DELAY: 1000
  },
  UI: {
    SEARCH_DEBOUNCE_DELAY: 300,
    ANIMATION_DELAY_INCREMENT: 0.1,
    NOTIFICATION_DURATION: 3000,
    MAX_CARDS_PER_BATCH: 50
  },
  STORAGE_KEYS: {
    FAVORITES: 'codemaster_favorites',
    VIEW_MODE: 'codemaster_view_mode',
    THEME: 'codemaster_theme'
  },
  FILE_TYPES: {
    CS: 'csharp',
    JS: 'javascript',
    PY: 'python',
    JAVA: 'java'
  }
}
```

### PROBLEM_DESCRIPTIONS

Array of sample problem descriptions for random assignment.

### DEFAULTS

Default values for various application settings.

```javascript
DEFAULTS = {
  VIEW: 'grid',
  FILTER: 'all',
  SEARCH: '',
  LANGUAGE: 'csharp'
}
```

---

## Error Handling

All API methods include comprehensive error handling:

```javascript
try {
  await dataManager.loadData()
} catch (error) {
  console.error('Failed to load data:', error)
  uiManager.showNotification('Failed to load repository data', 'error')
  // Graceful degradation logic here
}
```

Common error types:
- **Network errors** - API requests fail
- **Rate limiting** - GitHub API limits exceeded
- **Storage errors** - localStorage quota exceeded
- **DOM errors** - Elements not found or invalid operations

---

This API documentation provides complete reference for integrating with or extending CodeMaster Pro. All methods include proper error handling and return appropriate data types.
