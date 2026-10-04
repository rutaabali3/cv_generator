# Harvard CV Builder — Update Summary

Here's where things stand — all five requested improvements are built; one bug fix is being finished before re-testing and shipping.

## What's been added

### 1. Multiple saved CV profiles
A new panel at the top of the sidebar lets you keep separate CVs — one general, one per job application, etc. New / Duplicate / Rename / Delete, with a dropdown to switch between them. Your existing CV auto-migrates into a "My CV" profile the first time you open the updated file, so nothing is lost.

### 2. Mobile-friendly formatting toolbar
Select any text — on a phone or a desktop — and a small floating Bold/Italic/Underline toolbar pops up right above the selection. Ctrl/Cmd+B/I/U still work too; the toolbar is for people without a keyboard.

### 3. Job-description keyword matcher
New panel: paste a job posting in, and it shows a keyword-match score (e.g. "89% match") plus two chip lists — keywords already in your CV (green) and ones you're missing (red) — so you can see what to add before applying.

### 4. Weak-bullet / action-verb checker
Auto-scans every bullet in Experience/Education/Custom sections as you type. Flags two things: bullets that open weakly (starting with "I," "Responsible for," "Helped," etc.) and bullets with no number in them — both shown as a short list so you know exactly which lines to rewrite.

### 5. Region-aware HR checklist
The checklist now has a "Style" toggle: **US/UK** (current advice — skip photo/age/marital status) vs **South Asia/Gulf** (where photo, date of birth, and nationality are often expected, so the checklist tells you to include them instead). This fixes the mismatch flagged earlier, where the advice didn't match the Date of Birth/Nationality fields already built into the tool.

## The bug being fixed right now

While testing, Bold was found to behave oddly on fields that are *already* bold by design — the Name, section headings, item titles. The browser tries to "un-bold" them instead of doing anything useful, since it judges boldness off their current look, not intent.

**Fix:** hide the Bold button (keep Italic/Underline) specifically on those fields, since bold is redundant there anyway. One more edit, then the full test suite gets re-run and the file ships.
