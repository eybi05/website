// Live feed data
const FEED = [
  { name: 'M. Okonkwo', country: '🇳🇬', amount: 50, mins: 2 },
  { name: 'Anonymous', country: '🌍', amount: 25, mins: 8 },
  { name: 'S. Müller', country: '🇩🇪', amount: 100, mins: 14 },
  { name: 'L. Santos', country: '🇧🇷', amount: 20, mins: 21 },
  { name: 'Y. Kim', country: '🇰🇷', amount: 10, mins: 35 },
  { name: 'T. Nakamura', country: '🇯🇵', amount: 30, mins: 48 },
  { name: 'Anonymous', country: '🌍', amount: 15, mins: 62 },
];

const TOP = [
  { name: 'S. Müller', country: '🇩🇪', total: 420 },
  { name: 'L. Santos', country: '🇧🇷', total: 380 },
  { name: 'M. Okonkwo', country: '🇳🇬', total: 310 },
  { name: 'Anonymous', country: '🌍', total: 260 },
  { name: 'Y. Kim', country: '🇰🇷', total: 190 },
];

const feed = document.getElementById('donFeed');
if (feed) {
  feed.innerHTML = FEED.map(d => `
    <div class="don-feed-item">
      <span>${d.country}</span>
      <span class="don-feed-item__name">${d.name}</span>
      <span class="don-feed-item__amount">$${d.amount}</span>
      <span class="don-feed-item__time">${d.mins}m ago</span>
    </div>
  `).join('');
}

const topList = document.getElementById('donTopList');
if (topList) {
  topList.innerHTML = TOP.map((d, i) => {
    const cls = i < 3 ? `don-top__rank--${i + 1}` : 'don-top__rank--n';
    return `
      <li>
        <div class="don-top__rank ${cls}">${i + 1}</div>
        <span class="don-top__name">${d.country} ${d.name}</span>
        <span class="don-top__amt">$${d.total}</span>
      </li>
    `;
  }).join('');
}

// Preset selection
let donAmount = 25;
const presets = document.querySelectorAll('.don-preset');
const donInput = document.getElementById('donAmount');
const donPts = document.getElementById('donPts');

function updatePts(amt) {
  const pts = Math.min(amt, 95);
  if (donPts) donPts.textContent = pts;
}

presets.forEach(btn => {
  btn.addEventListener('click', () => {
    presets.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    donAmount = parseInt(btn.dataset.amount, 10);
    if (donInput) donInput.value = donAmount;
    updatePts(donAmount);
  });
});

donInput?.addEventListener('input', () => {
  presets.forEach(b => b.classList.remove('active'));
  donAmount = Math.max(1, parseInt(donInput.value, 10) || 1);
  updatePts(donAmount);
});

// Default: highlight $25
presets.forEach(b => {
  if (parseInt(b.dataset.amount, 10) === 25) b.classList.add('active');
});

document.getElementById('donForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert(`Thank you! Your donation of $${donAmount} is being processed. (Demo only — no payment backend yet)`);
});
