// Screen 4 + 5 · Review the code, add comments (bottom sheet) and get an optional hint.
import { getLesson, getOrCreateDraft, update } from '../data.js';
import { go } from '../router.js';
import { esc, backRow, on, openDialog, closeDialog, COMMENT_TYPES } from '../utils.js';
import '../components/app-code.js';
import '../components/app-stepper.js';

let offs = [];

export async function render(el, { id, user, query }) {
  const found = await getLesson(id);
  if (!found) { location.hash = '#/'; return; }
  const { lesson } = found;
  const ex = lesson.exercise;
  let draft = await getOrCreateDraft(user.id, lesson.id);
  let selected = null;
  let editing = null; // comment id while editing
  let type = null;

  el.innerHTML = `
    ${backRow(`#/lessons/${lesson.id}/context`, 'Exercise 1 of 1')}
    <app-stepper step="select"></app-stepper>

    <div class="row top-margin">
      <div class="max">
        <h5 class="no-margin">Review the code</h5>
        <p class="no-margin">Tap a line you think is worth commenting on.</p>
      </div>
    </div>

    <details class="requirements round padding">
      <summary class="bold"><i class="secondary-text">checklist</i><span>Requirements (${ex.requirements.length})</span><i class="chevron">expand_more</i></summary>
      <ol class="small-text">${ex.requirements.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
    </details>

    <p class="small-text no-margin"><i class="small">description</i> ${esc(ex.file)}</p>
    <app-code selectable label="${esc(ex.file)}"></app-code>

    <button type="button" class="responsive large tertiary-container hint-bar" data-action="hint">
      <i>lightbulb</i><span class="max">Need some help?</span><span class="chip small tertiary no-border">Hint</span>
    </button>

    <button type="button" class="responsive large" data-action="add" disabled>
      <i>add_comment</i><span>Add comment</span>
    </button>

    <section id="comment-list" aria-live="polite"></section>

    <button type="button" class="large primary responsive" data-action="continue">
      <span>Continue</span><i>arrow_forward</i>
    </button>

    <dialog id="hint-dialog" class="bottom modal" aria-labelledby="hint-title">
      <nav>
        <img src="assets/frogy.svg" alt="" class="frogy small">
        <h5 id="hint-title" class="max">Frogy's hint</h5>
        <button type="button" class="transparent circle" data-action="close-hint" aria-label="Close"><i>close</i></button>
      </nav>
      <h6 class="small">What to look for</h6>
      <ul class="list no-space">${ex.hint.look.map((h) => `<li><i class="secondary-text">search</i><span class="max">${esc(h)}</span></li>`).join('')}</ul>
      <h6 class="small">How to write your comment</h6>
      <ul class="list no-space">${ex.hint.write.map((h) => `<li><i class="secondary-text">edit_note</i><span class="max">${esc(h)}</span></li>`).join('')}</ul>
      <nav class="right-align">
        <button type="button" class="primary" data-action="close-hint">Back to the code</button>
      </nav>
    </dialog>

    <dialog id="comment-dialog" class="bottom modal" aria-labelledby="comment-title">
      <form id="comment-form" method="dialog" novalidate>
        <nav>
          <h5 id="comment-title" class="max">Add comment</h5>
          <button type="button" class="transparent circle" data-action="cancel" aria-label="Close"><i>close</i></button>
        </nav>
        <p class="upper bold small-text no-margin" id="selected-label">Selected code</p>
        <app-code id="selected-code"></app-code>
        <div class="field label border round top-margin">
          <textarea id="comment-text" name="text" rows="4" required autofocus placeholder=" "></textarea>
          <label for="comment-text">Your comment</label>
          <output class="invalid" hidden>Write a short comment first.</output>
        </div>
        <p class="upper bold small-text no-margin">Comment type (optional)</p>
        <nav class="wrap" role="group" aria-label="Comment type">
          ${Object.entries(COMMENT_TYPES).map(([value, t]) => `
            <button type="button" class="chip" data-type="${value}" data-color="${t.color}" aria-pressed="false">${esc(t.label)}</button>`).join('')}
        </nav>
        <nav class="right-align top-margin">
          <button type="button" class="transparent error-text" data-action="delete" hidden><i>delete</i><span>Delete</span></button>
          <div class="max"></div>
          <button type="button" class="border" data-action="cancel">Cancel</button>
          <button type="submit" class="primary">Save comment</button>
        </nav>
      </form>
    </dialog>
  `;

  const code = el.querySelector('app-code[selectable]');
  code.lines = ex.code;
  const hintDialog = el.querySelector('#hint-dialog');
  const commentDialog = el.querySelector('#comment-dialog');
  const form = el.querySelector('#comment-form');

  function paint() {
    const marks = {};
    draft.comments.forEach((c) => { marks[c.line] = 'commented'; });
    code.marks = marks;
    code.selected = selected;
    el.querySelector('app-stepper').setAttribute('step', draft.comments.length ? 'comment' : 'select');
    const add = el.querySelector('[data-action="add"]');
    add.disabled = selected === null;
    add.classList.toggle('secondary', selected !== null); // Lily once a line is selected, grey before
    el.querySelector('[data-action="add"] span').textContent =
      selected === null ? 'Add comment' : `Add comment on line ${selected}`;

    const list = el.querySelector('#comment-list');
    list.innerHTML = draft.comments.length
      ? `<h6 class="small">Your comments (${draft.comments.length})</h6>` +
        [...draft.comments].sort((a, b) => a.line - b.line).map((c) => `
          <article class="round border no-elevate">
            <nav>
              <span class="chip small no-border surface-variant">Line ${c.line}</span>
              ${c.type ? `<span class="chip small no-border ${COMMENT_TYPES[c.type].color}">${COMMENT_TYPES[c.type].label}</span>` : ''}
              <div class="max"></div>
              <button type="button" class="transparent circle small" data-edit="${esc(c.id)}" aria-label="Edit comment on line ${c.line}"><i>edit</i></button>
            </nav>
            <p class="no-margin">${esc(c.text)}</p>
          </article>`).join('')
      : '';
  }

  function setType(value) {
    type = value;
    form.querySelectorAll('[data-type]').forEach((chip) => {
      const on = chip.dataset.type === value;
      chip.classList.toggle(chip.dataset.color, on);
      chip.classList.toggle('no-border', on);
      chip.setAttribute('aria-pressed', String(on));
    });
  }

  function openComment(comment) {
    editing = comment?.id ?? null;
    const line = comment?.line ?? selected;
    el.querySelector('#comment-title').textContent = comment ? 'Edit comment' : 'Add comment';
    el.querySelector('#selected-label').textContent = `Selected code · line ${line}`;
    const snippet = el.querySelector('#selected-code');
    snippet.setAttribute('start', line);
    snippet.lines = [ex.code[line - 1]];
    form.text.value = comment?.text ?? '';
    form.text.parentElement.classList.remove('invalid');
    form.querySelector('output').hidden = true;
    form.querySelector('[data-action="delete"]').hidden = !comment;
    form.dataset.line = line;
    setType(comment?.type ?? null);
    openDialog(commentDialog);
  }

  async function saveDraft(comments) {
    draft = await update('reviews', draft.id, { comments });
    paint();
  }

  paint();

  const editId = query.get('edit');
  if (editId) {
    const comment = draft.comments.find((c) => c.id === editId);
    if (comment) openComment(comment);
  }

  offs = [
    on(el, 'line-select', (event) => {
      const { line } = event.detail;
      if (!ex.code[line - 1].trim()) return;
      const existing = draft.comments.find((c) => c.line === line);
      selected = selected === line ? null : line;
      paint();
      if (existing && selected === line) openComment(existing);
    }),
    on(el, 'click', async (event) => {
      const target = event.target.closest('[data-action], [data-type], [data-edit]');
      if (!target) return;
      if (target.dataset.type) return setType(type === target.dataset.type ? null : target.dataset.type);
      if (target.dataset.edit) return openComment(draft.comments.find((c) => c.id === target.dataset.edit));
      switch (target.dataset.action) {
        case 'hint': return openDialog(hintDialog);
        case 'close-hint': return closeDialog(hintDialog);
        case 'add': return openComment(null);
        case 'cancel': return closeDialog(commentDialog);
        case 'delete':
          closeDialog(commentDialog);
          return saveDraft(draft.comments.filter((c) => c.id !== editing));
        case 'continue': return go(`/lessons/${lesson.id}/decide`);
        default: return undefined;
      }
    }),
    on(el, 'submit', async (event) => {
      event.preventDefault();
      const text = form.text.value.trim();
      const valid = text.length > 0;
      form.text.parentElement.classList.toggle('invalid', !valid);
      form.querySelector('output').hidden = valid;
      if (!valid) return;
      const line = Number(form.dataset.line);
      const comments = editing
        ? draft.comments.map((c) => (c.id === editing ? { ...c, text, type } : c))
        : [...draft.comments, { id: crypto.randomUUID(), line, text, type }];
      closeDialog(commentDialog);
      selected = null;
      await saveDraft(comments);
    }),
  ];
}

export function destroy() {
  offs.forEach((off) => off());
  document.querySelectorAll('.overlay').forEach((o) => o.classList.remove('active'));
}
