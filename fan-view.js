(() => {
  const root = document.querySelector('#cornellaFan');
  const detail = document.querySelector('#fanDetail');
  const hints = document.querySelector('#heritageHints');
  if (!root || !detail) return;

  const cornellaPhoto = 'data:image/jpeg;base64,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';

  const people = [
    { name: 'Cornella Morant Ruff', years: '1940–2013', relation: 'Center person', note: 'This is Cornella’s interactive tree view. Tap any wedge to open that relative.' },
    { name: 'Andrew Moses Morant', years: '1885–1956', relation: 'Morant line' },
    { name: 'Sarah Robinson', years: '1860–1934', relation: 'Earlier Morant line' },
    { name: 'Cornelius Morant', years: '1843–Deceased', relation: 'Earlier Morant line' },
    { name: 'Richard Henry Morant', years: '1918–1987', relation: 'Morant line' },
    { name: 'Mary Catrice Degen Morant', years: '1880–1943', relation: 'Degen / Morant line' },
    { name: 'Francis Degen', years: 'Deceased', relation: 'Degen line' },
    { name: 'Cecilia Rotten', years: 'Deceased', relation: 'Degen line' },
    { name: 'Johnnie Mae Allen', years: '1917–1978', relation: 'Allen line' },
    { name: 'John Allen', years: '1894–1930', relation: 'Allen line' },
    { name: 'David Allen', years: '1848–Deceased', relation: 'Allen line' },
    { name: 'Lydia Allen', years: '1853–Deceased', relation: 'Allen line' },
    { name: 'Rosa Leach Allen', years: '1896–1983', relation: 'Leach / Allen line' },
    { name: 'Price Leach', years: '1874–Deceased', relation: 'Leach line' },
    { name: 'Jenevia Leach', years: '1883–Deceased', relation: 'Leach line' }
  ];

  const segments = [
    { p: 1, start: 180, end: 220, inner: 110, outer: 245, color: '#21364f' },
    { p: 2, start: 180, end: 200, inner: 245, outer: 375, color: '#263957' },
    { p: 3, start: 200, end: 220, inner: 245, outer: 375, color: '#263957' },
    { p: 4, start: 220, end: 270, inner: 110, outer: 245, color: '#193e34' },
    { p: 5, start: 220, end: 270, inner: 245, outer: 310, color: '#1d4638' },
    { p: 6, start: 220, end: 245, inner: 310, outer: 375, color: '#254f3d' },
    { p: 7, start: 245, end: 270, inner: 310, outer: 375, color: '#254f3d' },
    { p: 8, start: 270, end: 320, inner: 110, outer: 245, color: '#7b5420' },
    { p: 9, start: 270, end: 320, inner: 245, outer: 310, color: '#8a3d25' },
    { p: 10, start: 270, end: 295, inner: 310, outer: 375, color: '#9b4429' },
    { p: 11, start: 295, end: 320, inner: 310, outer: 375, color: '#9b4429' },
    { p: 12, start: 320, end: 360, inner: 110, outer: 245, color: '#72551d' },
    { p: 13, start: 320, end: 340, inner: 245, outer: 375, color: '#806022' },
    { p: 14, start: 340, end: 360, inner: 245, outer: 375, color: '#806022' }
  ];

  function pt(cx, cy, r, deg) { const a = (deg - 180) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function wedge(cx, cy, inner, outer, start, end) {
    const p1 = pt(cx, cy, outer, start), p2 = pt(cx, cy, outer, end), p3 = pt(cx, cy, inner, end), p4 = pt(cx, cy, inner, start);
    const large = end - start > 180 ? 1 : 0;
    return `M ${p1[0]} ${p1[1]} A ${outer} ${outer} 0 ${large} 1 ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} A ${inner} ${inner} 0 ${large} 0 ${p4[0]} ${p4[1]} Z`;
  }
  function labelPoint(seg) { const a = (seg.start + seg.end) / 2; const r = (seg.inner + seg.outer) / 2; return pt(420, 420, r, a); }
  function shortName(name) { return name.replace('Mary Catrice Degen Morant', 'Mary Catrice Degen\nMorant').replace('Andrew Moses Morant','Andrew Moses\nMorant').replace('Richard Henry Morant','Richard Henry\nMorant').replace('Rosa Leach Allen','Rosa Leach\nAllen').replace('Johnnie Mae Allen','Johnnie Mae\nAllen').replace('Cornelius Morant','Cornelius\nMorant').replace('Sarah Robinson','Sarah\nRobinson').replace('Jenevia Leach','Jenevia\nLeach').replace('David Allen','David\nAllen').replace('Lydia Allen','Lydia\nAllen').replace('Price Leach','Price\nLeach').replace('John Allen','John\nAllen').replace('Francis Degen','Francis\nDegen').replace('Cecilia Rotten','Cecilia\nRotten'); }

  function showPerson(person) {
    detail.innerHTML = `<h3>${person.name}</h3><p class="fan-years">${person.years || ''}</p><p><strong>Connection:</strong> ${person.relation}</p><p>${person.note || 'This profile can later include photos, memories, documents, and verified family history.'}</p><button type="button" class="black-btn" id="openFanPerson">Open Profile</button><details><summary>More Family History</summary><p>Optional research notes, sources, Carolina connections, and deeper heritage information can be added here without placing it in front of every visitor.</p></details>`;
    detail.querySelector('#openFanPerson')?.addEventListener('click', () => {
      document.querySelector('#search')?.scrollIntoView({ behavior: 'smooth' });
      const box = document.querySelector('#searchBox');
      if (box) { box.value = person.name.split(' ')[0]; box.dispatchEvent(new Event('input')); }
    });
  }

  function textLines(seg) {
    const person = people[seg.p];
    const [x,y] = labelPoint(seg);
    const lines = shortName(person.name).split('\n');
    const fs = seg.outer - seg.inner > 90 ? 18 : 15;
    const lineEls = lines.map((line, i) => `<tspan x="${x}" dy="${i ? fs : 0}">${line}</tspan>`).join('');
    return `<text class="fan-label" x="${x}" y="${y - (lines.length * fs / 2)}" font-size="${fs}">${lineEls}<tspan x="${x}" dy="${fs}">${person.years}</tspan></text>`;
  }

  function render() {
    root.innerHTML = `<svg class="fan-svg" viewBox="0 0 840 470" role="img" aria-label="Cornella Morant Ruff interactive fan tree"><defs><clipPath id="cornellaClip"><circle cx="420" cy="420" r="72" /></clipPath></defs>${segments.map((seg, i) => `<g class="fan-segment" data-index="${seg.p}"><path d="${wedge(420,420,seg.inner,seg.outer,seg.start,seg.end)}" fill="${seg.color}" />${textLines(seg)}</g>`).join('')}<circle class="fan-center-ring" cx="420" cy="420" r="80"/><image href="${cornellaPhoto}" x="348" y="348" width="144" height="144" clip-path="url(#cornellaClip)" preserveAspectRatio="xMidYMid slice"/><text class="fan-center-text" x="420" y="505">Cornella Morant Ruff</text><text class="fan-center-years" x="420" y="528">1940–2013</text></svg>`;
    root.querySelectorAll('[data-index]').forEach(group => {
      group.addEventListener('click', () => {
        root.querySelectorAll('.fan-segment').forEach(n => n.classList.remove('is-active'));
        group.classList.add('is-active');
        showPerson(people[Number(group.dataset.index)]);
      });
    });
    showPerson(people[0]);
  }

  document.querySelector('#fanReset')?.addEventListener('click', render);
  document.querySelector('#toggleHeritageHints')?.addEventListener('click', () => hints?.classList.toggle('is-hidden'));
  render();
})();