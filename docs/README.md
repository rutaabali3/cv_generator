# Harvard CV Builder Documentation

Welcome to the comprehensive documentation for **Harvard CV Builder**, a zero-dependency, browser-based web application for creating, managing, and exporting academic and professional Harvard-style résumés and CVs.

---

## Documentation Sections

| Guide | Description |
| :--- | :--- |
| **[Quickstart Guide](./QUICKSTART.md)** | Getting started, running locally, and deploying in under 2 minutes. |
| **[Features & Capabilities](./FEATURES.md)** | Deep dive into the live editor, ATS audit, JD matcher, multi-profile support, and regional checklists. |
| **[Technical Architecture](./ARCHITECTURE.md)** | Application design, reactive state engine, dynamic pagination logic, and design token system. |
| **[Data Schema & Storage](./DATA_SCHEMA.md)** | Specification of the JSON data model, section schemas, and `localStorage` layout. |
| **[Troubleshooting & FAQ](./TROUBLESHOOTING.md)** | Solutions for PDF rendering, layout overflow, font fallback, and browser storage. |

---

## Project Overview

Harvard CV Builder is engineered around simplicity, privacy, and typographic precision:
- **Zero Build Step:** Native vanilla JavaScript, semantic HTML5, and pure CSS3.
- **100% Client-Side Privacy:** No external servers, no tracking, and no cloud databases. All résumé data stays in the user's browser.
- **Google Material Design 3 (MD3):** A modern, accessible editor interface built with MD3 design tokens, responsive drawers, floating toolbars, and elevation layers.
- **Academic Standard Typography:** Typeset in authentic **Latin Modern Roman** (the standard TeX/LaTeX typeface) with graceful fallbacks to standard system serifs.
- **Dynamic Multi-Page Pagination:** Automatically measures DOM heights and paginates continuous content across distinct A4 sheets with page indicators.

---

## Directory Structure

```
cv-generator/
├── docs/                        # Complete project documentation
│   ├── README.md                # Documentation index (this file)
│   ├── QUICKSTART.md            # Quick start & deployment guide
│   ├── FEATURES.md              # Detailed feature walkthrough
│   ├── ARCHITECTURE.md          # Technical design & pagination algorithms
│   ├── DATA_SCHEMA.md           # JSON schema & storage specifications
│   └── TROUBLESHOOTING.md       # Troubleshooting & PDF optimization
├── fonts/                       # Local OpenType font files for LaTeX serif typography
│   ├── LMRoman10-Regular.otf
│   ├── LMRoman10-Bold.otf
│   ├── LMRoman10-Italic.otf
│   └── LMRoman10-BoldItalic.otf
├── extra/                       # Archived backups, migration scripts, and upstream packages
│   ├── README.md                # Description of archived files
│   ├── 1.html                   # Duplicate development file
│   ├── 1_backup.html            # Pre-refactor backup
│   ├── 1_pre_md3_backup.html    # Pre-MD3 UI backup
│   ├── apply_updates.py         # Update injection script
│   ├── fix_ui.py                # UI enhancement script
│   ├── harvard-cv-builder-updates.md # Internal feature checklist
│   ├── script.js                # Legacy JavaScript extract
│   ├── Muhammad Rutaab Ali - Resume (1).pdf # Sample reference export
│   └── lm/                      # Full upstream CTAN Latin Modern font package
├── index.html                   # The complete standalone web application
└── README.md                    # Repository README and project summary
```
