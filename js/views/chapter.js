// Study chapter: reading material with learning objectives, sections, an example and a key takeaway.
import { getAll } from '../data.js';
import { esc, backRow } from '../utils.js';
import '../components/app-code.js';

export async function render(el, { id }) {
  const chapters = (await getAll('chapters')).sort((a, b) => a.order - b.order);
  const index = chapters.findIndex((c) => c.id === id);
  if (index === -1) { location.hash = '#/learn'; return; }
  const c = chapters[index];
  const prev = chapters[index - 1];
  const next = chapters[index + 1];

  el.innerHTML = `
    ${backRow('#/learn', 'Learn')}

    <p class="upper bold small-text secondary-text no-margin">Chapter ${c.order} · ~${esc(c.minutes)} min read</p>
    <h4 class="no-margin">${esc(c.title)}</h4>
    <p>${esc(c.summary)}</p>

    <article class="round primary-container no-elevate">
      <h6 class="small row"><i class="primary-text">flag</i><span>Learning objectives</span></h6>
      <ul class="list no-space">
        ${c.objectives.map((o) => `<li><i class="primary-text">check_circle</i><span class="max">${esc(o)}</span></li>`).join('')}
      </ul>
    </article>

    ${c.sections.map((s, i) => `
      <section>
        <h5>${esc(s.heading)}</h5>
        ${s.text ? `<p>${esc(s.text)}</p>` : ''}
        ${s.points ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${s.code ? `<app-code data-section="${i}" label="Example"></app-code>` : ''}
      </section>`).join('')}

    <article class="round tertiary-container no-elevate">
      <h6 class="small row"><i>lightbulb</i><span>Key takeaway</span></h6>
      <p class="no-margin">${esc(c.takeaway)}</p>
    </article>

    ${c.lessonId ? `<a href="#/lessons/${esc(c.lessonId)}" class="button large primary responsive"><span>Practise this in a lesson</span><i>arrow_forward</i></a>` : ''}

    <nav class="group connected view-switch">
      ${prev ? `<a href="#/learn/${esc(prev.id)}" class="button max left-round border"><i>arrow_back</i><span>Previous</span></a>` : ''}
      ${next ? `<a href="#/learn/${esc(next.id)}" class="button max ${prev ? 'right-round' : ''} border"><span>Next chapter</span><i>arrow_forward</i></a>` : ''}
    </nav>
  `;

  el.querySelectorAll('app-code[data-section]').forEach((code) => {
    code.lines = c.sections[Number(code.dataset.section)].code;
  });
}
