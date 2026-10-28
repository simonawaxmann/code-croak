// Screen 10 · Progress overview per topic, plus review history (breadboard: progress flow).
import { getTopicsWithLessons, getReviewsFor, getAll } from '../data.js';
import { esc } from '../utils.js';

export async function render(el, { user }) {
  const [topics, reviews, lessons] = await Promise.all([
    getTopicsWithLessons(),
    getReviewsFor(user.id),
    getAll('lessons'),
  ]);
  const submitted = reviews.filter((r) => r.status === 'submitted')
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const completed = new Set(submitted.map((r) => r.lessonId));
  const total = lessons.length;
  const percent = Math.round((completed.size / total) * 100);
  const caught = submitted.reduce((sum, r) => sum + r.result.found.length, 0);
  const planted = submitted.reduce((sum, r) => sum + r.result.total, 0);
  const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l]));

  el.innerHTML = `
    <h4>Your progress</h4>

    ${topics.map((topic) => {
      const done = topic.lessons.filter((l) => completed.has(l.id)).length;
      const value = Math.round((done / topic.lessons.length) * 100);
      return `
      <article class="round border no-elevate">
        <a href="#/lessons/${esc(topic.lessons[0].id)}" class="row">
          <i class="secondary-text">${esc(topic.icon)}</i>
          <h6 class="small max no-margin">${esc(topic.title)}</h6>
          <span class="bold">${done}/${topic.lessons.length}</span>
          <i>chevron_right</i>
        </a>
        <progress class="thick" value="${value}" max="100" aria-label="${esc(topic.title)} ${value}%"></progress>
      </article>`;
    }).join('')}

    <article class="round inverse-surface">
      <div class="row">
        <h6 class="small max no-margin">Total progress</h6>
        <span class="bold">${completed.size}/${total} lessons</span>
      </div>
      <progress class="thick" value="${percent}" max="100" aria-label="Total progress ${percent}%"></progress>
      <div class="grid no-space top-margin">
        <div class="s4 center-align"><h6 class="no-margin">${user.streak}</h6><span class="small-text">day streak</span></div>
        <div class="s4 center-align"><h6 class="no-margin">${user.points}</h6><span class="small-text">points</span></div>
        <div class="s4 center-align"><h6 class="no-margin">${planted ? Math.round((caught / planted) * 100) : 0}%</h6><span class="small-text">issues caught</span></div>
      </div>
    </article>

    <h5>Review history</h5>
    ${submitted.length ? `<ul class="list border round surface-container">
      ${submitted.map((r) => `
        <li>
          <a href="#/lessons/${esc(r.lessonId)}/feedback" class="row max">
            <i class="${r.result.missed.length ? 'tertiary-text' : 'primary-text'}">${r.result.missed.length ? 'rule' : 'task_alt'}</i>
            <div class="max">
              <b>${esc(lessonById[r.lessonId]?.title ?? 'Lesson')}</b>
              <div class="small-text">${new Date(r.submittedAt).toLocaleDateString()} · ${r.result.found.length}/${r.result.total} issues · +${r.result.points} points</div>
            </div>
            <i>chevron_right</i>
          </a>
        </li>`).join('')}
    </ul>` : `
    <article class="round no-elevate tertiary-container">
      <p class="no-margin">No reviews yet. Finish a lesson and your feedback will be saved here.</p>
    </article>`}
  `;
}
