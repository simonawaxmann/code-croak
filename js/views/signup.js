// Create an account, then go to the onboarding questions.
import { signup } from '../auth.js';
import { go } from '../router.js';
import { on } from '../utils.js';

let offs = [];

export async function render(el) {
  el.innerHTML = `
    <nav class="no-margin">
      <a href="#/login" class="button transparent circle small" aria-label="Back to log in"><i>arrow_back</i></a>
      <div class="max"></div>
    </nav>
    <div class="center-align">
      <img src="assets/frogy.svg" alt="" class="frogy">
      <h4>Create your account</h4>
      <p>Save your progress, streak and points.</p>
    </div>
    <form id="signup-form" novalidate>
      <div class="field label border round">
        <input type="text" name="name" id="name" required autocomplete="name" placeholder=" ">
        <label for="name">Name</label>
        <output class="invalid" hidden>Please fill in your name.</output>
      </div>
      <div class="field label border round">
        <input type="email" name="email" id="email" required autocomplete="email" placeholder=" ">
        <label for="email">Email</label>
        <output class="invalid" hidden>Please fill in a valid email.</output>
      </div>
      <div class="field label border round">
        <input type="password" name="password" id="password" required minlength="6" autocomplete="new-password" placeholder=" ">
        <label for="password">Password</label>
        <output class="invalid" hidden>Use at least 6 characters.</output>
      </div>
      <p id="signup-error" class="error-text" role="alert" hidden></p>
      <button type="submit" class="large primary responsive">Create account</button>
    </form>
    <p class="center-align">Already have an account? <a class="secondary-text bold underline" href="#/login">Log in</a></p>
  `;

  offs = [on(el, 'submit', onSubmit)];

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    form.querySelectorAll('input').forEach((input) => {
      const valid = input.checkValidity();
      input.parentElement.classList.toggle('invalid', !valid);
      input.parentElement.querySelector('output').hidden = valid;
    });
    if (!form.checkValidity()) return;
    try {
      await signup({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value,
      });
      go('/onboarding');
    } catch (err) {
      const error = el.querySelector('#signup-error');
      error.textContent = err.message;
      error.hidden = false;
    }
  }
}

export function destroy() {
  offs.forEach((off) => off());
}
