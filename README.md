# Code Croak · Hi-Fi prototype

Clickable high-fidelity prototype of **Code Croak**, an interactive code-review learning app for ICT students. Built from the low-fi wireframes (iteration 2) with the iteration 3 improvement added.

- `AGENTS.md` — technical rules (stack, structure, routing, data).
- `DESIGN.md` — brand and UI rules (style guide → beer.css tokens and components).
- `assets/style-guide.png` — the visual style guide.
- `DESIGN_LOG.md` — design log: what I designed and decided, and what the AI added (screenshots in `design-log/`).

## Run it

The app uses ES modules and loads `data/*.json` with `fetch()`. Browsers block both when you open `index.html` straight from disk (`file://`), so serve the folder with any static server:

- **VS Code:** install the *Live Server* extension, then click **Go Live** (bottom right) or right-click `index.html` → *Open with Live Server*.
- **Terminal:** `npx serve .` and open the URL it prints.

Demo account: `demo@codecroak.app` / `frogy123` (also shown on the login screen), or tap **Try for free**.
Reset everything via **Profile → Reset demo data**.

## Flows

| Flow | Route |
|---|---|
| Log in / Try for free / Create account | `#/login`, `#/signup` |
| Onboarding questions (skippable) | `#/onboarding` |
| 1 · Home | `#/` |
| Learn: study chapters (reading only) | `#/learn`, `#/learn/:id` |
| 2 · Lesson overview | `#/lessons/:id` |
| 3 · Exercise context | `#/lessons/:id/context` |
| 4 + 5 · Review code, add comment (bottom sheet), hint | `#/lessons/:id/review` |
| 6 · Final decision | `#/lessons/:id/decide` |
| 7 · Feedback overview | `#/lessons/:id/feedback` |
| 8 · Explanation | `#/lessons/:id/explanation/:issue` |
| 9 · Expert example | `#/lessons/:id/expert` |
| **NEW · Lesson complete** (iteration 3) | `#/lessons/:id/complete` |
| 10 · Progress + review history | `#/progress` |
| 11 · Profile (help, reset, log out) | `#/profile` |
| Settings (learning preferences) | `#/settings` |

Three lessons are included: Functions (logic + edge case), Clean code (naming + magic number) and Testing (wrong expectation + missing test).

## Changes per iteration

**Kept from iteration 2:** labelled Hint, separate Exercise context, stepper only while reviewing, explicit *Back to Feedback*.

**Iteration 3:** after the feedback, a *Lesson complete* screen summarises issues found, points and streak, shows total progress and offers an optional **View progress** action. A lesson only counts as completed (and earns points) when every issue is found and the decision is right; otherwise the student is asked to redo it.

**Not added:** dark mode. The app only has the light theme. It will be asked about in the iteration 3 test.
