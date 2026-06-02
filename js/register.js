document.getElementById('regForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn      = e.submitter;
  const errorEl  = document.getElementById('regError');

  const fullName = document.getElementById('fullName').value.trim();
  const email    = document.getElementById('email').value.trim();
  const country  = document.getElementById('country').value;
  const school   = document.getElementById('school').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;
  const referral = document.getElementById('referral').value.trim();
  const subject  = document.querySelector('input[name="subject"]:checked')?.value;

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
  if (!subject) {
    if (errorEl) errorEl.textContent = 'Please select a subject.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Registering…';

  const { data, error } = await db.auth.signUp({ email, password });

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Register Now →';
    return;
  }

  const { error: profileError } = await db.from('profiles').insert({
    id:            data.user.id,
    full_name:     fullName,
    country,
    school,
    subject,
    referral_code: referral || null,
    charity_points: 5,
  });

  if (profileError) {
    if (errorEl) errorEl.textContent = profileError.message;
    btn.disabled = false;
    btn.textContent = 'Register Now →';
    return;
  }

  window.location.href = 'login.html?registered=1';
});
