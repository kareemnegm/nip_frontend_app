# How to Work With Jimmy

Jimmy is your **senior frontend developer** for NIP Reality. You describe what you want; Jimmy writes all the React/Next.js code. **You do not need to know React.**

Save this file — you can come back to it anytime, even if chat history is cleared.

---

## What Jimmy does

| Jimmy handles | You provide |
|---------------|-------------|
| React, Next.js, TypeScript, Tailwind | What page or feature you want |
| Figma → working UI | Figma screenshot, link, or description |
| Components, layout, mobile/desktop | Copy/text if not shown in design |
| Connecting to backend API (when ready) | Backend URL when going live |
| Running tests and fixing errors | Feedback: "make the button bigger", "wrong color" |

Jimmy **never** asks you technical questions like "Server Component or client?" or "Which npm package?" — he decides and builds.

---

## How to start a task

Open Cursor in the **NIP-Reality** workspace and write in plain English. Start with **"Jimmy,"** so the agent uses the right persona.

### Examples

**Build a page from Figma:**
```
Jimmy, build the home page from this Figma screenshot.
[attach image]
```

**Add a new page:**
```
Jimmy, create a Contact Us page with name, email, message fields and a submit button.
```

**Change something:**
```
Jimmy, the header background should be dark blue like in Figma. Update it.
```

**Reuse a design:**
```
Jimmy, build the About page using the same header and footer as the home page.
```

**When backend is ready:**
```
Jimmy, load the team list from the backend API at http://localhost:8000/api/v1/team
```

---

## What Jimmy might ask you (only if stuck)

Jimmy asks **at most 1–2 short questions**, in plain English:

| Question | When |
|----------|------|
| "Can you share the Figma link or screenshot?" | Design was not attached |
| "Which page should I build first?" | Multiple pages, order unclear |
| "What should this button say?" | Text missing from design |
| "What is the backend API URL?" | Connecting real data |

If you don't know, Jimmy uses placeholders and tells you what he assumed.

---

## After Jimmy finishes

Jimmy should tell you:

1. **What was built** (in simple words)
2. **Where to preview** — usually http://localhost:3000 (or another port if 3000 is busy)
3. **Anything you still need to provide** (optional assets, copy, API URL)

### Run the site yourself

```powershell
npm run dev
```

Open the URL shown in the terminal (often http://localhost:3000).

### If something looks wrong

Describe what you see vs what you want — no code needed:

```
Jimmy, on mobile the menu doesn't open. Fix it.
```

```
Jimmy, the hero text is too small compared to Figma. Match the design.
```

---

## What you don't need to do

- Learn React or Next.js
- Choose folders, files, or libraries
- Run `npm install` unless Jimmy asks (he usually runs commands himself)
- Mention skills by name — Jimmy uses them automatically
- Edit `AGENTS.md` or `.cursor/rules/` unless you want to change how Jimmy works

---

## Project locations (for your reference)

| Item | Path |
|------|------|
| Jimmy agent rules | `AGENTS.md` |
| Architecture (technical) | `docs/ARCHITECTURE.md` |
| Editable page sections | `docs/EDITABLE-BLOCKS.md` |
| Cursor skills guide | `docs/CURSOR-SKILLS.md` |

---

## Quick checklist for a new page

1. Share Figma screenshot or describe the page
2. Say: `Jimmy, build [page name] from this design`
3. Wait for Jimmy to implement and run checks
4. Open http://localhost:3000 (or URL Jimmy gives you)
5. Reply with visual feedback if something doesn't match

---

## Tips for best results

- **Attach Figma screenshots** — clearer than long text descriptions
- **One page or section at a time** — easier to review
- **Say if content should be editable later** — Jimmy can plan CMS blocks for admin editing
- **Mention reference site** if useful: "layout like nour website hero section"

---

## Jimmy's stack (FYI only — you don't manage this)

- Next.js 16, React 19, TypeScript, Tailwind
- Data from **your backend API** (not a database inside the frontend)
- Figma designs → reusable components in `components/ui/` and `components/sections/`

---

*Last updated: Phase 2 — Jimmy full ownership mode*
