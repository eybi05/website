// Demo data for academic tabs (real exam scores don't exist yet)
const DEMO = [
  { name: 'A. Zhao',     country: '🇨🇳 CN', subject: 'physics',     r1: 148, r2: 300, charity: 85 },
  { name: 'N. Kovács',   country: '🇭🇺 HU', subject: 'mathematics', r1: 142, r2: 290, charity: 62 },
  { name: 'R. Patel',    country: '🇮🇳 IN', subject: 'chemistry',   r1: 139, r2: 290, charity: 45 },
  { name: 'S. Müller',   country: '🇩🇪 DE', subject: 'physics',     r1: 145, r2: 283, charity: 78 },
  { name: 'Y. Kim',      country: '🇰🇷 KR', subject: 'biology',     r1: 138, r2: 287, charity: 38 },
  { name: 'L. Santos',   country: '🇧🇷 BR', subject: 'mathematics', r1: 136, r2: 285, charity: 90 },
  { name: 'M. Okonkwo',  country: '🇳🇬 NG', subject: 'chemistry',   r1: 133, r2: 282, charity: 100 },
  { name: 'F. Dubois',   country: '🇫🇷 FR', subject: 'physics',     r1: 141, r2: 279, charity: 55 },
  { name: 'T. Nakamura', country: '🇯🇵 JP', subject: 'biology',     r1: 130, r2: 284, charity: 42 },
  { name: 'E. Petrov',   country: '🇷🇺 RU', subject: 'mathematics', r1: 137, r2: 276, charity: 60 },
];

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase(); }

function rankBadge(i) {
  if (i===0) return `<span class="rank-badge rank-1">1</span>`;
  if (i===1) return `<span class="rank-badge rank-2">2</span>`;
  if (i===2) return `<span class="rank-badge rank-3">3</span>`;
  return `<span class="rank-badge rank-other">${i+1}</span>`;
}

// ── ACADEMIC tabs (demo data) ──
function buildIndividual(filter, round, search) {
  let data = [...DEMO];
  if (filter !== 'all') data = data.filter(p => p.subject === filter);
  if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  data.sort((a,b) => round==='round1' ? b.r1-a.r1 : round==='round2' ? b.r2-a.r2 : (b.r1+b.r2)-(a.r1+a.r2));
  return data.map((p,i) => `<tr>
    <td>${rankBadge(i)}</td>
    <td style="font-weight:600;color:var(--text-primary)">${p.name}</td>
    <td>${p.country}</td>
    <td style="text-transform:capitalize">${p.subject}</td>
    <td>${p.r1}</td><td>${p.r2}</td>
    <td class="score-total">${p.r1+p.r2}</td>
    <td class="charity-pts">${p.charity} pts</td>
  </tr>`).join('');
}

function buildImpact(data) {
  return data.map((p,i) => ({...p, total:p.r1+p.r2, impact:Math.round((p.r1+p.r2)/450*70+p.charity/100*30)}))
    .sort((a,b)=>b.impact-a.impact)
    .map((p,i) => `<tr>
      <td>${rankBadge(i)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${p.name}</td>
      <td>${p.country}</td>
      <td>${p.total}</td>
      <td class="charity-pts">${p.charity} pts</td>
      <td class="impact-score">${p.impact}</td>
    </tr>`).join('');
}

// ── REAL DATA from Supabase ──
async function buildCharityReal() {
  const { data } = await db.from('profiles')
    .select('full_name, country, charity_points, referral_code')
    .order('charity_points', { ascending: false })
    .limit(50);

  if (!data?.length) return buildCharityDemo();

  return data.map((p, i) => `<tr>
    <td>${rankBadge(i)}</td>
    <td style="font-weight:600;color:var(--text-primary)">${p.full_name || 'Anonymous'}</td>
    <td>${p.country || '—'}</td>
    <td class="charity-pts">${p.charity_points ?? 5} pts</td>
    <td style="color:var(--accent-gold)">$${p.charity_points ?? 5}.00</td>
  </tr>`).join('');
}

