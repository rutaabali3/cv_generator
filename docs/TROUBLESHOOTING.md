# Troubleshooting & FAQ

Common solutions, printing best practices, and browser considerations for Harvard CV Builder.

---

## 1. How to Export the Perfect PDF

### Direct One-Click PDF Download (Default)
Simply click the **Download PDF** button in the top navigation bar.
- Generates a clean, multi-page vector A4 PDF matching the on-screen Harvard format.
- Directly downloads to your device without opening browser print dialogs.
- Automatic filename based on your name (e.g., `Muhammad_Rutaab_Ali.pdf`).

### Physical Hardware Printing (Optional)
If you want to send your CV to a physical printer connected to your computer:
1. Click **More Options (⋮)** in the top bar and select **Print dialog (Hardware printer)**, or press `Ctrl + P` / `Cmd + P`.
2. Select your printer, choose paper size **A4**, set margins to **None**, and uncheck headers/footers.

---

## 2. Frequently Asked Questions

### Why does my CV spill over onto a second page with just 1 or 2 lines?
Harvard CV Builder uses dynamic pagination to prevent awkward mid-item text cuts. If your content is slightly too long for 1 page:
- Trim redundant bullet points or shorten line wrapping.
- Adjust multi-line descriptions into concise single-line bullets.
- Remove less relevant skills or secondary contact links.
- Check the **Region Checklist** to verify if a 1-page format is required for your target jurisdiction.

### Will ATS (Applicant Tracking Systems) be able to read my exported PDF?
**Yes, 100%.**
- The document is structured in a single-column layout.
- The font is standard serif vector text (searchable and selectable).
- No floating textboxes, images, canvas elements, tables, or complex CSS flex grids are used on the document itself.
- Standard section headers (e.g. *EDUCATION*, *EXPERIENCE*, *SKILLS*) ensure automated ATS parsers classify every entry with high accuracy.

### Can I use this completely offline?
**Yes.** Once the page is loaded (or if opened from local disk with fonts in the `./fonts/` directory), you do not need an active internet connection. All data saves to `localStorage` and PDF export leverages your browser's native print engine.

### How do I move my CV to another computer?
1. Open the application on your original computer.
2. Click **More (⋮) > Export JSON** in the top bar.
3. Save the `.json` file to a USB drive, send it via email, or save to cloud storage.
4. On your new computer, open Harvard CV Builder and click **More (⋮) > Import JSON** to restore your exact profiles and content.

### What happened to the old separate `styles.css` and `app.js` files?
To ensure maximum ease of deployment, atomic updates, and zero path-resolution failures when moved across directories or static hosting providers, all CSS tokens and JavaScript modules have been unified into a single, high-performance file (`index.html`).

---

## 3. Font Loading Diagnostics

If the typography falls back to default system serif (*Times New Roman*):
1. Verify that the `fonts/` directory is situated alongside `index.html`.
2. Ensure the four OpenType font files exist:
   - `LMRoman10-Regular.otf`
   - `LMRoman10-Bold.otf`
   - `LMRoman10-Italic.otf`
   - `LMRoman10-BoldItalic.otf`
3. If running via local file protocol (`file:///`) in certain strict browser environments, open via a local HTTP server (`python -m http.server`) to allow local font origin reading.
