// Screen 7 · Feedback overview: found, missed and unnecessary — with the code marked.
import { getLesson, getLatestSubmitted } from '../data.js';
import { resultMarks } from '../grading.js';
import { esc, plural, DECISIONS } from '../utils.js';
import '../components/app-code.js';
import '../components/app-stepper.js';

export async function render(el, { id, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson } = found;
  const ex = lesson.exercise;
  const review = await getLatestSubmitted(user.id, lesson.id);
  if (!review) { location.hash = `#/lessons/${lesson.id}/context`; return; }

  const { result } = review;
  const issue = (issueId) => ex.issues.find((i) => i.id === issueId);
  const unnecessary = review.comments.filter((c) => result.unnecessary.includes(c.id));
  const firstToExplain = result.missed[0] ?? ex.issues[0].id;
  const allFound = result.found.length === result.total;
  const headline = allFound && result.decisionCorrect ? 'Great review!' : result.found.length ? 'Nice catch!' : 'Good try!';
  const sub = result.missed.length
    ? `You found ${result.found.length} of ${result.total}. Let's look at what you missed.`
    : `You found every issue in this pull request.`;
  const base = `#/lessons/${esc(lesson.id)}`;

  const issueRow = (i, icon) => `
    <li>
      <a href="${base}/explanation/${esc(i.id)}" class="row max">
        <i>${icon}</i>
        <div class="max"><b>${esc(i.title)}</b><div class="small-text">Line ${i.lines[0]} · ${esc(i.category)}</div></div>
        <i>chevron_right</i>
      </a>
    </li>`;

  el.innerHTML = `
    <app-stepper step="feedback"></app-stepper>

    <article class="inverse-surface round top-margin">
      <div class="row">
        <img src="assets/frogy.svg" alt="Frogy" class="frogy small">
        <div class="max">
          <h5 class="no-margin">${headline}</h5>
          <p class="no-margin small-text">${sub}</p>
        </div>
        <div class="center-align">
          <h5 class="no-margin">${result.found.length}/${result.total}</h5>
          <span class="small-text">issues</span>
        </div>
      </div>
      <nav class="wrap">
        ${result.passed ? `<span class="chip no-border tertiary"><i>stars</i><span>+${result.points} points</span></span>` : '<span class="chip no-border tertiary-container"><i>replay</i><span>Not passed yet</span></span>'}
        <span class="chip no-border ${result.decisionCorrect ? 'primary' : 'error'}">
          <i>${result.decisionCorrect ? 'check' : 'close'}</i><span>${DECISIONS[review.decision]}</span>
        </span>
      </nav>
    </article>

    <h5>Your results</h5>
    <article class="round primary-container no-elevate">
      <h6 class="small row"><i class="fill primary-text">check_circle</i><span>Correctly identified (${result.found.length})</span></h6>
      ${result.found.length ? `<ul class="list no-space">${result.found.map((f) => issueRow(issue(f), 'check')).join('')}</ul>` : '<p class="no-margin">None this time. That is okay, this is practice!</p>'}
    </article>

    <article class="round error-container no-elevate">
      <h6 class="small row"><i class="fill error-text">cancel</i><span>Missed issues (${result.missed.length})</span></h6>
      ${result.missed.length ? `<ul class="list no-space">${result.missed.map((m) => issueRow(issue(m), 'search')).join('')}</ul>` : '<p class="no-margin">Nothing missed. Well spotted!</p>'}
    </article>

    <article class="round tertiary-container no-elevate">
      <h6 class="small row"><i class="fill tertiary-text">error</i><span>Unnecessary comments (${unnecessary.length})</span></h6>
      ${unnecessary.length ? `<ul class="list no-space">${unnecessary.map((c) => `
        <li><i>chat</i><div class="max"><b>Line ${c.line}</b><div class="small-text">"${esc(c.text)}"</div><div class="small-text">This line was fine. Comments here can distract the author from the real problems.</div></div></li>`).join('')}</ul>`
        : '<p class="no-margin">All your comments were about real issues.</p>'}
    </article>

    ${result.decisionCorrect ? '' : `
      <article class="round border no-elevate">
        <h6 class="small row"><i class="error-text">gavel</i><span>About your decision</span></h6>
        <p class="no-margin">You chose <b>${DECISIONS[review.decision]}</b>. Because the code does not meet all requirements yet, the expected decision was <b>${DECISIONS[ex.expectedDecision]}</b>.</p>
      </article>`}

    <h6 class="small">Your review on the code</h6>
    <app-code label="${esc(ex.file)} with your results"></app-code>
    <nav class="wrap small-text">
      <span class="row no-space"><i class="small primary-text">check_circle</i>&nbsp;Found</span>
      <span class="row no-space"><i class="small error-text">cancel</i>&nbsp;Missed</span>
      <span class="row no-space"><i class="small tertiary-text">error</i>&nbsp;Unnecessary</span>
    </nav>

    <nav class="group connected top-margin">
      <a href="${base}/explanation/${esc(firstToExplain)}" class="button border max"><i>menu_book</i><span>Explanation</span></a>
      <a href="${base}/expert" class="button border max"><i>school</i><span>Expert example</span></a>
    </nav>
    <a href="${base}/complete" class="button large primary responsive"><span>Continue</span><i>arrow_forward</i></a>
    <p class="center-align small-text">${result.passed ? `${plural(result.found.length * 10, 'point')} for issues, 10 for your decision, 10 for finishing.` : 'Find every issue and make the right decision to pass and earn points.'}</p>
  `;

  const code = el.querySelector('app-code');
  code.lines = ex.code;
  code.marks = resultMarks(ex, review);
}
