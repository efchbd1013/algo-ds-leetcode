# CSS File Structure Documentation

This project follows a modular CSS architecture with each file handling specific aspects of the user interface. The files are imported through `main.css` which serves as the master import file.

## 📁 File Structure Overview

```
styles/
├── main.css          # Master import file
├── base.css          # Core foundation
├── header.css        # Header components
├── controls.css      # Interactive controls
├── cards.css         # Card components
├── code-viewer.css   # Code display
├── animations.css    # Animations & effects
├── utilities.css     # Helper classes
└── responsive.css    # Mobile responsiveness
```

## 🎯 File Descriptions

### 1. **main.css** - Master Import File
The entry point that imports all other CSS files in the correct order. This file ensures proper cascade and dependency management.

**Purpose:** Central import management  
**Dependencies:** All other CSS files

### 2. **base.css** - Foundation & Design System
Contains the core reset, CSS custom properties (variables), and fundamental styles that form the design system foundation.

**Key Features:**
- CSS reset for consistent cross-browser rendering
- Design token system with CSS custom properties
- Color palette (primary, secondary, neutral, status colors)
- Gradient definitions
- Shadow system
- Base typography and container layouts

### 3. **header.css** - Header & Navigation
Handles all header-related components including branding, navigation, and page statistics.

**Components:**
- Logo and branding styles
- Subtitle and page titles
- Statistics bar with hover effects
- Breadcrumb navigation
- Header layout and positioning

### 4. **controls.css** - Interactive Controls
Manages all user interaction elements including search, filters, and view toggles.

**Components:**
- Search input with icon positioning
- Filter button groups with active states
- View toggle controls (grid/list)
- Back button styling
- Focus states and transitions

### 5. **cards.css** - Card Components
Comprehensive card system with multiple layout modes and interactive states.

**Features:**
- Base card styling with glassmorphism effect
- Grid and list view layouts
- Hover animations and shimmer effects
- Card metadata and tag system
- Favorite button functionality
- List-specific card variations

### 6. **code-viewer.css** - Code Display
Specialized styling for code presentation and syntax highlighting areas.

**Components:**
- Code viewer container with dark theme
- Header section with title and actions
- Action buttons for code interactions
- Pre-formatted code block styling
- Syntax highlighting support structure

### 7. **animations.css** - Animations & Effects
Contains all keyframe animations and dynamic visual effects used throughout the application.

**Animations:**
- Floating background shapes
- Loading spinner with rotation
- Fade-in and slide-in transitions
- Utility animation classes
- Keyframe definitions (float, spin, fadeIn, slideIn)

### 8. **utilities.css** - Helper Classes
Utility classes and special states that can be applied across components.

**Utilities:**
- No results state styling
- Tooltip system with hover effects
- Reusable helper classes
- Special application states

### 9. **responsive.css** - Mobile Responsiveness
Media queries and mobile-specific adaptations for all components.

**Breakpoints:**
- Mobile and tablet styles (max-width: 768px)
- Component-specific mobile layouts
- Touch-friendly sizing adjustments
- Responsive typography scaling

## 🎨 Design System

### Color Palette
- **Primary:** `#6366f1` (Indigo)
- **Secondary:** `#ec4899` (Pink)
- **Accent:** `#14b8a6` (Teal)
- **Dark Theme:** `#0f172a` to `#1e293b`

### Effects & Animations
- **Glassmorphism:** Backdrop blur with transparency
- **Smooth Transitions:** 0.3s to 0.4s cubic-bezier easing
- **Hover States:** Transform and shadow effects
- **Loading States:** Animated spinners and skeleton screens

### Typography
- **Font Family:** Inter, Segoe UI fallbacks
- **Weight Scale:** 400 (normal) to 900 (black)
- **Size Scale:** 0.8rem to 3rem responsive scaling

## 🛠 Usage Guidelines

### Import Order
The files are imported in dependency order through `main.css`:
1. Base styles and variables
2. Animations and keyframes
3. Layout components (header, controls)
4. Content components (cards, code-viewer)
5. Utilities and responsive styles

### Customization
- Modify CSS custom properties in `base.css` for theme changes
- Add new animations to `animations.css`
- Extend utility classes in `utilities.css`
- Add breakpoints in `responsive.css`

### Performance Notes
- Uses CSS custom properties for efficient theme management
- Leverages hardware acceleration for animations
- Optimized for modern browsers with backdrop-filter support
- Minimal specificity conflicts due to modular structure

## 🎯 Key Features

- **Modular Architecture:** Clean separation of concerns
- **Dark Theme:** Modern dark UI with accent colors
- **Glassmorphism:** Contemporary glass-like effects
- **Smooth Animations:** Hardware-accelerated transitions
- **Responsive Design:** Mobile-first approach
- **Accessibility:** Focus states and semantic structure
