# Project Rules — Source of Truth

**REQUIRED:** Read and strictly follow the rules in `CLAUDE.md` at the project root before generating any code.

This project uses **CLAUDE.md** as the single source of truth for all AI agents (Claude, Cline, Cursor, etc.).

**Rule Files:**
- `docs/rules/fundamentals.md` — DO NOT, feature structure, code style
- `docs/rules/components.md` — UI components, modals, loading
- `docs/rules/patterns.md` — Forms, services, data fetching

## Critical Rules to Verify Before Writing Code

1. **DO NOT section** in `docs/rules/fundamentals.md` — common AI-generated mistakes
2. **Required UI components** (no custom alternatives):
   - `AppModal` for forms/details — never custom `fixed inset-0` divs
   - `DataTable` from `@/components/ui/table` — never manual `<table>` markup
   - `SelectField`, `DatePicker`, `InputField` from `@/components/ui/*`
3. **Form patterns** in `docs/rules/patterns.md`:
   - React Hook Form + Zod for all forms
   - `useFormContext` for multi-tab forms
   - `isSaved` flag for inline row editing
4. **Feature structure** in `docs/rules/fundamentals.md`:
   - API calls only in `/src/services/[feature].ts`
   - Hooks consolidated per feature
   - 1-2 hook files max

## When Unsure

Mirror an existing reference feature:
- `src/modules/master-user/` — forms, filtering, CRUD
- `src/modules/receiving-unit/` — complex forms with nested line items
