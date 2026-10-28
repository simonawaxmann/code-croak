// <app-code> — code block with line numbers.
// Properties: lines (string[]), marks ({ [lineNo]: 'commented'|'found'|'missed'|'unnecessary' }),
//             selected (number|null). Attribute: selectable.
// Emits: CustomEvent 'line-select' with detail { line }.
import { esc } from '../utils.js';

const KEYWORDS = /\b(function|return|let|const|var|if|else|for|of|while|true|false|null|test|expect|new)\b/g;
const MARK_ICON = { commented: 'chat', found: 'check_circle', missed: 'cancel', unnecessary: 'error' };

const BREAK = '\u200B'; // invisible break opportunity, so long lines wrap at ( . , instead of mid-word

function highlight(src) {
  // Escape first, then wrap tokens. Strings are matched on the escaped quote entity.
  return esc(src.replace(/([(.,])/g, `$1${BREAK}`))
    .replace(/(&quot;.*?&quot;)/g, '<span class="str">$1</span>')
    .replace(KEYWORDS, '<span class="kw">$1</span>');
}

class AppCode extends HTMLElement {
  #lines = [];
  #marks = {};
  #selected = null;

  set lines(value) { this.#lines = value ?? []; this.render(); }
  set marks(value) { this.#marks = value ?? {}; this.render(); }
  set selected(value) { this.#selected = value; this.render(); }
  get selected() { return this.#selected; }

  connectedCallback() {
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKey);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('keydown', this.#onKey);
  }

  #onKey = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.#onClick(event);
  };

  #onClick = (event) => {
    const line = event.target.closest('[data-line]');
    if (!line || !this.hasAttribute('selectable')) return;
    const number = Number(line.dataset.line);
    this.dispatchEvent(new CustomEvent('line-select', { detail: { line: number }, bubbles: true }));
  };

  render() {
    if (!this.isConnected) return;
    const selectable = this.hasAttribute('selectable');
    const label = this.getAttribute('label') ?? 'Code';
    const start = Number(this.getAttribute('start') ?? 1);
    const rows = this.#lines.map((src, i) => {
      const no = start + i;
      const indent = Math.min(src.length - src.trimStart().length, 8);
      const mark = this.#marks[no];
      const classes = ['line', mark, this.#selected === no ? 'selected' : ''].filter(Boolean).join(' ');
      const icon = mark ? `<i class="mark">${MARK_ICON[mark]}</i>` : '';
      const attrs = selectable
        ? `role="button" tabindex="0" data-selectable aria-pressed="${this.#selected === no}" aria-label="Line ${no}: ${esc(src.trim() || 'empty line')}"`
        : '';
      return `<div class="${classes}" data-line="${no}" ${attrs}><span class="no">${no}</span><span class="src indent-${indent}">${highlight(src.trimStart())}</span>${icon}</div>`;
    });
    const focused = this.querySelector(':focus')?.dataset.line;
    this.innerHTML = `<div class="code-block" role="group" aria-label="${esc(label)}">${rows.join('')}</div>`;
    if (focused) this.querySelector(`[data-line="${focused}"]`)?.focus();
  }
}

customElements.define('app-code', AppCode);
