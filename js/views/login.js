// Entry screen: log in, try for free, or create an account (breadboard: onboarding flow).
import { login, tryAsGuest } from '../auth.js';
import { go } from '../router.js';
import { getAll } from '../data.js';
import { esc, on } from '../utils.js';

let offs = [];

export async function render(el, { query }) {
  const next = query.get('next') || '/';
  const [demo] = await getAll('users');

  el.innerHTML = `
    <div class="center-align">
      <img src="assets/frogy.svg" alt="Frogy, the Code Croak mascot" class="frogy large">
      <h3 class="no-margin">Code Croak</h3>
      <p class="large-text">Practise code reviews, one small exercise at a time.</p>
    </div>

    <form id="login-form" novalidate>
      <div class="field label border round">
        <input type="email" name="email" id="email" required autocomplete="email" placeholder=" ">
        <label for="email">Email</label>
        <output class="invalid" hidden></output>
      </div>
      <div class="field label border round">
        <input type="password" name="password" id="password" required autocomplete="current-password" placeholder=" ">
        <label for="password">Password</label>
        <output class="invalid" hidden></output>
      </div>
      <p id="login-error" class="error-text" role="alert" hidden></p>
      <button type="submit" class="large primary responsive">Log in</button>
    </form>

    <article class="tertiary-container round">
      <div class="row">
        <i>info</i>
        <div class="max">
          <h6 class="small">Demo account</h6>
          <p class="no-margin">${esc(demo.email)} · ${esc(demo.password)}</p>
        </div>
        <button type="button" class="border small" data-action="fill-demo">Use demo</button>
      </div>
    </article>

    <hr class="medium">
    <button type="button" class="large border responsive" data-action="guest">Try for free</button>
    <p class="center-align">New here? <a class="secondary-text bold underline" href="#/signup">Create an account</a></p>
  `;

  offs = [on(el, 'submit', onSubmit), on(el, 'click', onClick)];

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const error = el.querySelector('#login-error');
    const email = form.email.value.trim();
    const password = form.password.value;
    // Every problem gets a message in plain language, so the student knows how to fix it.
    const problems = {
      email: !email ? 'Enter your email address.' : !form.email.checkValidity() ? 'Enter a valid email address.' : '',
      password: !password ? 'Enter your password.' : '',
    };
    ['email', 'password'].forEach((name) => {
      const field = form[name].parentElement;
      const message = field.querySelector('output');
      field.classList.toggle('invalid', Boolean(problems[name]));
      message.textContent = problems[name];
      message.hidden = !problems[name];
    });
    error.hidden = true;
    if (problems.email || problems.password) return;
    try {
      await login(email, password);
      go(next);
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
      form.email.parentElement.classList.add('invalid');
      form.password.parentElement.classList.add('invalid');
    }
  }

  async function onClick(event) {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'fill-demo') {
      const form = el.querySelector('#login-form');
      form.email.value = demo.email;
      form.password.value = demo.password;
    }
    if (action === 'guest') {
      await tryAsGuest();
      go('/onboarding');
    }
  }
}

export function destroy() {
  offs.forEach((off) => off());
}
