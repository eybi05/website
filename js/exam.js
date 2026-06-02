// Auth guard
(async () => {
  const { data: { user } } = await db.auth.getUser();
  if (!user) { window.location.href = 'login.html'; return; }

  // Load saved subject
  const { data: profile } = await db
    .from('profiles')
    .select('subject')
    .eq('id', user.id)
    .single();

  if (profile?.subject) {
    const radio = document.querySelector(`input[name="subject"][value="${profile.subject}"]`);
    if (radio) radio.checked = true;
    const msg = document.getElementById('savedMsg');
    if (msg) msg.textContent = `Current subject: ${profile.subject.charAt(0).toUpperCase() + profile.subject.slice(1)}`;
  }
})();

// Save subject
document.getElementById('saveSubjectBtn')?.addEventListener('click', async () => {
  const subject = document.querySelector('input[name="subject"]:checked')?.value;
  const msg     = document.getElementById('savedMsg');
  const btn     = document.getElementById('saveSubjectBtn');

  if (!subject) {
    if (msg) { msg.textContent = 'Please select a subject first.'; msg.style.color = 'var(--accent-rose)'; }
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving…';

  const { data: { user } } = await db.auth.getUser();
  const { error } = await db.from('profiles').update({ subject }).eq('id', user.id);

  if (error) {
    if (msg) { msg.textContent = 'Failed to save. Try again.'; msg.style.color = 'var(--accent-rose)'; }
  } else {
    if (msg) { msg.textContent = `✓ Subject set to ${subject.charAt(0).toUpperCase() + subject.slice(1)}`; msg.style.color = 'var(--accent-green)'; }
  }

  btn.disabled = false;
  btn.textContent = 'Save Subject';
});

// Countdown to July 15 2026
const TARGET = new Date('2026-07-15T00:00:00');

function tick() {
  const diff = TARGET - Date.now();
  if (diff <= 0) {
    ['cdDays','cdHours','cdMins','cdSecs'].forEach(id => { document.getElementById(id).textContent = '0'; });
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  document.getElementById('cdDays').textContent  = d;
  document.getElementById('cdHours').textContent = String(h).padStart(2,'0');
  document.getElementById('cdMins').textContent  = String(m).padStart(2,'0');
  document.getElementById('cdSecs').textContent  = String(s).padStart(2,'0');
}
tick();
setInterval(tick, 1000);
