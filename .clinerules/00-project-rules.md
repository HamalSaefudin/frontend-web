# Project Rules — Source of Truth

**REQUIRED:** Read and strictly follow the rules in `CLAUDE.md` at the project root before generating any code.

This project uses **CLAUDE.md** as the single source of truth for all AI agents (Claude, Cline, Cursor, etc.).

## Critical Rules to Verify Before Writing Code

1. **The DO NOT section** at the top of `CLAUDE.md` — these are common AI-generated mistakes that have caused real refactor work
2. **Required UI components** (no custom alternatives):
   - `AppModal` for forms/details — never custom `fixed inset-0` divs
   - `DataTable` from `@/components/ui/table` — never manual `<table>` markup
   - `SelectField`, `DatePicker`, `InputField` from `@/components/ui/*`
3. **Form patterns**:
   - React Hook Form + Zod for all forms
   - `useFormContext` for multi-tab forms (one RHF instance shared across tabs)
   - `isSaved` flag for inline row editing — not modal-based add/edit
4. **Feature structure**:
   - API calls only in `/src/services/[feature].ts`
   - Hooks consolidated per feature in `/src/modules/[feature]/hooks/`
   - 1-2 hook files max, not per-hook

## When Unsure

Mirror an existing reference feature instead of inventing a new pattern:
- `src/modules/master-user/` — forms, filtering, CRUD
- `src/modules/receiving-unit/` — complex forms with nested line items

Refer to `CLAUDE.md` for the complete ruleset including code examples.
