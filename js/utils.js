// Tiny helpers shared by views and components.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape any value before it goes into innerHTML. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const COMMENT_TYPES = {
  issue: { label: 'Issue', color: 'error-container' },
  suggestion: { label: 'Suggestion', color: 'tertiary-container' },
  good: { label: 'Good practice', color: 'primary-container' },
};

export const DECISIONS = {
  approve: 'Approve',
  request_changes: 'Request changes',
};

/** The "← Title" row under the top bar (as in the wireframes). Arrow and text are one clickable link. */
export const backRow = (href, label) => `
  <nav class="no-margin">
    <a href="${esc(href)}" class="button transparent back-link"><i>arrow_back</i><span>${esc(label)}</span></a>
  </nav>`;

/** Open / close a beer.css dialog (falls back to the native dialog API). */
export function openDialog(dialog) {
  if (window.ui) window.ui(`#${dialog.id}`);
  else dialog.showModal();
}

export function closeDialog(dialog) {
  if (window.ui && dialog.classList.contains('active')) window.ui(`#${dialog.id}`);
  else if (dialog.open) dialog.close();
}

/** Add an event listener and return a function that removes it (for destroy()). */
export function on(el, type, handler) {
  el.addEventListener(type, handler);
  return () => el.removeEventListener(type, handler);
}
