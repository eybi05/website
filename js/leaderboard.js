// Sample data
const PARTICIPANTS = [
  { name: 'A. Zhao', country: '🇨🇳 CN', subject: 'physics', r1: 148, r2: 300, charity: 85 },
  { name: 'N. Kovács', country: '🇭🇺 HU', subject: 'mathematics', r1: 142, r2: 290, charity: 62 },
  { name: 'R. Patel', country: '🇮🇳 IN', subject: 'chemistry', r1: 139, r2: 290, charity: 45 },
  { name: 'S. Müller', country: '🇩🇪 DE', subject: 'physics', r1: 145, r2: 283, charity: 78 },
  { name: 'Y. Kim', country: '🇰🇷 KR', subject: 'biology', r1: 138, r2: 287, charity: 38 },
  { name: 'L. Santos', country: '🇧🇷 BR', subject: 'mathematics', r1: 136, r2: 285, charity: 90 },
  { name: 'M. Okonkwo', country: '🇳🇬 NG', subject: 'chemistry', r1: 133, r2: 282, charity: 100 },
  { name: 'F. Dubois', country: '🇫🇷 FR', subject: 'physics', r1: 141, r2: 279, charity: 55 },
  { name: 'T. Nakamura', country: '🇯🇵 JP', subject: 'biology', r1: 130, r2: 284, charity: 42 },
  { name: 'E. Petrov', country: '🇷🇺 RU', subject: 'mathematics', r1: 137, r2: 276, charity: 60 },
  { name: 'A. Hassan', country: '🇪🇬 EG', subject: 'chemistry', r1: 129, r2: 280, charity: 35 },
  { name: 'P. Kowalski', country: '🇵🇱 PL', subject: 'physics', r1: 135, r2: 272, charity: 48 },
  { name: 'C. Torres', country: '🇲🇽 MX', subject: 'biology', r1: 128, r2: 278, charity: 52 },
  { name: 'B. Nguyen', country: '🇻🇳 VN', subject: 'mathematics', r1: 132, r2: 271, charity: 30 },
  { name: 'K. Ivanova', country: '🇧🇬 BG', subject: 'chemistry', r1: 126, r2: 274, charity: 66 },
];

const COUNTRIES = [
  { country: '🇨🇳 China', participants: 1240, avg: 391, charity: 8400 },
  { country: '🇮🇳 India', participants: 980, avg: 378, charity: 6200 },
  { country: '🇺🇸 United States', participants: 870, avg: 382, charity: 9100 },
  { country: '🇩🇪 Germany', participants: 420, avg: 385, charity: 4800 },
  { country: '🇧🇷 Brazil', participants: 390, avg: 368, charity: 5600 },
  { country: '🇰🇷 South Korea', participants: 360, avg: 388, charity: 3900 },
  { country: '🇫🇷 France', participants: 310, avg: 375, charity: 4200 },
  { country: '🇯🇵 Japan', participants: 290, avg: 380, charity: 3600 },
  { country: '🇳🇬 Nigeria', participants: 240, avg: 362, charity: 5100 },
  { country: '🇵🇱 Poland', participants: 210, avg: 373, charity: 3100 },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function rankBadge(i) {
  if (i === 0) return `<span class="rank-badge rank-1">1</span>`;
  if (i === 1) return `<span class="rank-badge rank-2">2</span>`;
  if (i === 2) return `<span class="rank-badge rank-3">3</span>`;
  return `<span class="rank-badge rank-other">${i + 1}</span>`;
}

function buildIndividual(filter, round, search) {
  let data = [...PARTICIPANTS];
  if (filter !== 'all') data = data.filter(p => p.subject === filter);
  if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  data.sort((a, b) => {
    if (round === 'round1') return b.r1 - a.r1;
    if (round === 'round2') return b.r2 - a.r2;
    return (b.r1 + b.r2) - (a.r1 + a.r2);
  });

  return data.map((p, i) => `
    <tr>
      <td>${rankBadge(i)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${p.name}</td>
      <td>${p.country}</td>
      <td style="text-transform:capitalize">${p.subject}</td>
      <td>${p.r1}</td>
      <td>${p.r2}</td>
      <td class="score-total">${p.r1 + p.r2}</td>
      <td class="charity-pts">${p.charity} pts</td>
    </tr>
  `).join('');
}

function buildCountry() {
  return COUNTRIES.map((c, i) => `
    <tr>
      <td>${rankBadge(i)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${c.country}</td>
      <td>${c.participants.toLocaleString()}</td>
      <td class="score-total">${c.avg}</td>
      <td class="charity-pts">${c.charity.toLocaleString()} pts</td>
    </tr>
  `).join('');
}

function buildCharity() {
  const data = [...PARTICIPANTS].sort((a, b) => b.charity - a.charity);
  return data.map((p, i) => `
    <tr>
      <td>${rankBadge(i)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${p.name}</td>
      <td>${p.country}</td>
      <td class="charity-pts">${p.charity} pts</td>
      <td style="color:var(--accent-gold)">$${p.charity}.00</td>
    </tr>
  `).join('');
}

function buildImpact() {
  const data = [...PARTICIPANTS].map(p => ({
    ...p,
    total: p.r1 + p.r2,
    impact: Math.round((p.r1 + p.r2) / 450 * 70 + p.charity / 100 * 30),
  })).sort((a, b) => b.impact - a.impact);

  return data.map((p, i) => `
    <tr>
      <td>${rankBadge(i)}</td>
      <td style="font-weight:600;color:var(--text-primary)">${p.name}</td>
      <td>${p.country}</td>
      <td>${p.total}</td>
      <td class="charity-pts">${p.charity} pts</td>
      <td class="impact-score">${p.impact}</td>
    </tr>
  `).join('');
}

// Render
const lbBody = document.getElementById('lbBody');
const countryBody = document.getElementById('countryBody');
const charityBody = document.getElementById('charityBody');
const impactBody = document.getElementById('impactBody');

function renderIndividual() {
  const filter = document.getElementById('subjectFilter')?.value || 'all';
  const round = document.getElementById('roundFilter')?.value || 'overall';
  const search = document.getElementById('lbSearch')?.value || '';
  if (lbBody) lbBody.innerHTML = buildIndividual(filter, round, search);
}

if (countryBody) countryBody.innerHTML = buildCountry();
if (charityBody) charityBody.innerHTML = buildCharity();
if (impactBody) impactBody.innerHTML = buildImpact();
renderIndividual();

document.getElementById('subjectFilter')?.addEventListener('change', renderIndividual);
document.getElementById('roundFilter')?.addEventListener('change', renderIndividual);
document.getElementById('lbSearch')?.addEventListener('input', renderIndividual);

// Tab switching
const tabs = document.querySelectorAll('.lb-tab');
const tables = {
  individual: document.getElementById('lbTable')?.closest('.lb-table-wrap'),
  country: document.getElementById('countryTable'),
  charity: document.getElementById('charityTable'),
  impact: document.getElementById('impactTable'),
};
const filters = document.getElementById('individualFilters');
const podium = document.getElementById('podium');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('lb-tab--active'));
    tab.classList.add('lb-tab--active');
    const active = tab.dataset.tab;

    Object.keys(tables).forEach(k => {
      tables[k]?.classList.toggle('hidden', k !== active);
    });

    if (filters) filters.style.display = active === 'individual' ? 'flex' : 'none';
    if (podium) podium.style.display = active === 'individual' ? 'flex' : 'none';
  });
});
