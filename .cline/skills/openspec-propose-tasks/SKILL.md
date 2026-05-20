---
name: openspec-propose-tasks
description: Propose a new change - create tasks directly without spec/design/proposal. Use when user wants quick task creation without full proposal flow.
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
---

I'll read CLAUDE.MD as context first

Propose a new change - create tasks directly without spec/design/proposal.

IMPORTANT:
- This command is ONLY for planning and task creation.
- DO NOT implement code changes.
- DO NOT modify application source files.
- DO NOT refactor existing code.
- ONLY create/update planning artifacts inside `openspec/changes/<name>/`.
- Implementation MUST happen only when the user runs `/opsx:apply`.

I'll create a change with just tasks.md file, ready for implementation planning.

When ready to implement, run /opsx:apply

---

**Input**: The argument after `/opsx:propose-tasks` is the change name (kebab-case), OR a description of what you want to build.

## Steps

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user login" → `add-user-login`).

   IMPORTANT:
   - Do NOT proceed without understanding the requested change.
   - Do NOT start implementation during clarification.

2. **Check for existing change**

   If `openspec/changes/<name>` already exists:
   - Ask whether to continue the existing change or create a new one.
   - Do NOT overwrite existing tasks automatically.

3. **Create the change directory with task-only schema**

   ```bash
   openspec new change "<name>" --schema task-only
   ```

   This creates a change at `openspec/changes/<name>/` with task-only schema.

4. **Get tasks artifact instructions**

   ```bash
   openspec instructions tasks --change "<name>" --json
   ```

   Parse the JSON to get:
   - `instruction`
   - `template`

5. **Create tasks.md directly**

   Use the **Write** tool to create:

   `openspec/changes/<name>/tasks.md`

   Follow the provided template.

   IMPORTANT:
   - Tasks should be implementation-oriented but NOT implemented.
   - Break work into clear actionable steps.
   - Reference files/components that MAY need changes, but do NOT edit them.
   - Do NOT generate code unless explicitly requested.
   - Do NOT run implementation commands.

6. **Show final status**

   ```bash
   openspec status --change "<name>"
   ```

## Output

After completing the task, summarize:
- Change name
- Change location
- "Tasks created! Ready for implementation."
- "Run `/opsx:apply` to start implementing."

## Guardrails

- Never modify files outside `openspec/changes/<name>/`
- Never implement features during `/opsx:propose-tasks`
- Never create source code changes
- Never run build/migration/test commands unless explicitly requested
- If implementation is requested, instruct the user to run `/opsx:apply`
- Keep tasks focused, actionable, and implementation-ready
