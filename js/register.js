// Step navigation
document.querySelectorAll('.step-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    if (target === '2') {
      const fullName = document.getElementById('fullName').value.trim();
      const email    = document.getElementById('email').value.trim();
      const country  = document.getElementById('country').value;
      const school   = document.getElementById('school').value.trim();
      const password = document.getElementById('password').value;
      const confirm  = document.getElementById('confirm').value;

      if (!fullName || !email || !country || !school || !password) {
        alert('Please fill in all required fields.');
        return;
      }
      if (password.length < 8) {
        alert('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirm) {
        alert('Passwords do not match.');
        return;
      }
    }

    if (target === '3') {
      if (!document.querySelector('input[name="subject"]:checked')) {
        alert('Please select a subject.');
        return;
      }
    }

    goToStep(target);
  });
});

document.querySelectorAll('.step-back').forEach(btn => {
  btn.addEventListener('click', () => goToStep(btn.dataset.target));
});

function goToStep(n) {
  document.querySelectorAll('.reg-form__step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + n)?.classList.remove('hidden');

  document.querySelectorAll('.reg-step').forEach(s => {
    const sn = parseInt(s.dataset.step, 10);
    const tn = parseInt(n, 10);
    s.classList.toggle('reg-step--active', sn === tn);
    s.classList.toggle('reg-step--done', sn < tn);
  });
}

// Donation preview
const presets      = document.querySelectorAll('.donation-btn');
const customInput  = document.getElementById('customDonation');
const charityPreview = document.getElementById('charityPreview');
const totalAmount  = document.getElementById('totalAmount');
let extraDonation  = 0;

function updatePreview() {
  const pts = Math.min(5 + extraDonation, 100);
  if (charityPreview) charityPreview.textContent = pts;
  if (totalAmount)    totalAmount.textContent = '$' + (5 + extraDonation).toFixed(2);
}

presets.forEach(btn => {
  btn.addEventListener('click', () => {
    presets.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    extraDonation = parseInt(btn.dataset.amount, 10);
    if (customInput) customInput.value = '';
    updatePreview();
  });
});

customInput?.addEventListener('input', () => {
  presets.forEach(b => b.classList.remove('active'));
  extraDonation = Math.max(0, parseInt(customInput.value, 10) || 0);
  updatePreview();
});

// Form submit — saves to Supabase
document.getElementById('regForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn     = e.submitter;
  const errorEl = document.getElementById('regError');

  const fullName = document.getElementById('fullName').value.trim();
  const email    = document.getElementById('email').value.trim();
  const country  = document.getElementById('country').value;
  const school   = document.getElementById('school').value.trim();
  const password = document.getElementById('password').value;
  const referral = document.getElementById('referral').value.trim();
  const subject  = document.querySelector('input[name="subject"]:checked')?.value;

  if (errorEl) errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Registering…';

  // Create auth account
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    btn.disabled = false;
    btn.textContent = 'Complete Registration →';
    return;
  }

  // Save profile to database
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
    btn.textContent = 'Complete Registration →';
    return;
  }

  window.location.href = 'login.html?registered=1';
});
