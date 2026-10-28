---
name: code-croak-design
description: "Brand and UI rules for Code Croak, an interactive code-review learning app for ICT students. Use when designing, building or changing any screen of the Code Croak prototype: colours, typography, logo and mascot, icons, layout and components."
---

# Code Croak · DESIGN.md

Act as the designer of Code Croak. Build screens that feel like **a friendly pond, not an exam hall**: playful like Duolingo, but grounded in real pull-request reviews. Students should feel safe to make mistakes and learn from them.

The visual source of truth is the style guide: [`assets/style-guide.png`](assets/style-guide.png).
The code source of truth is beer.css (Material Design 3) plus [`css/app.css`](css/app.css). **Design tokens are CSS variables**: every colour value is defined once, in `css/app.css` (`:root`), on the beer.css theme variables (`--primary`, `--surface`, …). This file only names the variables and says what they are for; it never repeats the values.

**Use the public API below.** Do not invent colours, fonts, spacing or classes, and do not read the implementation of `css/app.css` or beer.css into context. If something is missing here, ask before adding CSS.

---

## 1. Brand

| | |
|---|---|
| Name | Code Croak |
| Mascot | **Frogy** — a friendly frog with a graduation cap and a magnifying glass |
| Personality | Encouraging · Playful · Clear · Honest feedback · Developer-real |
| Tone of voice | Short sentences, second person ("you"), positive first. Mistakes are "things to learn", never failures. Talk about the code, not the person. |

## 2. Logo & mascot

| Asset | File | Use |
|---|---|---|
| Logo (frog head with `</>` mouth and cap) | `assets/logo.svg` | Top bar, favicon, app icon. One version, on a light background. |
| Wordmark | `<h6 class="wordmark">Code Croak</h6>` | Fredoka Bold in Lily (`--secondary`), next to the logo with a small gap. |
| Frogy (full body) | `assets/frogy.svg` | Welcome, onboarding, hints, feedback banner, lesson complete. |

- Mascot sizes: `img.frogy.small` (3.5rem), `img.frogy` (8rem), `img.frogy.large` (11rem).
- Always give Frogy an `alt` text, or `alt=""` when it is decorative next to a heading.
- Do not recolour, stretch or redraw the logo or mascot.

## 3. Colour palette (60–30–10)

60% light background · 30% greens (from the moodboard) · 10% yellow accent. Berry (red) is **only** used for missed issues and errors. The palette has 12 colours and the app uses nothing else. Values live in `css/app.css`; use the variables and beer.css helpers below.

**Main colours**

| Name | CSS variable | beer.css helper | Used for |
|---|---|---|---|
| Mist | `--background`, `--surface` | `background`, `surface` | App background (60%), text on dark banners (`--inverse-on-surface`) |
| Leaf | `--primary` | `primary`, `primary-text` | Main buttons, progress bars, selected states, code keywords |
| Lily | `--secondary` | `secondary`, `secondary-text` | App name, icons, links, active tab text, hover on main buttons |
| Pond | `--on-surface`, `--inverse-surface` | `inverse-surface` | All text, code blocks, dark banners |
| Sun | `--tertiary` | `tertiary`, `tertiary-text` | Accent (10%): hint, streak, points, code strings |
| Berry | `--error` | `error`, `error-text` | Missed issues, errors, destructive actions |

**Supporting colours**

| Name | CSS variable | beer.css helper | Used for |
|---|---|---|---|
| White | `--surface-container-*` | `<article>`, `<dialog>` | Cards, dialogs, tab bar |
| Mint | `--primary-container`, `--secondary-container` | `primary-container` | Correctly identified, icon circles, open requirements, hover on cards and outline buttons |
| Light sun | `--tertiary-container` | `tertiary-container` | Hint chip, unnecessary comment |
| Light berry | `--error-container` | `error-container` | Missed issue |
| Moss | `--on-surface-variant`, `--outline` | — | Secondary text, field borders |
| Line | `--outline-variant` | `border` | Borders, dividers |

Code-line highlights (selected, found, missed) are see-through tints of Sun, Leaf and Berry, made with `color-mix()` on the variables. They are not extra colours.

### Feedback colours — always icon + label, never colour alone

| Meaning | Container helper | Icon |
|---|---|---|
| Correctly identified | `primary-container` (Mint) | `check_circle` in Leaf |
| Missed issue | `error-container` (Light berry) | `cancel` in Berry |
| Unnecessary comment / hint | `tertiary-container` (Light sun) | `error` / `lightbulb` in Sun |

