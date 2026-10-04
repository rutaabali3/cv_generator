# Harvard CV Builder

A modern, zero-dependency, privacy-first web application for building professional **Harvard-style résumés and CVs**. Edit directly on the document, drag sections to reorder, audit bullet strength for ATS, match job descriptions, and export pixel-perfect PDFs.

Built with pure **HTML5 + Material Design 3 CSS + Vanilla JavaScript** (no node_modules, no build step, no framework overhead).

---

## Key Features

- **Document-Style Live Preview:** Click directly into any text on the rendered CV preview and edit live.
- **Bi-Directional State Synchronization:** Edits made in the preview instantly update form fields, and form entries instantly update the preview.
- **Dynamic Multi-Page Pagination:** Automatically measures DOM heights and paginates continuous content across distinct A4 sheets with page indicators.
- **Multi-Profile Management:** Maintain separate CV versions (e.g. Frontend, Fullstack, Academic, Corporate) with instant switching, cloning, and renaming.
- **ATS Action-Verb & Bullet Strength Audit:** Real-time analysis flagging weak verbs ("Responsible for", "Helped"), first-person pronouns ("I", "my"), and highlighting quantifiable impact metrics.
- **Job Description Keyword Matcher:** Paste any job posting to calculate match percentage and see missing keyword chips before applying.
- **Region-Aware HR Compliance Checklist:** Toggle between US/UK standards (skip photo/demographics, enforce 1-page rule) and South Asia/Gulf standards (expected photo/nationality/DOB, multi-page).
- **Academic Standard Typography:** Typeset in authentic **Latin Modern Roman** (TeX/LaTeX standard) via local OpenType fonts.
- **Mobile-Friendly Floating Toolbar:** Format text (Bold, Italic, Underline) on touch screens without physical keyboard shortcuts.
- **100% Privacy & Local Storage:** No server, no accounts, no tracking. All data is saved directly in your browser. Supports full JSON export and import.

---

## Quickstart

Just double-click **`index.html`** in any web browser!

Or launch a local lightweight server:

```bash
# Python 3
python -m http.server 8000

# or Node.js
npx serve .
```

Then navigate to `http://localhost:8000`.

---

## Project Structure

```
cv-generator/
├── docs/                        # Complete project documentation
│   ├── README.md                # Documentation overview & index
│   ├── QUICKSTART.md            # Quickstart and deployment guide
│   ├── FEATURES.md              # Detailed breakdown of all features
│   ├── ARCHITECTURE.md          # State management & pagination engine
│   ├── DATA_SCHEMA.md           # JSON schema & localStorage layout
│   └── TROUBLESHOOTING.md       # Printing tips and FAQ
├── fonts/                       # Local OpenType Latin Modern Roman fonts
│   ├── LMRoman10-Regular.otf
│   ├── LMRoman10-Bold.otf
│   ├── LMRoman10-Italic.otf
│   └── LMRoman10-BoldItalic.otf
├── extra/                       # Archived backups, migration scripts, and upstream packages
│   ├── README.md                # Description of archived contents
│   ├── 1.html                   # Development duplicate
│   ├── 1_backup.html            # Pre-refactor backup
│   ├── 1_pre_md3_backup.html    # Pre-MD3 UI backup
│   ├── apply_updates.py         # Migration script
│   ├── fix_ui.py                # UI enhancement script
│   ├── harvard-cv-builder-updates.md # Internal feature checklist
│   ├── script.js                # Legacy JavaScript extract
│   ├── Muhammad Rutaab Ali - Resume (1).pdf # Sample export reference
│   └── lm/                      # Full upstream CTAN Latin Modern font package
├── index.html                   # Complete standalone application
└── README.md                    # Repository README (this file)
```

---

## Detailed Documentation

For in-depth guides and technical details, see the **[docs/](./docs/README.md)** directory:
- [Quickstart & Deployment](./docs/QUICKSTART.md)
- [Feature Walkthrough](./docs/FEATURES.md)
- [Technical Architecture](./docs/ARCHITECTURE.md)
- [Data Schema & Storage](./docs/DATA_SCHEMA.md)
- [Troubleshooting & PDF Optimization](./docs/TROUBLESHOOTING.md)

---

## Exporting Clean PDFs

1. Click **Download PDF** in the top bar (or press `Ctrl+P` / `Cmd+P`).
2. In your browser's print dialog:
   - **Destination:** Save as PDF
   - **Paper Size:** A4 (or Letter)
   - **Margins:** None
   - **Options:** Uncheck "Headers and Footers"
3. Click **Save**.
