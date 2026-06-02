document.getElementById('resetForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn      = e.submitter;
  const errorEl  = document.getElementById('resetError');
  const newPw    = document.getElementById('newPw').value;
  const confirmPw = document.getElementById('confirmPw').value;

  if (errorEl) errorEl.textContent = '';

  if (newPw.length < 8) {
    if (errorEl) errorEl.textContent = 'Password must be at least 8 characters.';
    return;
  }
  if (newPw !== confirmPw) {
    if (errorEl) errorEl.textContent = 'Passwords do not match.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Updating…';

  const { error } = await db.auth.updateUser({ password: newPw });

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Update Password';
    return;
  }

  window.location.href = 'login.html?reset=1';
});
