// Step navigation
document.querySelectorAll('.step-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    goToStep(target);
  });
});

document.querySelectorAll('.step-back').forEach(btn => {
  btn.addEventListener('click', () => {
    goToStep(btn.dataset.target);
  });
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

// Donation logic
const presets = document.querySelectorAll('.donation-btn');
const customInput = document.getElementById('customDonation');
const charityPreview = document.getElementById('charityPreview');
const totalAmount = document.getElementById('totalAmount');
let extraDonation = 0;

function updatePreview() {
  const pts = Math.min(5 + extraDonation, 100);
  if (charityPreview) charityPreview.textContent = pts;
  if (totalAmount) totalAmount.textContent = '$' + (5 + extraDonation).toFixed(2);
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

// Form submit
document.getElementById('regForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Registration submitted! (Demo — no backend yet)');
});
