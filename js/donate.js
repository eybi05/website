let donAmount = 25;

// ── Amount tiles ──
const tiles = document.querySelectorAll('.don-tile[data-amount]');
const customInput = document.getElementById('donAmount');

function setAmount(amt) {
  donAmount = amt;
  tiles.forEach(t => t.classList.remove('active'));
  updatePts(amt);
}

tiles.forEach(tile => {
  tile.addEventListener('click', () => {
    setAmount(parseInt(tile.dataset.amount, 10));
    tile.classList.add('active');
    if (customInput) customInput.value = '';
  });
});

customInput?.addEventListener('input', () => {
  tiles.forEach(t => t.classList.remove('active'));
  donAmount = Math.max(5, parseInt(customInput.value, 10) || 5);
  updatePts(donAmount);
});

// Default highlight $25
document.querySelector('.don-tile--featured')?.classList.add('active');

function updatePts(amt) {
  const el = document.getElementById('donPts');
  if (el) el.textContent = Math.min(amt, 95);
}
updatePts(25);

// ── Load data from Supabase ──
async function loadStats() {
  const { data, count } = await db
    .from('donations')
    .select('amount', { count: 'exact' });

  if (!data) return;

  const total = data.reduce((sum, d) => sum + Number(d.amount), 0);
  const goal  = 75000;
  const pct   = Math.min((total / goal) * 100, 100);

  const raisedEl = document.getElementById('raisedAmount');
  const pctEl    = document.getElementById('progressPct');
  const fillEl   = document.getElementById('progressFill');
  const countEl  = document.getElementById('donorCount');

  if (raisedEl) raisedEl.textContent = '$' + total.toLocaleString();
  if (pctEl)    pctEl.textContent    = pct.toFixed(1) + '%';
  if (fillEl)   fillEl.style.width   = pct.toFixed(1) + '%';
  if (countEl)  countEl.textContent  = (count || 0).toLocaleString() + ' donors';
}

async function loadFeed() {
  const { data } = await db
    .from('donations')
    .select('donor_name, amount, is_anonymous, created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  const feed = document.getElementById('donFeed');
  if (!feed || !data?.length) return;

  feed.innerHTML = data.map(d => {
    const name = d.is_anonymous ? 'Anonymous' : (d.donor_name || 'Anonymous');
    const mins = Math.round((Date.now() - new Date(d.created_at)) / 60000);
    const time = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
    return `
      <div class="don-feed-item">
        <span>🌍</span>
        <span class="don-feed-item__name">${name}</span>
        <span class="don-feed-item__amount">$${Number(d.amount).toFixed(0)}</span>
        <span class="don-feed-item__time">${time}</span>
      </div>`;
  }).join('');
}

async function loadTopDonors() {
  const { data } = await db
    .from('donations')
    .select('donor_name, amount')
    .eq('is_anonymous', false)
    .order('amount', { ascending: false })
    .limit(5);

  const list = document.getElementById('donTopList');
  if (!list || !data?.length) return;

  list.innerHTML = data.map((d, i) => {
    const cls = i < 3 ? `don-top__rank--${i + 1}` : 'don-top__rank--n';
    return `
      <li>
        <div class="don-top__rank ${cls}">${i + 1}</div>
        <span class="don-top__name">${d.donor_name || 'Anonymous'}</span>
        <span class="don-top__amt">$${Number(d.amount).toFixed(0)}</span>
      </li>`;
  }).join('');
}

// ── Form submit ──
document.getElementById('donForm')?.addEventListener('submit', async e => {
  e.preventDefault();

  const btn     = e.submitter;
  const errorEl = document.getElementById('donError');
  const name    = document.getElementById('donName')?.value.trim();
  const email   = document.getElementById('donEmail')?.value.trim();
  const anon    = document.getElementById('donAnon')?.checked;

  if (errorEl) errorEl.textContent = '';

  if (donAmount < 5) {
    if (errorEl) errorEl.textContent = 'Minimum donation is $5.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Processing…';

  const { data: { user } } = await db.auth.getUser();

  const { error } = await db.from('donations').insert({
    user_id:      user?.id ?? null,
    donor_name:   anon ? null : (name || null),
    donor_email:  email || null,
    amount:       donAmount,
    is_anonymous: anon ?? false,
  });

  if (error) {
    if (errorEl) errorEl.textContent = 'Something went wrong. Please try again.';
    btn.disabled = false;
    btn.innerHTML = '<span>Donate Now</span>';
    return;
  }

  btn.innerHTML = '<span>Thank you!</span>';

  // Refresh stats and feed
  await Promise.all([loadStats(), loadFeed(), loadTopDonors()]);

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<span>Donate Now</span>';
    document.getElementById('donForm')?.reset();
    document.querySelector('.don-tile--featured')?.classList.add('active');
    donAmount = 25;
    updatePts(25);
  }, 3000);
});

// ── Init ──
loadStats();
loadFeed();
loadTopDonors();
