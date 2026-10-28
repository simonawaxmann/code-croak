// Screen 3 · Exercise context: task, requirements and an example BEFORE the code.
// Iteration 2: clearly labelled, and no review stepper yet (it appears once reviewing starts).
import { getLesson, getOrCreateDraft } from '../data.js';
import { go } from '../router.js';
import { esc, backRow, on } from '../utils.js';

let offs = [];

export async function render(el, { id, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson } = found;
  const ex = lesson.exercise;

  el.innerHTML = `
    ${backRow(`#/lessons/${lesson.id}`, lesson.title)}

    <h4>Exercise context</h4>
    <p>Read this first. You will compare the code with these requirements.</p>

    <article class="round">
      <h6 class="row"><i class="secondary-text">description</i><span>Task</span></h6>
      <p>${esc(ex.task)}</p>
    </article>

    <article class="round">
      <h6 class="row"><i class="secondary-text">checklist</i><span>Requirements</span></h6>
      <ol class="list no-space">
        ${ex.requirements.map((r, i) => `
          <li>
            <span class="button circle small secondary-container" aria-hidden="true">${i + 1}</span>
            <span class="max">${esc(r)}</span>
          </li>`).join('')}
      </ol>
    </article>

    <article class="round">
      <h6 class="row"><i class="secondary-text">swap_horiz</i><span>Example input / output</span></h6>
      <div class="grid no-space">
        <div class="s3 bold">Input</div><div class="s9"><code class="inline">${esc(ex.example.input)}</code></div>
        <div class="s3 bold">Output</div><div class="s9"><code class="inline">${esc(ex.example.output)}</code></div>
      </div>
    </article>

    <button type="button" class="large primary responsive" data-action="start">
      <span>Start reviewing</span><i>arrow_forward</i>
    </button>
  `;

  offs = [on(el, 'click', async (event) => {
    if (!event.target.closest('[data-action="start"]')) return;
    await getOrCreateDraft(user.id, lesson.id);
    go(`/lessons/${lesson.id}/review`);
  })];
}

export function destroy() {
  offs.forEach((off) => off());
}
