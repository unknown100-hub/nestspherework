(() => {
  const form = document.getElementById('register-form');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm');
  const bars = [...document.querySelectorAll('.bar')];
  const strengthText = document.getElementById('strength-text');
  const error = document.getElementById('form-error');
  const submit = form.querySelector('button[type="submit"]');

  document.querySelectorAll('input[name="role"]').forEach(radio => radio.addEventListener('change', () => {
    document.getElementById('pro-notice').classList.toggle('hidden', radio.value !== 'contractor' || !radio.checked);
  }));

  password.addEventListener('input', () => {
    const value = password.value;
    const strength = [
      value.length >= 10,
      /[a-z]/.test(value) && /[A-Z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value)
    ].filter(Boolean).length;
    const colors = ['bg-surface-container', 'bg-error', 'bg-secondary', 'bg-primary'];
    bars.forEach((bar, index) => {
      bar.className = 'bar h-1 flex-1 rounded-full '
        + (index < Math.ceil(strength * bars.length / 4) ? colors[strength] : 'bg-surface-container');
    });
    strengthText.textContent = ['Strength', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  });

  document.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.toggle);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.querySelector('span').textContent = show ? 'visibility_off' : 'visibility';
  }));

  function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    error.classList.add('hidden');

    if (password.value !== confirmPassword.value) {
      showError('Passwords do not match. Re-enter both fields.');
      return;
    }

    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    try {
      const selectedRole = form.querySelector('input[name="role"]:checked').value;
      const response = await fetch(`${window.NESTSPHERE_API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: `+254${document.getElementById('phone').value.trim().replace(/^0+/, '')}`,
          location: document.getElementById('county').value,
          role: selectedRole === 'contractor' ? 'contractor' : 'client',
          password: password.value
        })
      });
      const result = await response.json();
      if (!response.ok) {
        showError(result.error || 'Registration failed. Check your details and try again.');
        return;
      }
      window.location.assign('login.html?registered=1');
    } catch {
      showError('Cannot reach the registration service. Check that the backend is running.');
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });
})();
