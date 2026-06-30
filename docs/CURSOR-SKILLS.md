# Cursor Skills Guide — NIP Reality

## Talking to Jimmy (non-developer friendly)

You do **not** need to know React. Jimmy does the whole job.

**Good prompts:**

```
Jimmy, build the home page from this Figma screenshot.
```

```
Jimmy, add a contact page with name, email, message fields.
```

```
Jimmy, make the header match the design — here's the image.
```

Jimmy will only ask plain questions if something is missing (Figma, page name, button text). He will **not** ask about React, components, or npm.

---

How to use, invoke, and extend skills for React + Figma → code in this project.

## What are Cursor skills?

Skills are markdown instruction files (`SKILL.md`) that teach the AI agent **how to work on your project**. They live in:

| Location | Path | Scope |
|----------|------|-------|
| **Project** (this repo) | `.cursor/skills/` | Team shares via git |
| **Personal** | `C:\Users\<you>\.cursor\skills\` | All your projects |

**There is no npm install for skills.** You create folders with `SKILL.md` — Cursor discovers them automatically.

Do **not** put skills in `~/.cursor/skills-cursor/` — that is reserved for Cursor built-ins.

## Skills installed in this project

```
.cursor/skills/
├── figma-to-frontend/          # Figma → reusable components + pages
│   ├── SKILL.md
│   ├── component-library.md
│   └── examples.md
├── figma-to-react-components/  # Exact typography + token mapping from Figma MCP
│   ├── SKILL.md
│   ├── nip-typography-map.md   # Figma px ↔ code variant table
│   ├── references/
│   └── rules/
├── figma-developer/              # Figma REST API token sync (npm run figma:sync-tokens)
│   ├── SKILL.md
│   └── references/
├── react-patterns/               # React reuse, ui/, sections/
├── nextjs-app-router/            # Routes, SSR, API
└── nip-architecture/             # Structure, backend API, editable blocks
```

Plus **rules** in `.cursor/rules/` (always auto-attached) and **AGENTS.md** at the project root.

## How to invoke a skill in chat

### Method 1 — Name it in your prompt (recommended)

```
Use the figma-to-frontend skill.

Build the hero section from this Figma screenshot.
Extract Button and Container to components/ui/ for reuse.
```

```
Use react-patterns and figma-to-frontend.

Refactor this page to use shared Card and HeroSection components.
```

### Method 2 — @ mention files

Attach Figma screenshot or link, then:

```
@AGENTS.md Build this design following Jimmy workflow.
```

### Method 3 — Rules auto-apply

`.cursor/rules/project-context.mdc` has `alwaysApply: true` — Jimmy persona and doc links load every chat in this workspace.

File-specific rules load when you edit matching files (e.g. `*.tsx` → react-components rule).

## Making skills more powerful

### 1. Write a strong `description`

The agent uses description to decide when to apply a skill. Include **WHAT** + **WHEN** + **trigger words**:

```yaml
description: Converts Figma designs into reusable React components...
Use for Figma handoff, figma-to-code, component extraction...
```

### 2. Use progressive disclosure

Keep `SKILL.md` under ~500 lines. Put details in sibling files:

```
figma-to-frontend/
├── SKILL.md              # workflow + checklist
├── component-library.md  # reuse rules (agent reads when needed)
└── examples.md           # copy-paste examples
```

Link from SKILL.md: `See [component-library.md](./component-library.md)`

### 3. Auto-invoke vs manual

| Setting | Behavior |
|---------|----------|
| Default (no flag) | Agent may apply when description matches |
| `disable-model-invocation: true` | Only when user names the skill |

For Figma/React work, we leave auto-invocation **enabled** so trigger words in description work.

### 4. Pair skills with rules

| Layer | Purpose |
|-------|---------|
| **Rules** (`.cursor/rules/*.mdc`) | Always-on conventions |
| **Skills** (`.cursor/skills/`) | Deep workflows (Figma, architecture) |
| **AGENTS.md** | Entry point + doc index |

## Install personal skills (optional)

For skills you want on **all** projects:

```powershell
mkdir C:\Users\<you>\.cursor\skills\my-skill
# Create SKILL.md with frontmatter
```

Project skills in this repo take precedence for NIP Reality when both exist.

## Recommended prompts for this project

### New page from Figma

```
Use figma-to-frontend skill.

Figma: [attach screenshot or describe sections]
Route: /about
1. Extract ui/Button, ui/Container, ui/Card
2. Build sections/HeroSection, sections/TeamSection
3. Compose app/about/page.tsx
4. npm run check
```

### Reuse existing components

```
Use react-patterns skill.

Add a PricingSection in components/sections/ reusing Card and Button from components/ui/.
Use on home page and pricing page.
```

### Editable CMS page

```
Use nip-architecture and figma-to-frontend.

Build /services page from Figma. Mark hero title and intro as EditableText blocks.
See docs/EDITABLE-BLOCKS.md.
```

## Adding a new skill

1. Create folder: `.cursor/skills/your-skill-name/`
2. Add `SKILL.md`:

```markdown
---
name: your-skill-name
description: Third-person description with trigger terms. Use when...
---

# Your Skill

## Steps
...
```

3. Commit to git so the team gets it
4. Test: start new chat, mention skill name + task

## Figma integrations in Cursor

| Approach | How |
|----------|-----|
| **Screenshot** | Paste image in chat + figma-to-frontend prompt |
| **Figma MCP** | If enabled in Cursor Settings → MCP, agent can read Figma files directly |
| **Dev Mode inspect** | Copy CSS/spacing values into prompt |

No separate "Figma skill install" — our `figma-to-frontend` skill covers the workflow; attach design context in chat.

## React — no separate install

React patterns are covered by:

- `react-patterns` skill
- `react-components.mdc` rule (auto on `*.tsx`)
- `nextjs-app-router` skill

No `@react/skill` package exists — skills are markdown files you own.

## Checklist: powerful project setup

- [x] `.cursor/rules/` with `alwaysApply` project context
- [x] `.cursor/skills/` for Figma, React, Next.js, architecture
- [x] `AGENTS.md` pointing to docs
- [x] `docs/JIMMY-WORKFLOW.md` for human + agent workflow
- [ ] Add Figma MCP in Cursor if you use Figma URLs (Settings → MCP)
- [ ] Add `clsx` + `tailwind-merge` when building `components/ui/` (`npm install clsx tailwind-merge`)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Agent ignores skill | Name it explicitly: "Use figma-to-frontend skill" |
| Skill not listed | Restart Cursor; confirm file is `.cursor/skills/*/SKILL.md` |
| Wrong conventions | Check `alwaysApply` rules in `.cursor/rules/` |
| Too much context | Shorten SKILL.md; move detail to reference.md |
