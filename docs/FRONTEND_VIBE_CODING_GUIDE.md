# Frontend Engineer (FE) — Vibe Coding Guide

> Frontend vibe coding guide optimized for Cline workflow.

Based on:

* frontend standards
* component architecture
* workflow process
* form/data-fetching patterns

---

# SECTION 1 — CLINE SETUP & WORKFLOW

---

# 🎯 Purpose

This guide ensures Cline:

* understands the project structure
* follows frontend architecture rules
* follows OpenSpec workflow
* generates consistent React code
* does NOT directly modify code before proposal approval

---

# 🚀 Initial Setup

---

## Use Node.js Version Above >= 20

OpenSpec requires Node.js >= 20+.

---

## 1. Install Cline

Install Cline extension in VS Code:

* Search: `Cline`
* Publisher: `saoudrizwan`

After install:

* connect your preferred AI provider
* enable workspace access
* allow terminal/file operations

---

## 2. Install OpenSpec

Inside project root:

```bash
npm install -g @openspec/cli
```

Verify installation:

```bash
openspec --version
```

---

## 3. Create Frontend Docs Folder

```txt
docs/frontend/
├── fundamentals.md
├── components.md
├── patterns.md
└── WORK_ORDER_INSTRUCTION.md
```

---

## 4. Create AGENTS.md

At project root:

```txt
AGENTS.md
```

---

## 5. Add Frontend Rules Into AGENTS.md

Example:

```md
# Frontend Workflow Rules

Always follow:
- docs/frontend/fundamentals.md
- docs/frontend/components.md
- docs/frontend/patterns.md
- docs/frontend/WORK_ORDER_INSTRUCTION.md

Always follow OpenSpec workflow.

Never directly implement after reading FSD/spec.
Always create proposal first.
```

---

# 🔄 OpenSpec Workflow (MANDATORY)

Frontend development MUST follow this workflow strictly.

---

## Step 1 — Create Proposal

Before implementation:

```bash
/openspec-propose-task
```

This step MUST:

* analyze FSD/TSD/requirement
* generate implementation plan
* generate affected files
* generate proposal/checklist

Review generated files inside:

```txt
openspec/changes/<feature-name>/
```

If proposal is incorrect:

* revise proposal first
* do NOT start coding immediately

---

## Step 2 — Wait For Approval

After proposal generation:

Cline MUST STOP.

Do NOT:

* create feature files
* modify implementation
* generate code directly

Until user says:

* "approved"
* "go"
* "implement"
* `/opsx:apply`

---

## Step 3 — Apply Implementation

After proposal approved:

```bash
/opsx:apply <feature-name>
```

Implementation should:

* follow existing feature patterns
* be incremental
* checkpoint major modules
* mirror existing architecture

---

# 📋 Expected Cline Behavior

Cline SHOULD:

* read AGENTS.md first
* mirror existing modules
* prioritize consistency
* avoid over-engineering
* reuse existing UI components

Cline SHOULD NOT:

* directly implement after reading FSD
* invent new architecture
* create unnecessary abstractions
* ignore existing feature patterns

---

# 🧪 Before Submitting

Always run:

```bash
npm run build
npm run lint
```

Manual QA:

* Create
* Edit
* View
* Delete
* Validation
* Filtering
* Pagination
* Loading state
* Responsive layout
* Prototype alignment

---

# 🛡️ Guardrails

* Never paste credentials/API keys
* Never bypass OpenSpec workflow
* Never ignore existing architecture
* Prefer consistency over abstraction
* Prefer iteration over one-shot generation

---

# SECTION 2 — FRONTEND TECH RULES & STANDARDS

---

# 🧠 Tech Stack

Default stack:

* React
* TypeScript
* React Hook Form
* Zod
* TanStack Query
* TailwindCSS
* Day.js
* TanStack Table

---

# 📦 Feature Structure

Every feature follows:

```txt
src/modules/[feature]/
├── [Feature]Screen.tsx
├── components/
├── hooks/
└── schemas/

src/services/[feature].ts
```

---

# 📐 Frontend Architecture Rules

---

## 1. Services Own API Calls

Never place API calls inside:

* components
* hooks
* pages

Always place them in:

```txt
src/services/[feature].ts
```

---

## 2. One Form = One RHF Context

Multi-tab forms MUST use:

* single `useForm`
* single `FormProvider`
* shared `useFormContext`

Never use local `useState` for form values inside tabs.

---

## 3. Use Existing UI Components

Never create custom:

* modal
* table
* input
* button
* select
* loading spinner

Always use:

```txt
@/components/ui/*
```

---

# ✅ Mandatory Components

---

## Modal

| Use Case             | Component     |
| -------------------- | ------------- |
| Forms / Detail Views | `AppModal`    |
| Confirmations        | `AlertDialog` |

Rules:

* Never use AlertDialog for forms
* Never use AppModal for confirmations

---

## Tables

Always use:

```tsx
<DataTable />
```

Never write manual `<table>` markup.

---

## Loading State

Always use:

```tsx
<LoadingOverlay />
```

Never create custom inline spinners.

---

## Date Input

Always use:

```tsx
<DatePicker />
```

Never:

```tsx
<InputField type="date" />
```

---

# 📅 Date Handling Rules

Never use:

* `new Date()`
* `Date.parse()`
* native Date methods

Always use:

```tsx
import dayjs from "@/lib/dayjs";
```

---

# 🔄 Form Pattern

All forms support:

```ts
mode?: "create" | "edit" | "view"
```

Rules:

* view mode disables all fields
* view mode hides submit button
* one form handles all modes

---

# 🔄 Inline Row Editing Pattern

Use:

```ts
isSaved: boolean
```

Pattern:

* `true` = readonly row
* `false` = editable row

Never create separate edit modal per row.

---

# 🔄 Data Fetching Pattern

Always use:

* TanStack Query
* centralized hooks
* `fetchDataAsync`

Example:

```tsx
useQuery({
  queryKey: ["banks"],
  queryFn: () =>
    fetchDataAsync({
      asyncFn: fetchBanks,
      setError,
      menuName: "master-bank",
    }),
});
```

---

# 🔄 Service Layer Rules

Always use:

```tsx
apiClient.get()
apiClient.post()
apiClient.put()
apiClient.patch()
apiClient.delete()
```

Use Axios `params`.

Never:

* create custom wrappers
* manually build URLSearchParams

---

# 🚫 Hard Constraints

| ❌ Never                                 | ✅ Always                  |
| --------------------------------------- | ------------------------- |
| Manual `<table>`                        | `DataTable`               |
| Custom modal overlay                    | `AppModal`                |
| `<InputField type="date">`              | `DatePicker`              |
| Native Date methods                     | `dayjs`                   |
| API calls in components                 | `/src/services/`          |
| useState for multi-tab forms            | RHF Context               |
| Separate row edit modals                | `isSaved` pattern         |
| Custom loading spinners                 | `LoadingOverlay`          |
| Labels + paragraphs for readonly detail | Disabled input components |
| One hook per file                       | Consolidated hooks        |

---

# 📋 Code Rules

1. Generate production-ready code
2. Include imports
3. No pseudocode
4. No TODO placeholders unless requested
5. Use strict TypeScript
6. Use `import type`
7. Avoid `as any`
8. Follow existing feature patterns first
9. Prefer consistency over abstraction

---

# 🧠 Reference Modules

Mirror these first:

* `src/modules/master-user/`
* `src/modules/receiving-unit/`

When unsure:

* follow existing implementation
* do NOT invent new patterns
