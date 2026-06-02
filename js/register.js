document.getElementById('regForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn     = e.submitter;
  const errorEl = document.getElementById('regError');

  const fullName = document.getElementById('fullName').value.trim();
  const email    = document.getElementById('email').value.trim();
  const country  = document.getElementById('country').value;
  const school   = document.getElementById('school').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;
  const referral = document.getElementById('referral').value.trim();

  if (errorEl) errorEl.textContent = '';

  if (!fullName || !email || !country || !school || !password) {
    if (errorEl) errorEl.textContent = 'Please fill in all required fields.';
    return;
  }
  if (password.length < 8) {
    if (errorEl) errorEl.textContent = 'Password must be at least 8 characters.';
    return;
  }
  if (password !== confirm) {
    if (errorEl) errorEl.textContent = 'Passwords do not match.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Registering…';

  // All profile data goes into user metadata — the database trigger creates the profile row
  const { error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name:     fullName,
        country,
        school,
        referral_code: referral || null,
      },
    },
  });

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Register Now →';
    return;
  }

  window.location.href = 'login.html?registered=1';
});
