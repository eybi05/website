const SITE = window.location.origin;

(async () => {
  const { data: { user } } = await db.auth.getUser();
  if (!user) { window.location.href = 'login.html'; return; }

  const { data: profile } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return;

  // Header
  const nameEl = document.getElementById('dashName');
  if (nameEl) nameEl.textContent = profile.full_name?.split(' ')[0] || user.email.split('@')[0];

  // Stats
  document.getElementById('dashPoints').textContent  = profile.charity_points ?? 5;

  // Count referrals made
  const { count: refCount } = await db
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', user.id);
  document.getElementById('dashReferrals').textContent = refCount ?? 0;

  // Referral code
  const code = profile.referral_code || '—';
  const link = `${SITE}/register.html?ref=${code}`;
  document.getElementById('dashRefCode').textContent = code;
  document.getElementById('dashRefLink').textContent = link;

  // Copy buttons
  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = btn.id === 'copyCodeBtn' ? 'Copy code' : 'Copy link'; btn.classList.remove('copied'); }, 2000);
    });
  }

  document.getElementById('copyCodeBtn')?.addEventListener('click', e => copyText(code, e.currentTarget));
  document.getElementById('copyLinkBtn')?.addEventListener('click', e => copyText(link, e.currentTarget));

  // Profile fields
  document.getElementById('dashFullName').textContent = profile.full_name || '—';
  document.getElementById('dashCountry').textContent  = profile.country  || '—';
  document.getElementById('dashSchool').textContent   = profile.school   || '—';
  document.getElementById('dashSubject').textContent  = profile.subject
    ? profile.subject.charAt(0).toUpperCase() + profile.subject.slice(1)
    : 'Not selected — pick on Exam page';
  document.getElementById('dashDate').textContent     = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
    : '—';
})();
