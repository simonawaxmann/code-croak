// Hash router with an auth guard. Each view exports render(el, params) and optional destroy().
import { currentUser } from './auth.js';

const routes = [
  { pattern: '/', view: () => import('./views/home.js'), auth: true, title: 'Home', tab: 'home' },
  { pattern: '/learn', view: () => import('./views/learn.js'), auth: true, title: 'Learn', tab: 'learn' },
  { pattern: '/learn/:id', view: () => import('./views/chapter.js'), auth: true, title: 'Study chapter', tab: 'learn' },
  { pattern: '/lessons/:id', view: () => import('./views/lesson.js'), auth: true, title: 'Lesson overview', tab: 'home' },
  { pattern: '/lessons/:id/context', view: () => import('./views/context.js'), auth: true, title: 'Exercise context', tab: 'home' },
  { pattern: '/lessons/:id/review', view: () => import('./views/review.js'), auth: true, title: 'Review the code', tab: 'home' },
  { pattern: '/lessons/:id/decide', view: () => import('./views/decide.js'), auth: true, title: 'Final decision', tab: 'home' },
  { pattern: '/lessons/:id/feedback', view: () => import('./views/feedback.js'), auth: true, title: 'Your results', tab: 'home' },
  { pattern: '/lessons/:id/explanation/:issue', view: () => import('./views/explanation.js'), auth: true, title: 'Explanation', tab: 'home' },
  { pattern: '/lessons/:id/expert', view: () => import('./views/expert.js'), auth: true, title: 'Expert example', tab: 'home' },
  { pattern: '/lessons/:id/complete', view: () => import('./views/complete.js'), auth: true, title: 'Lesson complete', tab: 'home' },
  { pattern: '/progress', view: () => import('./views/progress.js'), auth: true, title: 'Progress', tab: 'progress' },
  { pattern: '/profile', view: () => import('./views/profile.js'), auth: true, title: 'Profile', tab: 'profile' },
  { pattern: '/settings', view: () => import('./views/settings.js'), auth: true, title: 'Settings', tab: 'profile' },
  { pattern: '/onboarding', view: () => import('./views/onboarding.js'), auth: true, title: 'Get started', shell: false },
  { pattern: '/login', view: () => import('./views/login.js'), auth: false, title: 'Log in', shell: false },
  { pattern: '/signup', view: () => import('./views/signup.js'), auth: false, title: 'Create account', shell: false },
];

let current = null;
let onRender = () => {};

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { path, query: new URLSearchParams(query) };
}

function match(path) {
  const parts = path.split('/').filter(Boolean);
  for (const route of routes) {
    const pattern = route.pattern.split('/').filter(Boolean);
    if (pattern.length !== parts.length) continue;
    const params = {};
    const ok = pattern.every((seg, i) => {
      if (seg.startsWith(':')) {
        params[seg.slice(1)] = decodeURIComponent(parts[i]);
        return true;
      }
      return seg === parts[i];
    });
    if (ok) return { route, params };
  }
  return null;
}

export function go(path) {
  location.hash = `#${path}`;
}

async function resolve() {
  const { path, query } = parseHash();
  const found = match(path);
  if (!found) return go('/');

  const { route, params } = found;
  const user = await currentUser();
  if (route.auth && !user) return go(`/login?next=${encodeURIComponent(path)}`);
  if (!route.auth && user && route.pattern !== '/onboarding') return go('/');

  const el = document.querySelector('#app');
  current?.module?.destroy?.();
  el.replaceChildren();

  const module = await route.view();
  current = { route, module };
  await module.render(el, { ...params, query, user });

  document.title = `${route.title} · Code Croak`;
  await onRender({ route, user: await currentUser() });

  window.scrollTo(0, 0);
  const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

export function startRouter(callback) {
  onRender = callback ?? onRender;
  window.addEventListener('hashchange', resolve);
  resolve();
}

/** Re-render the current route (used after data changes, e.g. reset). */
export const refresh = resolve;