Text on the tinted containers is always Pond; the icon carries the colour.

Rules: never write colour values in HTML, JS or this file; only the variables and helpers above.

## 4. Typography

| Family | Weights | Used for |
|---|---|---|
| **Fredoka** | 500 · 600 · 700 | Headings `h1`–`h6`, buttons, chips, tab labels, numbers |
| **Nunito** | 400 · 600 · 700 · 800 | Body text, labels, feedback (beer.css `--font`) |
| **JetBrains Mono** | 400 · 700 | Code blocks, line numbers, inline code |

Fonts are self-hosted in `assets/fonts/` and applied by `css/app.css`; just use semantic HTML.

| Style | Element |
|---|---|
| Screen title | `<h4>` |
| Section title | `<h5>` |
| Card title | `<h6 class="small">` |
| Body | `<p>` |
| Overline label ("CONTINUE LEARNING") | `<p class="upper bold small-text">` |
| Caption | `class="small-text"` |
| Inline code | `<code class="inline">` |

## 5. Icons

- **Material Symbols Rounded** (bundled with beer.css): `<i>icon_name</i>`. Use only the 48 icons below (the same set as in the style guide). Ask before adding a new one, then add it here and to the style guide.
- In the screens, icons are outlined and coloured by meaning: navigation icons use their tab colour (Home and Profile = Leaf, Learn = Sun, Progress = Lily), streak and points use Sun (`tertiary-text`), all other icons Lily (`secondary-text`) or the text colour of their container.
- **Filled = selected or a result**, nothing else: the active tab and the feedback result icons (`<i class="fill …">`).
- Never put a Sun icon on a Light sun background (too little contrast); use a white card instead.

| Group | Icons |
|---|---|
| Navigation | `home` Home · `menu_book` Learn · `bar_chart` Progress · `person` Profile · `arrow_back` Back · `arrow_forward` Next · `chevron_right` Open · `expand_more` Expand |
| Motivation | `local_fire_department` Streak · `stars` Points · `flag` Goal · `bug_report` Issues found · `task_alt` Completed |
| Lessons | `code` Functions · `auto_fix_high` Clean code · `science` Testing · `assignment` Exercises · `schedule` Time · `signal_cellular_alt` Difficulty · `school` Expert · `replay` Try again |
| Reviewing | `description` Task · `checklist` Requirements · `swap_horiz` Input / output · `lightbulb` Hint · `search` Look for · `edit_note` How to write · `add_comment` Add comment · `chat` Comment · `edit` Edit · `delete` Delete · `send` Submit · `gavel` Decision |
| Feedback | `check_circle` Correct · `check` Found · `cancel` Missed · `error` Unnecessary · `rule` Partly right · `report` What is wrong · `priority_high` Why it matters · `auto_awesome` How to improve |
| Account | `settings` Settings · `tune` Preferences · `help` Help · `info` Info · `restart_alt` Reset · `logout` Log out · `close` Close |

## 6. Layout & spacing

- Design system: **Material Design 3 via beer.css**, cross-platform (not tied to iOS or Android).
- Mobile first: content is max `30rem` wide and centred, also on a laptop.
- App shell (in `index.html`): `header.fixed` top bar (logo + wordmark + `<app-stats>`), `main#app.responsive`, `nav.bottom` tab bar with Home · Learn · Progress · Profile.
- **Tab bar is bubbly:** each tab has a palette colour (Home = Leaf, Learn = Sun, Progress = Lily, Profile = Leaf). Icons are coloured, the active tab gets a filled icon in a coloured pill with a small 3D shadow, hover lifts the icon with a tinted background. Berry is not used here (errors only).
- Spacing: every block on a screen is 16px (1rem) below the previous one; main (large) buttons get 24px above them. This is automatic in `css/app.css`; only add beer.css margin helpers (`top-margin`, `no-margin`…) to override. 8px rhythm, minimum tap target 48px.
- Corners: cards and buttons use `round`.

## 7. Components

Use beer.css elements first. Code Croak adds three light-DOM web components and a few helper classes.

