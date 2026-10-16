(() => {
  const form = document.getElementById('login-form');
  const button = document.getElementById('submit-btn');
  const label = document.getElementById('btn-label');
  const email = document.getElementById('identifier');
  const password = document.getElementById('password');

  document.querySelectorAll('.role-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.role-tab').forEach(item => {
      const selected = item === tab;
      item.classList.toggle('bg-white', selected);
      item.classList.toggle('shadow-sm', selected);
      item.classList.toggle('text-primary', selected);
      item.classList.toggle('font-bold', selected);
      item.classList.toggle('text-on-surface-variant', !selected);
    });
    email.placeholder = tab.dataset.role === 'pro'
      ? 'e.g. nca-pro@buildkenya.com'
      : 'e.g. kelvin@example.com';
  }));

  document.getElementById('toggle-pw').addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    document.getElementById('toggle-pw-icon').textContent = show ? 'visibility_off' : 'visibility';
  });

  const error = document.createElement('p');
  error.id = 'login-error';
  error.className = 'hidden rounded-xl border border-error/30 bg-error/5 px-3 py-2 text-sm text-error';
  error.setAttribute('role', 'alert');
  form.insertBefore(error, form.querySelector('button[type="submit"]'));

  if (new URLSearchParams(window.location.search).get('registered') === '1') {
    error.textContent = 'Account created. Sign in with your new account.';
    error.className = 'rounded-xl border border-secondary/30 bg-secondary/5 px-3 py-2 text-sm text-secondary';
  }
  let storedLoginError = null;
  try {
    storedLoginError = window.sessionStorage.getItem('nestsphere_login_error');
    window.sessionStorage.removeItem('nestsphere_login_error');
  } catch {
    // The URL error parameter remains available when browser storage is blocked.
  }
  const loginError = new URLSearchParams(window.location.search).get('error') || storedLoginError;
  if (loginError === 'file-protocol') {
    error.textContent = 'Please open NestSphere through its local web address (for example, http://localhost:3000), not as a file. Browser sign-in cookies require HTTP.';
    error.classList.remove('hidden');
  } else if (loginError === 'session-required') {
    error.textContent = 'Your sign-in session was not available to the dashboard. Sign in again using the same local web address.';
    error.classList.remove('hidden');
  } else if (loginError === 'service-unavailable') {
    error.textContent = 'The dashboard could not reach the sign-in service. Please try again.';
    error.classList.remove('hidden');
  }

  function redirectToDashboard() {
    window.location.assign(window.NESTSPHERE_DASHBOARD_URL || 'js/dashboard/');
  }

  async function redirectIfAuthenticated() {
    try {
      const response = await fetch(`${window.NESTSPHERE_API_URL}/api/auth/session`, {
        credentials: 'include'
      });
      if (response.ok) redirectToDashboard();
    } catch {
      error.textContent = 'Cannot reach the sign-in service. Check that the backend is running.';
      error.classList.remove('hidden');
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    error.classList.add('hidden');
    button.disabled = true;
    label.textContent = 'Signing in...';

    try {
      const response = await fetch(`${window.NESTSPHERE_API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      });
      const result = await response.json();
      if (!response.ok) {
        error.textContent = result.error || 'Sign-in failed. Check your details and try again.';
        error.classList.remove('hidden');
        return;
      }
      redirectToDashboard();
    } catch {
      error.textContent = 'Cannot reach the sign-in service. Check that the backend is running.';
      error.classList.remove('hidden');
    } finally {
      button.disabled = false;
      label.textContent = 'Sign in';
    }
  });

  redirectIfAuthenticated();
})();
