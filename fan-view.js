(() => {
  const root = document.querySelector('#cornellaFan');
  const detail = document.querySelector('#fanDetail');
  const hints = document.querySelector('#heritageHints');
  if (!root || !detail) return;

  const people = [
    { name: 'Cornella Morant Ruff', years: '1940–2013', relation: 'Center', ring: 0, angle: 0, color: '#5b5b5b', note: 'Family root for this view.' },
    { name: 'Ralph Arthor Bell', years: '1939–1991', relation: 'Spouse / family connection', ring: 1, angle: 270, color: '#243a5a' },
    { name: 'Richard Henry Morant', years: '1918–1987', relation: 'Parent line', ring: 1, angle: 215, color: '#173d33' },
    { name: 'Johnnie Mae Allen', years: '1917–1978', relation: 'Parent line', ring: 1, angle: 325, color: '#74531b' },
    { name: 'Andrew Moses Morant', years: '1885–1956', relation: 'Grandparent line', ring: 2, angle: 185, color: '#1c334d' },
    { name: 'Mary Catrice Degen Morant', years: '1880–1943', relation: 'Grandparent line', ring: 2, angle: 235, color: '#173d33' },
    { name: 'John Allen', years: '1894–1930', relation: 'Grandparent line', ring: 2, angle: 300, color: '#8a3a24' },
    { name: 'Rosa Leach Allen', years: '1896–1983', relation: 'Grandparent line', ring: 2, angle: 350, color: '#75591f' },
    { name: 'Cornelius Morant', years: '1843–Deceased', relation: 'Earlier Morant line', ring: 3, angle: 170, color: '#24314c' },
    { name: 'Sarah Robinson', years: '1860–1934', relation: 'Earlier family line', ring: 3, angle: 205, color: '#24314c' },
    { name: 'Francis Degen', years: 'Deceased', relation: 'Earlier Degen line', ring: 3, angle: 245, color: '#193828' },
    { name: 'Cecilia Rotten', years: 'Deceased', relation: 'Earlier family line', ring: 3, angle: 280, color: '#193828' },
    { name: 'David Allen', years: '1848–Deceased', relation: 'Earlier Allen line', ring: 3, angle: 320, color: '#8a3a24' },
    { name: 'Lydia Allen', years: '1853–Deceased', relation: 'Earlier Allen line', ring: 3, angle: 350, color: '#8a3a24' },
    { name: 'Price Leach', years: '1874–Deceased', relation: 'Earlier Leach line', ring: 3, angle: 20, color: '#75591f' },
    { name: 'Jenevia Leach', years: '1883–Deceased', relation: 'Earlier Leach line', ring: 3, angle: 50, color: '#75591f' }
  ];

  function polarToXY(r, angle) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: 50 + Math.cos(rad) * r, y: 86 + Math.sin(rad) * r };
  }

  function cardFor(person, index) {
    if (person.ring === 0) return `<button class="fan-node fan-center" data-index="${index}" style="--c:${person.color}"><strong>${person.name}</strong><span>${person.years}</span></button>`;
    const radius = person.ring === 1 ? 21 : person.ring === 2 ? 34 : 45;
    const pos = polarToXY(radius, person.angle);
    return `<button class="fan-node fan-ring fan-ring-${person.ring}" data-index="${index}" style="--x:${pos.x}%;--y:${pos.y}%;--c:${person.color}"><strong>${person.name}</strong><span>${person.years}</span></button>`;
  }

  function showPerson(person) {
    detail.innerHTML = `<h3>${person.name}</h3><p class="fan-years">${person.years || ''}</p><p><strong>Connection:</strong> ${person.relation}</p><p>${person.note || 'This profile can later include photos, memories, documents, and verified family history.'}</p><details><summary>More Family History</summary><p>Optional research notes, sources, and deeper heritage information can be added here without placing it in front of every visitor.</p></details>`;
  }

  function render() {
    root.innerHTML = `<div class="fan-arc fan-arc-1"></div><div class="fan-arc fan-arc-2"></div><div class="fan-arc fan-arc-3"></div>${people.map(cardFor).join('')}`;
    root.querySelectorAll('[data-index]').forEach(button => {
      button.addEventListener('click', () => {
        root.querySelectorAll('.fan-node').forEach(n => n.classList.remove('is-active'));
        button.classList.add('is-active');
        showPerson(people[Number(button.dataset.index)]);
      });
    });
    showPerson(people[0]);
  }

  document.querySelector('#fanReset')?.addEventListener('click', () => { render(); });
  document.querySelector('#toggleHeritageHints')?.addEventListener('click', () => { hints?.classList.toggle('is-hidden'); });
  render();
})();