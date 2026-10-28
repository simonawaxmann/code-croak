// Fake auth for the prototype. No hashing, no security.
import { getAll, get, create } from './data.js';

const SESSION_KEY = 'app:session';

export async function signup({ name, email, password }) {
  if (!name || !email || !password) throw new Error('Please fill in all fields.');
  const users = await getAll('users');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('There is already an account with this email.');
  }
  const user = await create('users', {
    name,
    email,
    password,
    level: 'Beginner',
    language: 'JavaScript',
    goal: 3,
    streak: 0,
    points: 0,
    lastActive: null,
    onboarded: false,
  });
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

/** "Try for free": a guest account, so nobody has to sign up before seeing the app. */
export async function tryAsGuest() {
  const id = crypto.randomUUID().slice(0, 8);
  return signup({ name: 'Guest HiFi Prototype Test', email: `guest-${id}@codecroak.app`, password: id });
}

export async function login(email, password) {
  const users = await getAll('users');
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) throw new Error('Email or password is not correct.');
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function currentUser() {
  const id = localStorage.getItem(SESSION_KEY);
  return id ? get('users', id) : null;
}
