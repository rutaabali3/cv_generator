# Data Schema & Storage Specification

This document details the data structures used by Harvard CV Builder for `localStorage` persistence and JSON import/export.

---

## 1. Complete CV Document Schema

Exporting a CV produces a `.json` file containing the user's active CV data.

### Root Object

```json
{
  "personal": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "dob": "string",
    "nationality": "string",
    "website": "string",
    "github": "string",
    "other": "string"
  },
  "sections": [
    {
      "id": "string",
      "type": "string",
      "title": "string",
      "body": "string",
      "items": [],
      "groups": []
    }
  ]
}
```

---

## 2. Section Types & Schemas

### 2.1 Summary Section (`type: "summary"`)
```json
{
  "id": "u4x8z19q",
  "type": "summary",
  "title": "Professional Summary",
  "body": "Results-oriented Software Engineer with 4+ years of experience in distributed systems and cloud architecture..."
}
```

### 2.2 Standard Multi-Item Section (`type: "experience" | "education" | "projects" | "certifications" | "awards" | "languages" | "custom"`)
```json
{
  "id": "k91d8s2a",
  "type": "experience",
  "title": "Work Experience",
  "items": [
    {
      "id": "p0x918bs",
      "title": "Senior Frontend Developer",
      "sub": "Tech Corp Inc. — San Francisco, CA",
      "date": "2023 – Present",
      "body": "• Architected responsive enterprise dashboard reducing customer load time by 42%.\n• Spearheaded migration of legacy frontend to modern micro-frontend architecture.",
      "extraFields": [
        { "label": "Key Tech", "value": "React, TypeScript, GraphQL" }
      ]
    }
  ]
}
```

### 2.3 Skills Grouped Section (`type: "skills"`)
```json
{
  "id": "m481x2ka",
  "type": "skills",
  "title": "Technical Skills",
  "groups": [
    {
      "id": "g1",
      "name": "Languages",
      "items": ["TypeScript", "JavaScript", "Python", "Go", "SQL"]
    },
    {
      "id": "g2",
      "name": "Frameworks & Libraries",
      "items": ["React", "Next.js", "Node.js", "FastAPI", "TailwindCSS"]
    },
    {
      "id": "g3",
      "name": "Tools & Cloud",
      "items": ["Docker", "Kubernetes", "AWS", "Git", "GitHub Actions"]
    }
  ]
}
```

---

## 3. Local Storage Architecture

The application manages two primary keys in the browser's `window.localStorage`:

### Key 1: `harvard-cv-builder/v1`
Stores the active working CV data as a JSON string matching the Root Object schema above.

### Key 2: `harvard-cv-builder/profiles-v1`
Stores the catalog of user-defined profiles and tracks the active selection:

```json
{
  "activeId": "default",
  "profiles": [
    {
      "id": "default",
      "name": "My CV",
      "updatedAt": 1728087600000,
      "data": { ... }
    },
    {
      "id": "prof_9x281a",
      "name": "DevOps Application",
      "updatedAt": 1728088200000,
      "data": { ... }
    }
  ]
}
```

---

## 4. Import / Export Integrity

When importing a `.json` file:
1. The parser verifies the existence of `personal` and `sections` objects.
2. Missing fields in `personal` are populated with default empty strings to avoid `null`/`undefined` rendering bugs.
3. Each section is normalized using `normalizeSection()`, ensuring unique IDs and consistent item models.
4. If the JSON structure is corrupted or invalid, an accessible error dialog notifies the user without corrupting existing browser storage.
