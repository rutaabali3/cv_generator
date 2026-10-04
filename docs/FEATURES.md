# Features & Capabilities

Harvard CV Builder combines classic academic résumé formatting with modern intelligent productivity features.

---

## 1. Document-Style Live Preview & Two-Way Synchronization

The preview pane is not just a passive renderer—it is a live, editable document:
- **Click-to-Edit:** Click on any header, subheader, role, organization, bullet, or contact detail on the preview document and start typing directly.
- **Bi-directional Sync:** Editing on the preview automatically updates the corresponding form input in the editor drawer. Conversely, typing in the editor instantly updates the preview without a full-page reload.
- **Document Zoom Controls:** Floating zoom buttons allow scaling the preview from 50% to 150%, or clicking **Fit** to adjust the zoom dynamically to your viewport.

---

## 2. Multi-Profile Management

Tailor different CV versions for distinct job applications without overwriting your primary résumé:
- **Create New Profile:** Start a new profile from scratch or initialize from a template.
- **Duplicate Profile:** Clone an existing profile (e.g., clone "General Software Engineer" to create "Frontend Specialist").
- **Rename & Delete:** Maintain clean labels for each job application or role.
- **Automatic Migration:** Existing single-CV installations automatically migrate to a default profile ("My CV") upon upgrade with no data loss.
- **Profile Persistence:** All profiles and active profile selections are safely saved in `localStorage`.

---

## 3. Real-Time ATS & Bullet Strength Audit

Automated writing assistance specifically tuned for hiring managers and Applicant Tracking Systems (ATS):
- **Weak Verb Detection:** Identifies passive or vague opening phrases such as *"Responsible for"*, *"Assisted in"*, *"Helped with"*, or *"Worked on"* and flags them for improvement with strong action verbs (e.g., *"Spearheaded"*, *"Architected"*, *"Optimized"*).
- **First-Person Pronoun Check:** Flags usage of first-person pronouns (*"I"*, *"me"*, *"my"*) which are strictly discouraged by Harvard CV standards.
- **Measurable Impact & Metric Detector:** Evaluates whether each bullet contains quantifiable figures (percentages, dollar amounts, performance multipliers, numbers of users/clients). Bullets lacking numbers are highlighted so you can add concrete metrics.

---

## 4. Job Description (JD) Keyword Matcher

Optimize your résumé for target role requirements before submitting:
- **Instant Tokenization:** Paste any job posting description into the Job Matcher panel.
- **Match Score Calculation:** Computes an accurate keyword match percentage indicating how many key skills and requirements appear in your CV text.
- **Visual Keyword Chips:**
  - **Green Chips (`✓`):** Keywords already present in your CV.
  - **Red Chips (`+`):** Missing keywords from the job description that you should consider integrating.

---

## 5. Region-Aware HR Compliance Checklist

Hiring conventions vary substantially across geographic markets. The built-in checklist switches recommendations based on your target destination:

### US / UK / EU Standard Mode
- **Photo:** Strictly advises omitting personal photos to protect against unconscious bias and ensure compliance with employment anti-discrimination regulations.
- **Date of Birth & Nationality:** Advises omitting personal demographics.
- **Length Constraint:** Strictly enforces a 1-page document rule for candidates with under 5 years of professional experience.
- **ATS Parsing:** Verifies single-column layout with no tables, columns, or graphic icons that break standard ATS parsers.

### South Asia / Gulf Standard Mode
- **Photo & Demographics:** Notes that personal headshots, dates of birth, and nationality are standard and often mandatory for visa processing and corporate HR screening in UAE, Saudi Arabia, Qatar, Pakistan, and India.
- **Extended Length:** Supports 2-page formats for comprehensive project portfolios and career histories.

---

## 6. Dynamic Multi-Page Pagination Engine

Unlike standard HTML-to-PDF generators that haphazardly cut text across page boundaries, Harvard CV Builder includes a smart client-side pagination algorithm:
- Measures the vertical pixel heights of every section and item.
- Splits items into separate, numbered A4 pages when content exceeds the printable height threshold.
- Renders discrete page sheets with realistic shadows and page numbers (`Page 1 of 2`).
- Prevents awkward orphan headers by keeping section headings attached to their first content block.

---

## 7. Floating Selection Toolbar for Touch & Mobile

Selecting text in the document triggers a floating context toolbar:
- Quick toggling for **Bold**, **Italic**, and **Underline** formatting.
- Fully accessible on mobile and touchscreen devices without requiring physical keyboard shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+U`).
- Smart field detection: Hides redundant Bold actions on fields that are already styled in bold by Harvard typography (e.g., name and section titles).

---

## 8. Supported Section Types

1. **Personal Information:** Name, title, email, phone, location, date of birth, nationality, website, GitHub, and custom link fields.
2. **Summary / Objective:** Free-form opening paragraph.
3. **Experience:** Organization, role, location, start/end dates, and bulleted achievements.
4. **Education:** School/University, degree/major, location, graduation date, and honors/GPA notes.
5. **Projects:** Project name, technology tags, live demo/repository URLs, and bulleted contributions.
6. **Skills:** Categorized grouping (e.g., *Frontend*, *Backend*, *DevOps*, *Soft Skills*) with comma-delimited skill tags.
7. **Certifications:** Credential name, issuing body, date acquired, and verification links.
8. **Awards & Honors:** Title, granting institution, date, and description.
9. **Languages:** Language names and fluency proficiencies.
10. **Custom Section:** Free-form section type allowing custom section headers and item hierarchies.

---

## 9. Data Portability & Backup

- **JSON Export:** Download your entire résumé dataset as a standardized `.json` file.
- **JSON Import:** Restore or transfer data across browsers and computers instantly.
- **Zero Lock-in:** Open format that allows easy programmatic parsing or conversion.
