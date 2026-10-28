// Screen 9 · Expert example: how an experienced reviewer approached the same code.
// Only reachable after the student's own attempt (avoids automation bias).
import { getLesson, getLatestSubmitted } from '../data.js';
import { esc, backRow, COMMENT_TYPES, DECISIONS } from '../utils.js';
import '../components/app-code.js';

export async function render(el, { id, user }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson } = found;
  const ex = lesson.exercise;
  const review = await getLatestSubmitted(user.id, lesson.id);
  if (!review) { location.hash = `#/lessons/${lesson.id}/context`; return; }
  const base = `#/lessons/${esc(lesson.id)}`;
  const expert = ex.expert;

  el.innerHTML = `
    ${backRow(`${base}/feedback`, 'Back to Feedback')}

    <nav class="group connected view-switch" aria-label="View">
      <a href="${base}/explanation/${esc(ex.issues[0].id)}" class="button max left-round border"><i>menu_book</i><span>Explanation</span></a>
      <a href="${base}/expert" class="button max right-round primary" aria-current="page"><i>school</i><span>Expert example</span></a>
    </nav>

    <div class="row top-margin">
      <span class="button circle secondary" aria-hidden="true"><i>school</i></span>
      <div class="max">
        <h5 class="no-margin">Expert review</h5>
        <p class="no-margin small-text">How an experienced reviewer would handle this pull request.</p>
      </div>
    </div>

    <article class="round">
      <p class="upper bold small-text no-margin secondary-text">Review summary</p>
      <p>"${esc(expert.summary)}"</p>
      <span class="chip no-border secondary"><i>gavel</i><span>${DECISIONS[expert.decision]}</span></span>
    </article>

    <app-code label="${esc(ex.file)} with expert comments"></app-code>

    ${expert.comments.map((c) => `
      <article class="round border no-elevate">
        <nav>
          <span class="chip small no-border surface-variant">Line ${c.line}</span>
          <span class="chip small no-border ${COMMENT_TYPES[c.type].color}">${COMMENT_TYPES[c.type].label}</span>
        </nav>
        <p class="no-margin">${esc(c.text)}</p>
      </article>`).join('')}

    <article class="round primary-container no-elevate">
      <h6 class="small">Why is this a strong review?</h6>
      <ul class="list no-space">
        ${expert.why.map((w) => `<li><i>check_circle</i><span class="max">${esc(w)}</span></li>`).join('')}
      </ul>
    </article>

    <article class="round border no-elevate">
      <h6 class="small">Compare with your review</h6>
      <div class="grid no-space">
        <div class="s6"><p class="small-text no-margin">You</p><b>${review.comments.length} comments · ${DECISIONS[review.decision]}</b></div>
        <div class="s6"><p class="small-text no-margin">Expert</p><b>${expert.comments.length} comments · ${DECISIONS[expert.decision]}</b></div>
      </div>
    </article>

  `;

  const code = el.querySelector('app-code');
  code.lines = ex.code;
  code.marks = Object.fromEntries(expert.comments.map((c) => [c.line, 'commented']));
}
