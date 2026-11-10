# Shiran Revivo — Portfolio

Static retro-pixel portfolio (HTML/CSS/JS, no build). Talk to Shiran in Hebrew; site copy is English.

## THE BIBLE — brand book + design system
Skills: `.claude/skills/brand-bible/SKILL.md` (read before any visual work) and `.claude/skills/bible-update/SKILL.md` (sync checklist when something new is approved). Details below.

`design-system/brand-book.html` and `design-system/design-system.html` are the source of truth for this project's look, voice and components (summary: `context/07-brand-book.md`).
- Before ANY visual work (site UI, new page/component, graphic, social post, logo use), read the relevant section of these two files and follow them. Don't invent colours, fonts, shadows, corners, icon styles or tone.
- Only tokens / assets from `design-system/` (`tokens.css`, `tokens.json`, `assets/`). Social posts start from the templates in brand-book.html.
- If something new is needed that the bible doesn't cover, ask Shiran, then add it to the bible (both HTML files where relevant + `context/07-brand-book.md`) in the same change.
- If the site changes a value/component, update the bible too (and run `node design-system/tools/build-assets.mjs`).
- **Keep the bible growing.** Whenever Shiran approves something new (icon, component, pattern, layout, colour, copy rule, social format — e.g. the case-study page), update the bible in the SAME turn, before wrap-up:
  - icon → `PX` in main.js + `ICONS` list in brand-book.html + `USE` map in design-system.html, then `node design-system/tools/build-assets.mjs`
  - component / pattern → live specimen + spec in design-system.html (Components) and `context/02-design-system.md`
  - visual language / tone / social → brand-book.html, then `bash design-system/tools/export-social.sh` if a template changed
  - always → `context/07-brand-book.md` (+ `04-decisions.md` for the approval), and bump the version/date on both HTML covers
  - Say in the reply which bible files were updated.
- The site does NOT link to or load these files. Keep them separate unless Shiran asks.

**New UX/UI case study** (Shiran sends a project deck/folder): follow `.claude/skills/case-study/SKILL.md`. These are her approved rules for every case study; `case-myra.html` is the template.

Full project context lives in `context/`. Read it before making changes:
- @context/01-brief.md
- @context/02-design-system.md
- @context/03-architecture.md
- @context/04-decisions.md
- @context/05-todo.md
- @context/06-workflow.md
- @context/07-brand-book.md

Rules:
- Respect `context/04-decisions.md`. Don't undo Shiran's explicit requests.
- After EVERY action (code, docs, setup, anything), end the reply with a one-click bash block: `open /Users/shiranrevivo/Desktop/portfolio/index.html` (the site itself, not a folder).
- When something changes (a decision, a finished TODO, a new file), update the relevant file in `context/`.
