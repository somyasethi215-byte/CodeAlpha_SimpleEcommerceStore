// public/js/common.js
// Shared helpers used by every page: a small fetch wrapper and the header/nav.

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

async function getCurrentUser() {
  const { user } = await api('/auth/me');
  return user;
}

async function renderHeader() {
  const nav = document.getElementById('nav-links');
  if (!nav) return;

  const user = await getCurrentUser();

  nav.innerHTML = `
    <a href="/index.html">Shop</a>
    ${user ? `<a href="/cart.html">Cart</a><a href="/orders.html">My Orders</a>` : ''}
    ${
      user
        ? `<span>Hi, ${escapeHtml(user.name)}</span><button id="logout-btn">Log out</button>`
        : `<a href="/login.html">Log in</a><a href="/register.html">Register</a>`
    }
  `;

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await api('/auth/logout', { method: 'POST' });
      window.location.href = '/index.html';
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatPrice(n) {
  return `Rs. ${Number(n).toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', renderHeader);
