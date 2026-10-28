// Screen 2 · Lesson overview: what the lesson is about before it starts.
import { getLesson, getCompletedLessonIds } from '../data.js';
import { esc, plural, backRow } from '../utils.js';

export async function render(el, { id, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson, topic } = found;
  const done = (await getCompletedLessonIds(user.id)).has(lesson.id);

  el.innerHTML = `
    ${backRow('#/', 'Home')}

    <article class="round large-padding">
      <div class="row">
        <span class="button circle large secondary-container" aria-hidden="true"><i>${esc(topic.icon)}</i></span>
        <div class="max">
          <p class="upper bold small-text secondary-text no-margin">${esc(topic.title)}</p>
          <h4 class="no-margin">${esc(lesson.title)}</h4>
        </div>
      </div>
      <p>${esc(lesson.description)}</p>
      <nav class="wrap">
        <span class="chip no-border surface-variant"><i>assignment</i><span>${plural(lesson.exercises, 'exercise')}</span></span>
        <span class="chip no-border surface-variant"><i>schedule</i><span>~${esc(lesson.minutes)} minutes</span></span>
        <span class="chip no-border surface-variant"><i>signal_cellular_alt</i><span>${esc(lesson.difficulty)}</span></span>
        ${done ? '<span class="chip no-border primary-container"><i>check_circle</i><span>Completed</span></span>' : ''}
      </nav>
    </article>

    <article class="round">
      <h6>What you'll learn</h6>
      <ul class="list no-space">
        ${lesson.learn.map((item) => `<li><i class="primary-text">check_circle</i><span class="max">${esc(item)}</span></li>`).join('')}
      </ul>
    </article>

    <a href="#/lessons/${esc(lesson.id)}/context" class="button large primary responsive">
      <span>${done ? 'Practise again' : 'Start lesson'}</span>
    </a>
  `;
}
