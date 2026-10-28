// <app-stepper step="select|comment|decide|feedback"> — shows where the student is in the review.
// Only shown once the student starts reviewing (iteration 2 finding).
const STEPS = [
  ['select', 'Select'],
  ['comment', 'Comment'],
  ['decide', 'Decide'],
  ['feedback', 'Feedback'],
];

class AppStepper extends HTMLElement {
  static observedAttributes = ['step'];

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const currentIndex = STEPS.findIndex(([id]) => id === this.getAttribute('step'));
    const parts = STEPS.map(([, label], i) => {
      const status = i < currentIndex ? 'done' : i === currentIndex ? 'current' : '';
      const dot = `<span class="dot">${i < currentIndex ? '<i>check</i>' : ''}</span>`;
      const step = `<li class="step ${status}" ${i === currentIndex ? 'aria-current="step"' : ''}>${dot}<span>${label}</span></li>`;
      const bar = i < STEPS.length - 1 ? `<li class="bar ${i < currentIndex ? 'done' : ''}" aria-hidden="true"></li>` : '';
      return step + bar;
    });
    this.innerHTML = `<ol class="stepper" aria-label="Review steps">${parts.join('')}</ol>`;
  }
}

customElements.define('app-stepper', AppStepper);
