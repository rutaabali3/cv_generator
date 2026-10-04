# Technical Architecture & Engineering Guide

This document describes the software design, state lifecycle, DOM rendering algorithms, and design token system behind Harvard CV Builder.

---

## 1. Architectural Philosophy

Harvard CV Builder is designed following **zero-toolchain, zero-runtime-dependency** principles:
- **Zero Build Step:** Runs directly in any modern browser without Webpack, Vite, Babel, or Node.js.
- **Portability:** The entire application logic is contained within a clean, self-sufficient structure (`index.html` + `fonts/`), making it trivially hostable on static CDNs or run from local disk (`file://`).
- **Data Sovereignty:** Client-side only. Zero remote API dependencies for core functionality; offline-first design.

---

## 2. State Management Model

The application operates on a reactive single source of truth (`state`):

```typescript
interface CVState {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    dob?: string;
    nationality?: string;
    website: string;
    github: string;
    other: string;
  };
  sections: Array<CVSection>;
}

interface CVSection {
  id: string;
  type: "summary" | "experience" | "education" | "projects" | "skills" | "certifications" | "awards" | "languages" | "custom";
  title: string;
  body?: string;              // Used by summary
  items?: Array<CVItem>;      // Used by experience, education, projects, etc.
  groups?: Array<SkillGroup>; // Used by skills
}
```

### Persistence Layer
- **Profiles State:** Stored under key `harvard-cv-builder/profiles-v1`. Contains a dictionary of profile records and an `activeId` pointer.
- **Active State:** Loaded dynamically into the working `state` object.
- **Auto-Save:** Mutation handlers invoke `saveState()` which serializes `state` into `localStorage` with debouncing, ensuring data survives page refreshes and unexpected window closures.

---

## 3. Dynamic Multi-Page Pagination Engine

One of the key engineering achievements is client-side dynamic pagination (`paginate()`):

### Sizing Dimensions
- **A4 Standard Aspect Ratio:** $210\text{mm} \times 297\text{mm}$
- **Screen Resolution Basis:** $96\text{ DPI} \rightarrow 794\text{px} \times 1123\text{px}$
- **Print Margin Budget:** $18\text{mm}$ top/bottom padding ($68\text{px}$ top/bottom) yields a usable inner printable height of approximately $987\text{px}$ per page.

### The Pagination Algorithm
1. **Measurement Sandbox:** A hidden, off-screen measurement container renders the CV header and section DOM nodes using identical typographic styles and line heights.
2. **Greedy Flow Allocation:**
   - The header is placed on Page 1.
   - For each section, the section title and its items are measured individually.
   - If an item exceeds the remaining printable height of the current page, a new page array is spawned (`startNewPage()`).
   - If an entire section block cannot fit, it moves cleanly to the next page rather than awkwardly splitting mid-header.
3. **Discrete Page Rendering:** Each page array is mounted into a distinct `.cv-page` container with CSS box-shadows, an A4 aspect ratio, and a footer indicating `Page X of Y`.

---

## 4. Bi-Directional DOM Synchronization

To enable true "click-to-edit" document behavior without full-page re-renders:
1. **Data Binding Paths:** Every editable preview element is tagged with a `data-path` attribute (e.g. `data-path="personal.name"`, `data-path="sections.1.items.0.title"`).
2. **Event Delegation:**
   - Inputs in the sidebar editor listen to `input` events and propagate changes to `state` and the preview element via `getByPath()`.
   - Contenteditable nodes in the preview listen to `input` and `blur` events, updating `state` and calling `syncEditorFromState()` to mirror changes back into the sidebar inputs.
3. **Non-Destructive DOM Updates:** Updating text through inline editing modifies the target DOM node directly, maintaining caret and selection stability without recreating the DOM tree.

---

## 5. Google Material Design 3 (MD3) Design Tokens

The UI implements Google's Material Design 3 token taxonomy using CSS custom properties:

```css
:root {
  /* Color Tokens */
  --md-sys-color-primary: #0b57d0;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #d3e3fd;
  --md-sys-color-surface: #f8fafd;
  --md-sys-color-surface-container: #e9eef6;
  --md-sys-color-outline: #747775;
  --md-sys-color-error: #ba1a1a;
  --md-sys-color-success: #146c2e;

  /* Elevations */
  --md-elevation-1: 0 1px 3px 1px rgba(0,0,0,0.07), 0 1px 2px 0 rgba(0,0,0,0.1);
  --md-elevation-2: 0 2px 6px 2px rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.12);
  --md-elevation-3: 0 4px 12px 3px rgba(0,0,0,0.09), 0 1px 4px 0 rgba(0,0,0,0.14);

  /* Shapes */
  --md-shape-sm: 8px;
  --md-shape-md: 12px;
  --md-shape-full: 9999px;
}
```

---

## 6. Typography & Font Subsystem

The CV preview uses academic standard serif typography:
- **Primary Typeface:** **Latin Modern Roman** (OpenType formats: Regular, Bold, Italic, BoldItalic), sourced directly from the TeX font distribution.
- **Storage:** Stored locally in `./fonts/` and registered through `@font-face` rules.
- **Fallback Hierarchy:** If web fonts are disabled or blocked, the font stack cascades gracefully:
  ```css
  font-family: "Latin Modern Roman", "Times New Roman", Times, Georgia, "Nimbus Roman", serif;
  ```
- **UI Font:** The editor and management panels utilize **Google Roboto** loaded via Google Fonts CDN with standard system sans-serif fallbacks.
