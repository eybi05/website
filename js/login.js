// Redirect away if already logged in
db.auth.getUser().then(({ data: { user } }) => {
  if (user) window.location.href = 'index.html';
});

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn     = e.submitter;
  const errorEl = document.getElementById('loginError');
  const email   = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (errorEl) errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  const { error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Sign In →';
    return;
  }

  window.location.href = 'index.html';
});
