// Bootstrap: start the router and keep the app shell (top bar + tab bar) in sync.
import { startRouter } from './router.js';
import './components/app-stats.js';

export const state = {};

function updateShell({ route, user }) {
  const showShell = route.shell !== false;
  document.querySelector('#topbar').hidden = !showShell;
  document.querySelector('#tabbar').hidden = !showShell;
  document.body.classList.toggle('no-shell', !showShell);

  const stats = document.querySelector('app-stats');
  if (user && stats) {
    stats.setAttribute('streak', user.streak);
    stats.setAttribute('points', user.points);
  }

  document.querySelectorAll('#tabbar a').forEach((link) => {
    const active = link.dataset.tab === route.tab;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

startRouter(updateShell);
