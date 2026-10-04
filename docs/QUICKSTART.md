# Quickstart Guide

This guide walks you through launching Harvard CV Builder locally, configuring your résumé, and deploying it to the web.

---

## 1. Quick Launch (Zero Setup)

Because Harvard CV Builder has no dependencies, bundlers, or compilers, you can run it immediately in any web browser:

1. Navigate to the project folder.
2. Double-click **`index.html`** or right-click and select **Open with > Chrome / Firefox / Edge / Safari**.
3. The application will initialize with your last saved CV (or the pre-configured sample CV if opened for the first time).

---

## 2. Running via a Local HTTP Server (Recommended)

Running through a local web server ensures optimal font loading performance across all browsers:

### Python 3
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### Node.js (npx)
```bash
npx serve .
# or
npx http-server .
```

### VS Code Live Server
Right-click `index.html` in VS Code and select **Open with Live Server**.

---

## 3. Basic Workflow

1. **Load Sample or Start Blank:**
   - Click **Load Sample** in the top navigation bar to populate the Muhammad Rutaab Ali template.
   - Or click **More (⋮) > Clear CV** to start with a clean slate.
2. **Fill in Personal Information:**
   - Expand the **Personal Info** panel in the left sidebar drawer.
   - Enter your full name, professional title, email, phone number, location, and optional links (GitHub, LinkedIn, Portfolio).
3. **Add and Reorder Sections:**
   - Use the **Add Section** dropdown at the bottom of the editor to insert Experience, Education, Projects, Skills, Awards, Certifications, Languages, or Custom sections.
   - Drag sections using the grab handle (`⋮⋮`) to reorder them logically.
4. **Direct Preview Editing:**
   - You can click directly into any text on the right-hand preview page and edit it like a document! Changes sync instantly back to the form controls.
5. **Optimize with Built-in Tools:**
   - Open **Bullet Strength Audit** to replace weak verbs and add measurable metrics.
   - Open **Job Matcher**, paste the target job description, and view your match percentage and keyword gaps.
6. **Export Your CV:**
   - Click the **Download PDF** button.
   - In your browser's print dialog, choose **Save as PDF**, set margins to **None**, and ensure background graphics are toggled off.

---

## 4. Deploying to the Web

Since Harvard CV Builder is a 100% static application, it can be hosted for free on any static site provider:

### GitHub Pages
1. Push this repository to GitHub.
2. Go to repository **Settings > Pages**.
3. Under **Branch**, select `main` (or `master`) and set the folder to `/ (root)`.
4. Click **Save**. Your site will be live within 60 seconds.

### Vercel / Netlify / Cloudflare Pages
- **Vercel:** Drag and drop the repository folder into Vercel dashboard, or run `vercel`.
- **Netlify:** Drag the folder into Netlify Drop at `app.netlify.com/drop`.
- **Cloudflare Pages:** Connect repository and select default static deploy (no build command needed).
