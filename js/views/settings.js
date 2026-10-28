// Settings: learning preferences.
import { esc, backRow } from '../utils.js';

export async function render(el, { user }) {
  el.innerHTML = `
    ${backRow('#/profile', 'Profile')}
    <h4>Settings</h4>

    <article class="round">
      <h6 class="small row"><i class="secondary-text">tune</i><span>Learning preferences</span></h6>
      <ul class="list no-space">
        <li><i>code</i><span class="max">Language</span><b>${esc(user.language)}</b></li>
        <li><i>signal_cellular_alt</i><span class="max">Experience</span><b>${esc(user.level)}</b></li>
        <li><i>flag</i><span class="max">Weekly goal</span><b>${esc(user.goal)} reviews</b></li>
      </ul>
      <a href="#/onboarding?next=/settings" class="button border responsive top-margin"><i>edit</i><span>Change preferences</span></a>
    </article>
  `;
}
