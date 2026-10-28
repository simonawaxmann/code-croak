// Learn tab: study material (no practising). Chapters with a short overview of the learning objectives.
import { getAll } from '../data.js';
import { esc } from '../utils.js';

export async function render(el) {
  const chapters = (await getAll('chapters')).sort((a, b) => a.order - b.order);

  el.innerHTML = `
    <h4>Learn</h4>
    <p>Study the basics of code review at your own pace. Read a chapter, then practise it in a lesson.</p>
    ${chapters.map((c) => `
      <a href="#/learn/${esc(c.id)}" class="padding round surface-container border chapter-card">
        <div class="row">
          <span class="button circle secondary-container" aria-hidden="true"><i>${esc(c.icon)}</i></span>
          <div class="max">
            <p class="upper bold small-text secondary-text no-margin">Chapter ${c.order} · ~${esc(c.minutes)} min read</p>
            <h6 class="small no-margin">${esc(c.title)}</h6>
          </div>
          <i>chevron_right</i>
        </div>
        <p class="small-text">You will learn to:</p>
        <ul class="small-text no-margin">${c.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
      </a>`).join('')}
  `;
}
