// <app-stats streak="3" points="120"> — streak and points shown in the top bar.
import { esc } from '../utils.js';

class AppStats extends HTMLElement {
  static observedAttributes = ['streak', 'points'];

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const streak = this.getAttribute('streak') ?? 0;
    const points = this.getAttribute('points') ?? 0;
    this.innerHTML = `
      <nav class="no-space">
        <span class="chip transparent no-border" aria-label="${esc(streak)} day streak">
          <i class="tertiary-text">local_fire_department</i><span class="bold">${esc(streak)}</span>
        </span>
        <span class="chip transparent no-border" aria-label="${esc(points)} points">
          <i class="tertiary-text">stars</i><span class="bold">${esc(points)}</span>
        </span>
      </nav>`;
  }
}

customElements.define('app-stats', AppStats);