| Component | Markup |
|---|---|
| Primary button (one per screen, bottom) | `<button class="large primary responsive">` — chunky 3D shadow; hover turns Lily, press pushes it down |
| Secondary action (Add comment) | `<button class="large responsive" disabled>` grey until a line is selected, then the `secondary` class is added: Lily with white text, so it clearly invites the next step. Hover turns Pond |
| Outline button (Expert example, Try for free, Cancel) | `<button class="large border responsive">` — hover turns mint with a Leaf border |
| Card | `<article class="round">` (white). Feedback cards add a container helper + `no-elevate` |
| Dark banner | `<article class="inverse-surface round">` (Continue learning, feedback score) |
| Hint (secondary but labelled) | Full-width bar: `<button class="responsive large tertiary-container hint-bar"><i>lightbulb</i><span class="max">Need some help?</span><span class="chip small tertiary no-border">Hint</span></button>`, as in the wireframes |
| Comment type chips | `<button class="chip">` → selected adds `error-container` (Issue), `tertiary-container` (Suggestion) or `primary-container` (Good practice) |
| Bottom sheet (Add comment, Hint) | `<dialog class="bottom modal">` |
| Centre dialog (Help, Reset) | `<dialog class="modal">` |
| Decision | `<label class="radio"><input type="radio">…</label>` |
| Text input | `<div class="field label border round"><input placeholder=" "><label>…</label></div>` |
| Progress bar | `<progress class="thick" value="…" max="100">` |
| View switch (Explanation / Expert example) | `<nav class="group connected view-switch">` with two `a.button.max` (`left-round` / `right-round`). Selected = `primary`, other = `border`. Bordered rounded halves, as in the wireframes |
| Collapsible requirements | `<details class="requirements round padding"><summary>…<i class="chevron">expand_more</i></summary>` — opens mint with a Leaf border, chevron flips |
| Back row | `backRow(href, label)` from `js/utils.js` → "← Title" under the top bar. Arrow and text are **one link** (`.back-link`, min 48 px tall), so tapping the text works as well as the arrow |
| Streak + points | `<app-stats streak points>` |
| Review stepper | `<app-stepper step="select|comment|decide|feedback">` — **only during reviewing**, never on the exercise context |
| Code block | `<app-code selectable label start>` with properties `lines`, `marks`, `selected`; emits `line-select`. Line marks: `commented`, `found`, `missed`, `unnecessary` |

## 8. UX rules from user testing (keep these)

1. **Attempt first, then feedback, then compare.** The expert example is only reachable after submitting your own review.
2. **Exercise context comes before the code** and is a separate screen. The stepper appears once reviewing starts.
3. **Hint is optional but visible**: a full-width yellow bar with a small Hint button (as in the wireframes), opening Frogy's guidance (what to look for, how to write the comment) — never the answer.
4. **Explanation and Expert example show "← Back to Feedback" at the top only** (as in the wireframes), not Next/Continue and no duplicate button at the bottom.
5. **Feedback** shows three groups: correctly identified, missed, unnecessary — each with icon, label and colour, plus the code with marked lines.
6. **Lesson complete (iteration 3):** after feedback, show what the student achieved (issues found, points, streak), total progress and an optional **View progress** action. A lesson is only **passed** when every issue is found and the decision is right. Passed: "Lesson complete!", points, counts as completed, Next lesson. Not passed: "Almost there!", 0 points, not completed, **Redo lesson** is the main action, and the lesson stays as "Continue learning" on Home.
7. **Learn = study, Home = practise.** The Learn tab only holds reading material: chapters with learning objectives, short sections, an example and a key takeaway (content in `data/chapters.json`). Lessons are started from Home. While a student is in a lesson, the **Home** tab is active, not Learn.
8. One primary action per screen, at the bottom.
9. **Final decision:** when the student left at least one comment, **Request changes** is preselected. They can always switch to Approve. Without comments nothing is preselected.
10. **Back rows are one tap target.** The whole "← Back to Feedback" element (arrow and text) is clickable, not only the arrow.
11. **Onboarding needs all three answers.** Continue stays on the screen and shows "Choose an answer to continue." under every unanswered question. Skip at the top remains the only way to leave without answering.
12. **Every error has a message in plain language** next to the problem, never only a red field. Login: "Enter your email address.", "Enter a valid email address.", "Enter your password." and, for a wrong combination, "Email or password is not correct." The same goes for "Choose an answer to continue." (onboarding) and "Choose Approve or Request changes first." (decision).
13. **Long names must not be cut off.** Names wrap onto the next line (the guest account is called "Guest HiFi Prototype Test" to test this).

## 9. Accessibility

- Text contrast WCAG AA (4.5:1). Leaf is for fills only; text on Mist uses Pond or Lily.
- Every state uses icon + text, not colour alone.
- Code lines are keyboard reachable (`Tab`, `Enter`/`Space` to select).
- After each route change focus moves to the screen heading.