function buildCharityDemo() {
  return [...DEMO].sort((a,b)=>b.charity-a.charity).map((p,i) => `<tr>
    <td>${rankBadge(i)}</td>
    <td style="font-weight:600;color:var(--text-primary)">${p.name}</td>
    <td>${p.country}</td>
    <td class="charity-pts">${p.charity} pts</td>
    <td style="color:var(--accent-gold)">$${p.charity}.00</td>
  </tr>`).join('');
}

async function buildCountryReal() {
  const { data } = await db.from('profiles')
    .select('country, charity_points')
    .order('created_at', { ascending: true });

  if (!data?.length) return buildCountryDemo();

  const map = {};
  data.forEach(p => {
    const c = p.country || 'Unknown';
    if (!map[c]) map[c] = { country: c, participants: 0, charity: 0 };
    map[c].participants++;
    map[c].charity += p.charity_points ?? 5;
  });

  return Object.values(map)
    .sort((a,b) => b.participants - a.participants)
    .map((c, i) => `<tr>
      <td>${rankBadge(i)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${c.country}</td>
      <td>${c.participants}</td>
      <td class="score-total">—</td>
      <td class="charity-pts">${c.charity} pts</td>
    </tr>`).join('');
}

function buildCountryDemo() {
  const demo = [
    { country:'🇨🇳 China',params:1240,avg:391,charity:8400},
    { country:'🇮🇳 India',params:980,avg:378,charity:6200},
    { country:'🇺🇸 United States',params:870,avg:382,charity:9100},
    { country:'🇩🇪 Germany',params:420,avg:385,charity:4800},
    { country:'🇧🇷 Brazil',params:390,avg:368,charity:5600},
  ];
  return demo.map((c,i)=>`<tr>
    <td>${rankBadge(i)}</td>
    <td style="font-weight:600;color:var(--text-primary)">${c.country}</td>
    <td>${c.params.toLocaleString()}</td>
    <td class="score-total">${c.avg}</td>
    <td class="charity-pts">${c.charity.toLocaleString()} pts</td>
  </tr>`).join('');
}

// ── Render ──
const lbBody      = document.getElementById('lbBody');
const charityBody = document.getElementById('charityBody');
const countryBody = document.getElementById('countryBody');
const impactBody  = document.getElementById('impactBody');

function renderIndividual() {
  const filter = document.getElementById('subjectFilter')?.value || 'all';
  const round  = document.getElementById('roundFilter')?.value  || 'overall';
  const search = document.getElementById('lbSearch')?.value     || '';
  if (lbBody) lbBody.innerHTML = buildIndividual(filter, round, search);
}

async function renderCharity()  { if (charityBody) charityBody.innerHTML = await buildCharityReal(); }
async function renderCountry()  { if (countryBody) countryBody.innerHTML = await buildCountryReal(); }
if (impactBody) impactBody.innerHTML = buildImpact(DEMO);

renderIndividual();
renderCharity();
renderCountry();

document.getElementById('subjectFilter')?.addEventListener('change', renderIndividual);
document.getElementById('roundFilter')?.addEventListener('change', renderIndividual);
document.getElementById('lbSearch')?.addEventListener('input', renderIndividual);

// Tab switching
const tabs   = document.querySelectorAll('.lb-tab');
const tables = {
  individual: document.getElementById('lbTable')?.closest('.lb-table-wrap'),
  country:    document.getElementById('countryTable'),
  charity:    document.getElementById('charityTable'),
  impact:     document.getElementById('impactTable'),
};
const filters = document.getElementById('individualFilters');
const podium  = document.getElementById('podium');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('lb-tab--active'));
    tab.classList.add('lb-tab--active');
    const active = tab.dataset.tab;
    Object.keys(tables).forEach(k => tables[k]?.classList.toggle('hidden', k !== active));
    if (filters) filters.style.display = active === 'individual' ? 'flex' : 'none';
    if (podium)  podium.style.display  = active === 'individual' ? 'flex' : 'none';
  });
});
