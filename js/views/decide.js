// Screen 6 · Final decision: check your comments, approve or request changes, submit.
// Feedback is only shown after submitting (attempt → feedback → comparison).
import { getLesson, getDraft, update } from '../data.js';
import { go } from '../router.js';
import { grade } from '../grading.js';
import { esc, backRow, on, today, COMMENT_TYPES } from '../utils.js';
import '../components/app-stepper.js';

let offs = [];

export async function render(el, { id, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson } = found;
  const draft = await getDraft(user.id, lesson.id);
  if (!draft) { location.hash = `#/lessons/${lesson.id}/context`; return; }

  const comments = [...draft.comments].sort((a, b) => a.line - b.line);
  // Leaving comments suggests something needs to change, so Request changes is preselected.
  // The student can still switch to Approve (e.g. only small remarks).
  const selected = draft.decision || (comments.length ? 'request_changes' : '');

  el.innerHTML = `
    ${backRow(`#/lessons/${lesson.id}/review`, 'Back to the code')}
    <app-stepper step="decide"></app-stepper>

    <h5>Review summary</h5>
    ${comments.length ? comments.map((c) => `
      <article class="round border no-elevate">
        <nav>
          <span class="chip small no-border surface-variant">Line ${c.line}</span>
          ${c.type ? `<span class="chip small no-border ${COMMENT_TYPES[c.type].color}">${COMMENT_TYPES[c.type].label}</span>` : ''}
          <div class="max"></div>
          <a href="#/lessons/${esc(lesson.id)}/review?edit=${esc(c.id)}" class="button transparent small"><i>edit</i><span>Edit</span></a>
        </nav>
        <p class="no-margin">${esc(c.text)}</p>
      </article>`).join('') : `
      <article class="round tertiary-container no-elevate">
        <p class="no-margin">You did not leave any comments. You can still submit, or <a class="bold underline" href="#/lessons/${esc(lesson.id)}/review">go back to the code</a>.</p>
      </article>`}

    <form id="decision-form" novalidate>
      <h5>What is your decision?</h5>
      <article class="round no-elevate">
        <nav class="vertical">
          <label class="radio">
            <input type="radio" name="decision" value="approve" required aria-describedby="approve-help" ${selected === 'approve' ? 'checked' : ''}>
            <span class="bold">Approve</span>
          </label>
          <p id="approve-help" class="small-text no-margin left-padding">The code is ready to merge.</p>
          <hr>
          <label class="radio">
            <input type="radio" name="decision" value="request_changes" required aria-describedby="changes-help" ${selected === 'request_changes' ? 'checked' : ''}>
            <span class="bold">Request changes</span>
          </label>
          <p id="changes-help" class="small-text no-margin left-padding">Something must be fixed before it can be merged.</p>
        </nav>
      </article>
      <p id="decision-error" class="error-text" role="alert" hidden>Choose Approve or Request changes first.</p>

      <div class="field label border round">
        <textarea id="explanation" name="explanation" rows="3" placeholder=" ">${esc(draft.explanation)}</textarea>
        <label for="explanation">Add a short explanation (optional)</label>
      </div>

      <button type="submit" class="large primary responsive"><span>Submit review</span><i>send</i></button>
    </form>
  `;

  offs = [on(el, 'submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const decision = new FormData(form).get('decision');
    el.querySelector('#decision-error').hidden = Boolean(decision);
    if (!decision) return;

    const submitted = { ...draft, decision, explanation: form.explanation.value.trim() };
    const result = grade(lesson.exercise, submitted);
    await update('reviews', draft.id, {
      decision: submitted.decision,
      explanation: submitted.explanation,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      result,
    });

    const isNewDay = user.lastActive !== today();
    await update('users', user.id, {
      points: user.points + result.points,
      streak: isNewDay ? user.streak + 1 : user.streak,
      lastActive: today(),
    });
    go(`/lessons/${lesson.id}/feedback`);
  })];
}

export function destroy() {
  offs.forEach((off) => off());
}
