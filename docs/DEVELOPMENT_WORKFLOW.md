# Development Workflow (OpenSpec)

Business describes features → Tech implements with OpenSpec.

## 3 Phases

1. **Requirements** (Business): Fill `REQUIREMENTS_TEMPLATE.md` sections 1-3, share with tech.
2. **Tech Design**: Run `/openspec-propose` → review `proposal.md` / `design.md` / `specs/` / `tasks.md` → `/opsx:apply` to implement, mark tasks done as you go.
3. **Review & Deploy**: QA → code review → deploy → `/opsx:archive`.

## Commands

```bash
/openspec-propose                              # generate all artifacts
/opsx:apply <feature-name>                     # implement tasks
openspec status --change "<feature-name>"      # progress
```

## Requirements → Code

- Frontend interactions → `src/modules/<feature>/components/`
- API → `src/services/<feature>.ts`
- Integration → `src/modules/<feature>/hooks/`

## Task Rules

Tasks 1-13 auto-generated (setup, data, UI, CRUD, filters, validation, testing, review, backend integration).
Task 14 (docs/deploy) skipped — handled per team/sprint.

## Feature Architecture

```
src/
├── services/<feature>.ts                      # API + mock data + types
└── modules/<feature>/
    ├── <Feature>Screen.tsx                    # main page
    ├── components/                            # feature UI + index.ts
    └── hooks/use<Feature>.ts                  # 1-2 files, consolidated
```

Simple feature: 1 hooks file. Complex (list + detail): 2 files max.

**Rules:**
1. API calls only in `/src/services/`
2. Hooks consolidated (not per-operation)
3. Use existing `/src/components/ui/` — never custom
4. Components export components only (Fast Refresh)
5. HTML mockups in an FSD are reference only — rebuild the screen with `@/components/ui/*` and project patterns. Never paste raw HTML/CSS into the codebase.
6. All date/time utilities use Day.js (`dayjs`) — never `new Date()`, `Date.now()`, or native `Date` methods in feature code.
7. Don't use cards or borders to group form sections / tab panels / field clusters — use headings + spacing (`space-y-*`, `gap-*`). Cards/borders are only for separate entities (record lists, widgets).
8. Forms with 2+ tabs split each tab into `modules/<feature>/components/tabs/<TabName>Tab.tsx`. Orchestrator only does modal + RHF + tab routing. Tabs use `useFormContext` and own their `<TabsContent>`.

## Files

| File | Purpose |
|------|---------|
| `REQUIREMENTS_TEMPLATE.md` / `REQUIREMENTS_EXAMPLE.md` | Business fills / reference |
| `openspec/config.yaml` | Tech stack + task rules |
| `openspec/changes/*/{proposal,design,tasks}.md` | Why / how / steps |
| `openspec/changes/*/specs/*.md` | Requirements, scenarios |

## FAQ

- **Why consolidated hooks?** Prevents file proliferation.
- **Why skip Task 14?** Docs/deploy vary by team.
- **New feature structure?** Copy `master-cabang` or `master-service`.
- **When real API?** Task 13. Until then, mock data + `// TODO` markers.
