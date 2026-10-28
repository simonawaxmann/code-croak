// Screen 1 · Home: continue learning + all topics.
import { getTopicsWithLessons, getCompletedLessonIds } from '../data.js';
import { esc, plural } from '../utils.js';

export async function render(el, { user }) {
  const [topics, completed] = await Promise.all([
    getTopicsWithLessons(),
    getCompletedLessonIds(user.id),
  ]);

  const allLessons = topics.flatMap((t) => t.lessons.map((lesson) => ({ lesson, topic: t })));
  const next = allLessons.find(({ lesson }) => !completed.has(lesson.id)) ?? allLessons[0];
  const nextDone = completed.has(next.lesson.id);

  el.innerHTML = `
    <div class="row">
      <img src="assets/frogy.svg" alt="Frogy" class="frogy small">
      <h4 class="max">Welcome back, ${esc(user.name)}!</h4>
    </div>

    <article class="inverse-surface round large-padding">
      <p class="upper bold tertiary-text small-text no-margin">${nextDone ? 'Practise again' : 'Continue learning'}</p>
      <h5 class="no-margin">${esc(next.topic.title)} – ${esc(next.lesson.title)}</h5>
      <p>${plural(next.lesson.exercises, 'exercise')} · ${esc(next.lesson.difficulty)} · ~${esc(next.lesson.minutes)} min</p>
      <a href="#/lessons/${esc(next.lesson.id)}" class="button large primary responsive">
        <span>Continue</span><i>arrow_forward</i>
      </a>
    </article>

    <h5>All topics</h5>
    ${topics.map((topic) => {
      const done = topic.lessons.filter((l) => completed.has(l.id)).length;
      return `
      <a href="#/lessons/${esc(topic.lessons[0].id)}" class="row padding round surface-container border" aria-label="${esc(topic.title)}, ${done} of ${topic.lessons.length} lessons done">
        <span class="button circle secondary-container" aria-hidden="true"><i>${esc(topic.icon)}</i></span>
        <div class="max">
          <h6 class="small no-margin">${esc(topic.title)}</h6>
          <div class="small-text">${esc(topic.description)}</div>
        </div>
        <span class="bold">${done}/${topic.lessons.length}</span>
        <i>chevron_right</i>
      </a>`;
    }).join('')}
  `;
}
