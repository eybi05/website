document.getElementById('forgotForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn     = e.submitter;
  const errorEl = document.getElementById('fpError');
  const successEl = document.getElementById('successMsg');
  const email   = document.getElementById('fpEmail').value.trim();

  if (errorEl) errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password.html',
  });

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Send Reset Link';
    return;
  }

  if (successEl) successEl.style.display = '';
  btn.textContent = 'Sent!';
});
