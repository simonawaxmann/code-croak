// Screen 11 · Profile: streak, points, exercises + settings, help, reset demo data and log out.
import { getAll, getCompletedLessonIds, reset } from '../data.js';
import { logout } from '../auth.js';
import { go } from '../router.js';
import { esc, on, openDialog, closeDialog } from '../utils.js';

let offs = [];

export async function render(el, { user }) {
  const [lessons, completed, help] = await Promise.all([getAll('lessons'), getCompletedLessonIds(user.id), getAll('help')]);

  el.innerHTML = `
    <div class="row">
      <span class="button circle extra secondary" aria-hidden="true"><span class="large-text bold">${esc(user.name.charAt(0))}</span></span>
      <div class="max">
        <h4 class="no-margin">${esc(user.name)}</h4>
        <p class="no-margin">${esc(user.level)} · ${esc(user.language)}</p>
      </div>
    </div>

    <ul class="list border round surface-container top-margin">
      <li><i class="tertiary-text">local_fire_department</i><span class="max">Streak</span><b>${user.streak} days</b></li>
      <li><i class="tertiary-text">stars</i><span class="max">Points</span><b>${user.points}</b></li>
      <li><i class="secondary-text">task_alt</i><span class="max">Exercises completed</span><b>${completed.size}/${lessons.length}</b></li>
      <li><i class="secondary-text">flag</i><span class="max">Weekly goal</span><b>${user.goal} reviews</b></li>
    </ul>

    <ul class="list border round surface-container">
      <li><a href="#/settings" class="row max"><i>settings</i><span class="max">Settings</span><i>chevron_right</i></a></li>
      <li><a href="#/profile" class="row max" data-action="help"><i>help</i><span class="max">Help</span><i>chevron_right</i></a></li>
      <li><a href="#/profile" class="row max" data-action="reset"><i>restart_alt</i><span class="max">Reset demo data</span><i>chevron_right</i></a></li>
      <li><a href="#/profile" class="row max error-text" data-action="logout"><i>logout</i><span class="max">Log out</span></a></li>
    </ul>

    <dialog id="help-dialog" class="modal" aria-labelledby="help-title">
      <h5 id="help-title">How Code Croak works</h5>
      <ol>${help.sort((x, y) => x.order - y.order).map((h) => `<li>${esc(h.text)}</li>`).join('')}</ol>
      <nav class="right-align"><button type="button" class="primary" data-action="close-help">Got it</button></nav>
    </dialog>

    <dialog id="reset-dialog" class="modal" aria-labelledby="reset-title">
      <h5 id="reset-title">Reset demo data?</h5>
      <p>All reviews, points and accounts made in this browser are removed. You will be logged out.</p>
      <nav class="right-align">
        <button type="button" class="border" data-action="close-reset">Cancel</button>
        <button type="button" class="error" data-action="confirm-reset">Reset</button>
      </nav>
    </dialog>
  `;

  offs = [on(el, 'click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    event.preventDefault();
    const help = el.querySelector('#help-dialog');
    const resetDialog = el.querySelector('#reset-dialog');
    if (action === 'help') openDialog(help);
    if (action === 'close-help') closeDialog(help);
    if (action === 'reset') openDialog(resetDialog);
    if (action === 'close-reset') closeDialog(resetDialog);
    if (action === 'confirm-reset') {
      closeDialog(resetDialog);
      reset();
      go('/login');
    }
    if (action === 'logout') {
      logout();
      go('/login');
    }
  })];
}

export function destroy() {
  offs.forEach((off) => off());
  document.querySelectorAll('.overlay').forEach((o) => o.classList.remove('active'));
}
