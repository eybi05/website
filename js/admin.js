const ADMIN_EMAIL = 'haciyevamal7@gmail.com';

(async () => {
  const { data: { user } } = await db.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('navLogoutBtn').style.display = '';
  document.getElementById('navLogoutBtn').addEventListener('click', async () => {
    await db.auth.signOut();
    window.location.href = 'index.html';
  });

  // Load all profiles
  const { data: profiles, count: regCount } = await db
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  document.getElementById('statReg').textContent = regCount ?? 0;

  const regTable = document.getElementById('regTable');
  if (profiles?.length) {
    regTable.innerHTML = profiles.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td style="font-weight:600;color:var(--text-primary)">${p.full_name || '—'}</td>
        <td>—</td>
        <td>${p.country || '—'}</td>
        <td>${p.school || '—'}</td>
        <td>${p.subject || '—'}</td>
        <td>${p.charity_points ?? 5}</td>
        <td style="font-family:monospace;color:var(--accent-blue)">${p.referral_code || '—'}</td>
        <td>${p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
      </tr>`).join('');
  } else {
    regTable.innerHTML = '<tr><td colspan="9" class="admin-empty">No registrations yet</td></tr>';
  }

  // Load donations
  const { data: donations, count: donCount } = await db
    .from('donations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const total = donations?.reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  document.getElementById('statDon').textContent    = donCount ?? 0;
  document.getElementById('statRaised').textContent = '$' + total.toLocaleString();

  const donTable = document.getElementById('donTable');
  if (donations?.length) {
    donTable.innerHTML = donations.map((d, i) => `
      <tr>
        <td>${i + 1}</td>
        <td style="color:var(--text-primary)">${d.is_anonymous ? 'Anonymous' : (d.donor_name || '—')}</td>
        <td style="font-weight:700;color:var(--accent-gold)">$${Number(d.amount).toFixed(2)}</td>
        <td>${d.is_anonymous ? 'Yes' : 'No'}</td>
        <td>${new Date(d.created_at).toLocaleDateString()}</td>
      </tr>`).join('');
  } else {
    donTable.innerHTML = '<tr><td colspan="5" class="admin-empty">No donations yet</td></tr>';
  }

  // Referral count
  const { count: refCount } = await db
    .from('referrals')
    .select('*', { count: 'exact', head: true });
  document.getElementById('statRef').textContent = refCount ?? 0;
})();
