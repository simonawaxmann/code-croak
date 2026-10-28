// Screen 8 · Explanation: what is wrong, why it matters, how to improve.
// Iteration 2: clear "Back to Feedback" instead of Next/Continue.
import { getLesson, getLatestSubmitted } from '../data.js';
import { esc, backRow, COMMENT_TYPES } from '../utils.js';
import '../components/app-code.js';

export async function render(el, { id, issue: issueId, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson } = found;
  const ex = lesson.exercise;
  const review = await getLatestSubmitted(user.id, lesson.id);
  const issue = ex.issues.find((i) => i.id === issueId) ?? ex.issues[0];
  const base = `#/lessons/${esc(lesson.id)}`;
  const caught = review?.result.found.includes(issue.id);
  const yourComment = caught ? review.comments.find((c) => c.id === review.result.foundBy[issue.id]) : null;

  el.innerHTML = `
    ${backRow(`${base}/feedback`, 'Back to Feedback')}

    <nav class="group connected view-switch" aria-label="View">
      <a href="${base}/explanation/${esc(issue.id)}" class="button max left-round primary" aria-current="page"><i>menu_book</i><span>Explanation</span></a>
      <a href="${base}/expert" class="button max right-round border"><i>school</i><span>Expert example</span></a>
    </nav>

    ${ex.issues.length > 1 ? `
      <nav class="wrap top-margin" aria-label="Issues">
        ${ex.issues.map((i, n) => {
          const ok = review?.result.found.includes(i.id);
          return `<a href="${base}/explanation/${esc(i.id)}" class="chip ${i.id === issue.id ? 'secondary no-border' : ''}" ${i.id === issue.id ? 'aria-current="true"' : ''}>
            <i>${ok ? 'check_circle' : 'cancel'}</i><span>Issue ${n + 1}</span></a>`;
        }).join('')}
      </nav>` : ''}

    <div class="row top-margin">
      <h5 class="max no-margin">${esc(issue.title)}</h5>
      <span class="chip small no-border ${caught ? 'primary-container' : 'error-container'}">${caught ? 'You caught this' : 'Missed'}</span>
    </div>
    <p class="small-text no-margin">${esc(issue.category)} · line ${issue.lines.join(', ')}</p>

    <h6 class="small">The issue</h6>
    <app-code id="issue-code" label="Code with the issue"></app-code>

    <article class="round">
      <h6 class="small row"><i class="error-text">report</i><span>What is wrong?</span></h6>
      <p class="no-margin">${esc(issue.wrong)}</p>
    </article>
    <article class="round">
      <h6 class="small row"><i class="tertiary-text">priority_high</i><span>Why it matters</span></h6>
      <p class="no-margin">${esc(issue.why)}</p>
    </article>
    <article class="round">
      <h6 class="small row"><i class="primary-text">auto_awesome</i><span>How to improve</span></h6>
      <p>${esc(issue.improve)}</p>
      <app-code id="fix-code" label="Suggested fix"></app-code>
    </article>

    ${yourComment ? `
      <article class="round primary-container no-elevate">
        <h6 class="small row"><i>chat</i><span>Your comment</span>
          ${yourComment.type ? `<span class="chip small no-border ${COMMENT_TYPES[yourComment.type].color}">${COMMENT_TYPES[yourComment.type].label}</span>` : ''}</h6>
        <p class="no-margin">"${esc(yourComment.text)}"</p>
      </article>` : ''}

  `;

  const issueCode = el.querySelector('#issue-code');
  issueCode.lines = ex.code;
  issueCode.marks = Object.fromEntries(issue.lines.slice(0, 1).map((l) => [l, caught ? 'found' : 'missed']));
  const fixCode = el.querySelector('#fix-code');
  fixCode.setAttribute('start', issue.lines[0]);
  fixCode.lines = [issue.fix];
}
