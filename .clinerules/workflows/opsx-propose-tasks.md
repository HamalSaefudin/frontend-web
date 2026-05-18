# OPSX: Propose Tasks

Propose a new change - create tasks directly without spec/design/proposal

Propose a new change - create tasks directly without spec/design/proposal.

I'll create a change with just tasks.md file, ready for implementation.

When ready to implement, run `/opsx:apply`

---

**Input**: The argument after `/opsx:propose-tasks` is the change name (kebab-case), OR a description of what you want to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user login" → `add-user-login`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory with task-only schema**
   ```bash
   openspec new change "<name>" --schema task-only
   ```
   This creates a change at `openspec/changes/<name>/` with task-only schema.

3. **Get tasks artifact instructions**
   ```bash
   openspec instructions tasks --change "<name>" --json
   ```
   Parse the JSON to get:
   - `instruction`: How to create the tasks
   - `template`: The structure to use

4. **Create tasks.md directly**

   Use the **Write** tool to create `openspec/changes/<name>/tasks.md` following the template.

   Since there are no dependencies, tasks is ready immediately.

5. **Show final status**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After completing the task, summarize:
- Change name and location
- "Tasks created! Ready for implementation."
- Prompt: "Run `/opsx:apply` to start implementing."

**Guardrails**
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Keep tasks focused and actionable