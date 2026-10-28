// NEW in iteration 3 · Lesson complete: summarise what the student achieved and offer an
// optional "View progress" action (iteration 2 finding: the step to Progress was not obvious).
// Not passed: no points, not completed, and "Redo lesson" becomes the main action.
import { getLesson, getLatestSubmitted, getTopicsWithLessons, getCompletedLessonIds } from '../data.js';
import { esc } from '../utils.js';

export async function render(el, { id, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson, topic } = found;
  const review = await getLatestSubmitted(user.id, lesson.id);
  if (!review) { location.hash = `#/lessons/${lesson.id}/context`; return; }
  const { result } = review;

  const [topics, completed] = await Promise.all([getTopicsWithLessons(), getCompletedLessonIds(user.id)]);
  const all = topics.flatMap((t) => t.lessons);
  const next = all.find((l) => !completed.has(l.id));
  const percent = Math.round((completed.size / all.length) * 100);

  const passed = result.passed;
  const retry = `#/lessons/${esc(lesson.id)}/context`;

  el.innerHTML = `
    <div class="center-align">
      <img src="assets/frogy.svg" alt="Frogy" class="frogy large">
      <h4 class="no-margin">${passed ? 'Lesson complete!' : 'Almost there!'}</h4>
      <p>${passed
        ? `You finished <b>${esc(topic.title)} · ${esc(lesson.title)}</b>.`
        : `You found ${result.found.length} of ${result.total} issues${result.decisionCorrect ? '' : ' and the decision was not right yet'}. Redo the lesson to pass it and earn points.`}</p>
    </div>

    <div class="grid small-space">
      <article class="s4 round center-align no-elevate border">
        <i class="large primary-text">bug_report</i>
        <h5 class="no-margin">${result.found.length}/${result.total}</h5>
        <p class="small-text no-margin">issues found</p>
      </article>
      <article class="s4 round center-align no-elevate border">
        <i class="large tertiary-text">stars</i>
        <h5 class="no-margin">${passed ? `+${result.points}` : '0'}</h5>
        <p class="small-text no-margin">points</p>
      </article>
      <article class="s4 round center-align no-elevate border">
        <i class="large tertiary-text">local_fire_department</i>
        <h5 class="no-margin">${user.streak}</h5>
        <p class="small-text no-margin">day streak</p>
      </article>
    </div>

    <article class="round">
      <div class="row">
        <h6 class="small max no-margin">Your progress</h6>
        <span class="bold">${completed.size}/${all.length} lessons</span>
      </div>
      <progress class="thick" value="${percent}" max="100" aria-label="Total progress ${percent}%"></progress>
      <a href="#/progress" class="button border responsive top-margin"><i>bar_chart</i><span>View progress</span></a>
    </article>

    ${passed
      ? (next
        ? `<a href="#/lessons/${esc(next.id)}" class="button large primary responsive"><span>Next lesson</span><i>arrow_forward</i></a>`
        : '<a href="#/" class="button large primary responsive"><span>Back to home</span></a>')
      : `<a href="${retry}" class="button large primary responsive"><i>replay</i><span>Redo lesson</span></a>
         <a href="#/" class="button large border responsive"><span>Back to home</span></a>`}
    ${passed ? `<a href="${retry}" class="button transparent responsive"><i>replay</i><span>Try this lesson again</span></a>` : ''}
  `;
}
