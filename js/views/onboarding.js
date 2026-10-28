// Onboarding questions (breadboard): language, experience level and weekly goal. Can be skipped.
import { getAll, update } from '../data.js';
import { go } from '../router.js';
import { esc, on } from '../utils.js';

let offs = [];

export async function render(el, { user, query }) {
  const questions = await getAll('onboarding');
  const next = query.get('next') || '/';

  const fieldsets = questions.map((q) => `
    <fieldset class="no-border no-padding">
      <legend><h6 class="small">${esc(q.question)}</h6></legend>
      <nav class="vertical">
        ${q.options.map((o) => `
          <label class="radio">
            <input type="radio" name="${esc(q.id)}" value="${esc(o.value)}" required ${String(user[q.id]) === o.value && user.onboarded ? 'checked' : ''}>
            <span>${esc(o.label)}</span>
          </label>`).join('')}
      </nav>
      <p class="error-text small-text no-margin" data-error="${esc(q.id)}" role="alert" hidden>Choose an answer to continue.</p>
    </fieldset>`).join('<hr class="medium">');

  el.innerHTML = `
    <nav class="no-margin">
      <div class="max"></div>
      <a href="#${esc(next)}" class="button transparent">${next === '/' ? 'Skip' : 'Cancel'}</a>
    </nav>
    <div class="row">
      <img src="assets/frogy.svg" alt="" class="frogy small">
      <div class="max">
        <h4 class="no-margin">Hi ${esc(user.name)}, I'm Frogy!</h4>
        <p class="no-margin">Three quick questions so I can pick the right exercises.</p>
      </div>
    </div>
    <form id="onboarding-form" novalidate>
      <article class="round">${fieldsets}</article>
      <button type="submit" class="large primary responsive">Continue</button>
    </form>
  `;

  offs = [on(el, 'submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    // All three questions must be answered before continuing (Skip stays available at the top).
    const missing = questions.filter((q) => !data.get(q.id));
    questions.forEach((q) => { el.querySelector(`[data-error="${q.id}"]`).hidden = !missing.includes(q); });
    if (missing.length) {
      el.querySelector(`[data-error="${missing[0].id}"]`).scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    const changes = { onboarded: true };
    questions.forEach((q) => {
      const value = data.get(q.id);
      if (value) changes[q.id] = q.id === 'goal' ? Number(value) : value;
    });
    await update('users', user.id, changes);
    go(next);
  })];
}

export function destroy() {
  offs.forEach((off) => off());
}
