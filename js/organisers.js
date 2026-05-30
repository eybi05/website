const SAMPLES = {
  chemistry: {
    icon: '⚗️',
    title: 'Chemistry — Sample Questions',
    questions: [
      {
        type: 'MCQ — Round 1',
        q: 'Which of the following is the correct IUPAC name for the compound CH₃CH(OH)CH₂COOH?',
        options: ['3-hydroxybutanoic acid', '2-hydroxybutanoic acid', '2-methylmalonic acid', '3-methylhydroxyacid'],
        correct: 0,
      },
      {
        type: 'FRQ — Round 2 (excerpt)',
        q: 'A student reacts 0.050 mol of Mg with excess HCl at standard temperature and pressure. (a) Write the balanced equation. (b) Calculate the volume of H₂ gas produced. (c) If the reaction is 78% efficient, what mass of Mg remains unreacted?',
        frq: true,
      },
    ],
  },
  mathematics: {
    icon: '📐',
    title: 'Mathematics — Sample Questions',
    questions: [
      {
        type: 'MCQ — Round 1',
        q: 'How many positive integer solutions does x + y + z = 12 have, where x, y, z ≥ 1?',
        options: ['55', '66', '45', '77'],
        correct: 0,
      },
      {
        type: 'FRQ — Round 2 (excerpt)',
        q: 'Let f: ℤ → ℤ satisfy f(m + n) + f(mn − 1) = f(m)f(n) + 2 for all m, n ∈ ℤ. Find all possible functions f and prove your answer.',
        frq: true,
      },
    ],
  },
  physics: {
    icon: '⚛️',
    title: 'Physics — Sample Questions',
    questions: [
      {
        type: 'MCQ — Round 1',
        q: 'A satellite orbits Earth at height h = R/2 (where R is Earth\'s radius). By what factor does its orbital speed differ from a satellite at h = R?',
        options: ['√(4/3)', '√(3/4)', '√(2/3)', '2/3'],
        correct: 0,
      },
      {
        type: 'FRQ — Round 2 (excerpt)',
        q: 'A conducting rod of length L and mass m slides without friction on rails separated by distance L. A uniform magnetic field B is perpendicular to the plane of the rails. The rod is given an initial velocity v₀. (a) Derive an expression for its velocity as a function of time. (b) Find the total heat dissipated.',
        frq: true,
      },
    ],
  },
  biology: {
    icon: '🧬',
    title: 'Biology — Sample Questions',
    questions: [
      {
        type: 'MCQ — Round 1',
        q: 'Which enzyme complex is primarily responsible for the assembly of the leading strand during DNA replication in eukaryotes?',
        options: ['DNA Polymerase δ', 'DNA Polymerase α', 'DNA Polymerase ε', 'Primase'],
        correct: 2,
      },
      {
        type: 'FRQ — Round 2 (excerpt)',
        q: 'Describe the molecular mechanism by which CRISPR-Cas9 introduces a double-strand break at a target site. Include the roles of guide RNA, PAM sequence, and the two nuclease domains of Cas9.',
        frq: true,
      },
    ],
  },
};

function renderModal(subject) {
  const data = SAMPLES[subject];
  if (!data) return;

  document.getElementById('modalSubjectIcon').textContent = data.icon;
  document.getElementById('modalTitle').textContent = data.title;

  const body = document.getElementById('modalBody');
  body.innerHTML = data.questions.map(q => `
    <div class="sample-q">
      <div class="sample-q__type">${q.type}</div>
      <p>${q.q}</p>
      ${q.options ? `
        <div class="sample-options">
          ${q.options.map((o, i) => `<div class="sample-option${i === q.correct ? ' correct' : ''}">${String.fromCharCode(65 + i)}. ${o}${i === q.correct ? ' ✓' : ''}</div>`).join('')}
        </div>
      ` : '<p style="color:var(--text-muted);font-size:var(--text-xs);font-style:italic">Write your full solution — graded by subject experts.</p>'}
    </div>
  `).join('');

  document.getElementById('sampleModal').classList.remove('hidden');
}

document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => renderModal(btn.dataset.subject));
});

document.getElementById('modalClose')?.addEventListener('click', () => {
  document.getElementById('sampleModal').classList.add('hidden');
});

document.getElementById('sampleModal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
});
