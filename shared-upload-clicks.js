(() => {
  const LOGO_URL = 'assets/Untitled%20design%20(3).PNG';

  function applyLogo() {
    const img = document.querySelector('#heroLogoPreview');
    const area = document.querySelector('.editable-logo-area');
    const card = document.querySelector('.logo-upload-card');
    const tools = document.querySelector('.logo-tools');
    if (img) {
      img.src = LOGO_URL;
      img.classList.remove('hidden-logo');
      img.style.display = 'block';
    }
    if (area) area.classList.add('logo-ready');
    if (card) card.style.display = 'none';
    if (tools) tools.style.display = 'none';
  }

  function reframeRoots() {
    const rootCards = document.querySelectorAll('.root-photos .photo-card strong');
    if (rootCards[0]) rootCards[0].innerHTML = 'Richard Henry<br>Morant';
    if (rootCards[1]) rootCards[1].innerHTML = 'Johnnie Mae<br>Allen';
    const connector = document.querySelector('.root-photos .heart');
    if (connector) connector.textContent = '⟐';
    const rootLabel = document.querySelector('.root-label');
    if (rootLabel) rootLabel.textContent = 'Morant / Allen Roots';
    const about = document.querySelector('#roots .about-card');
    if (about) {
      const title = about.querySelector('h3');
      const copy = about.querySelector('p');
      if (title) title.textContent = 'Shared Ancestry';
      if (copy) copy.textContent = 'This portal centers the Morant family reunion and the Morant / Allen ancestry. Spouse and household relationships can be shown in the proper profile context without replacing biological lineage.';
    }
    document.querySelectorAll('.stats-grid small').forEach(label => {
      if (label.textContent.trim() === 'Family Roots') label.textContent = 'Morant / Allen Roots';
    });
    const relationship = document.querySelector('input[name="relationship"]');
    if (relationship) relationship.placeholder = 'Example: child of Pamela McCaster';
  }

  function correctDataModel() {
    if (!window.MORANT_FAMILY_DATA) return;
    window.MORANT_FAMILY_DATA.rootCouple = [
      { name: 'Richard Henry Morant', years: '1918–1987', role: 'Morant line' },
      { name: 'Johnnie Mae Allen', years: '1917–1978', role: 'Allen line' }
    ];
    window.MORANT_FAMILY_DATA.relationshipNote = 'Cornella Morant Ruff should be treated as a person with multiple relationships. Bobbie Ruff is not the biological root for every branch. Children should remain attached to their correct parent relationship when confirmed.';
  }

  const fanPeople = [
    ['Pamela Denise McCaster','1961–Living','Focal person'],
    ['Cornella Morant Ruff','1940–2013','Mother / Morant line'],
    ['Richard Henry Morant','1918–1987','Morant grandfather'],
    ['Andrew Moses Morant','1885–1956','Morant line'],
    ['Mary Catrice Degen Morant','1880–1943','Morant spouse / ancestor'],
    ['Johnnie Mae Allen','1917–1978','Allen grandmother'],
    ['John Allen','1894–1930','Allen line'],
    ['Rosa Leach Allen','1896–1983','Leach / Allen line'],
    ['Ralph Arthor Bell','1939–1991','Biological father line'],
    ['James Bell','1915–1990','Bell line'],
    ['Harry James Bell','1892–1972','Bell line'],
    ['Edith C. Look','1885–1971','Bell line'],
    ['Frances Bell Smith','1919–2014','Bell line'],
    ['Drucilla Johnson','1896–Deceased','Bell line'],
    ['Hillard Smith','1888–Deceased','Bell line']
  ];

  const fanSegments = [
    [8,180,205,92,205,'#23314d'],[9,205,230,92,205,'#23314d'],[1,230,270,92,205,'#74501d'],[5,270,310,92,205,'#8a3a22'],
    [11,180,205,205,330,'#273a58'],[10,205,230,205,330,'#1f4050'],[2,230,250,205,330,'#133c30'],[3,250,270,205,330,'#173d31'],
    [4,270,290,205,330,'#97361f'],[6,290,310,205,330,'#75571e'],[7,310,335,205,330,'#75571e'],[12,335,360,205,330,'#75571e'],
    [13,180,205,330,430,'#183a2d'],[14,205,230,330,430,'#183a2d']
  ];

  function polar(cx, cy, r, deg) {
    const a = (deg - 180) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function wedge(cx, cy, inner, outer, start, end) {
    const p1 = polar(cx, cy, outer, start), p2 = polar(cx, cy, outer, end), p3 = polar(cx, cy, inner, end), p4 = polar(cx, cy, inner, start);
    return `M ${p1[0]} ${p1[1]} A ${outer} ${outer} 0 0 1 ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} A ${inner} ${inner} 0 0 0 ${p4[0]} ${p4[1]} Z`;
  }
  function shortLabel(name) {
    return name.replace('Pamela Denise McCaster','Pamela Denise\nMcCaster').replace('Cornella Morant Ruff','Cornella Morant\nRuff').replace('Richard Henry Morant','Richard Henry\nMorant').replace('Andrew Moses Morant','Andrew Moses\nMorant').replace('Mary Catrice Degen Morant','Mary Catrice\nDegen Morant').replace('Johnnie Mae Allen','Johnnie Mae\nAllen').replace('Rosa Leach Allen','Rosa Leach\nAllen').replace('Ralph Arthor Bell','Ralph Arthor\nBell').replace('Frances Bell Smith','Frances Bell\nSmith').replace('Harry James Bell','Harry James\nBell').replace('Edith C. Look','Edith C.\nLook').replace('Drucilla Johnson','Drucilla\nJohnson').replace('Hillard Smith','Hillard\nSmith');
  }
  function insertFanView() {
    if (document.querySelector('#ancestryFanSection')) return;
    const roots = document.querySelector('#roots');
    if (!roots) return;
    const section = document.createElement('section');
    section.id = 'ancestryFanSection';
    section.className = 'fan-section';
    section.innerHTML = '<div class="fan-header"><div><h2>Biological Ancestry Wheel</h2><p>This view follows biological lineage only. Spouses, households, and children by relationship belong in Family Groups.</p></div><div class="fan-actions"><button type="button" data-fan-mode="tree">Tree</button><button type="button" data-fan-mode="family">Family Groups</button></div></div><div class="fan-layout"><div id="morantFanChart" class="fan-chart"></div><aside id="morantFanDetail" class="fan-detail"><h3>Pamela Denise McCaster</h3><p class="fan-years">1961–Living</p><p>Tap a wedge to view the relationship connection.</p></aside></div>';
    roots.after(section);
    renderFanChart();
  }
  function renderFanChart() {
    const chart = document.querySelector('#morantFanChart');
    const detail = document.querySelector('#morantFanDetail');
    if (!chart || !detail) return;
    const cx = 430, cy = 430;
    const paths = fanSegments.map((s, i) => {
      const [personIndex,start,end,inner,outer,color] = s;
      const person = fanPeople[personIndex];
      const mid = (start + end) / 2, radius = (inner + outer) / 2;
      const [x,y] = polar(cx, cy, radius, mid);
      const label = shortLabel(person[0]).split('\n').map((line, n) => `<tspan x="${x}" dy="${n ? 22 : 0}">${line}</tspan>`).join('');
      return `<g class="fan-person" data-index="${personIndex}" tabindex="0"><path d="${wedge(cx,cy,inner,outer,start,end)}" fill="${color}" stroke="rgba(255,255,255,.24)" stroke-width="1.4"/><text x="${x}" y="${y - 10}" fill="#fff" font-size="16" font-weight="700" text-anchor="middle">${label}<tspan x="${x}" dy="22" font-weight="400">${person[1]}</tspan></text></g>`;
    }).join('');
    chart.innerHTML = `<svg viewBox="0 0 860 455" role="img" aria-label="Interactive biological ancestry fan chart"><circle cx="${cx}" cy="${cy}" r="92" fill="#5a5a5a" stroke="#eee" stroke-width="2"/><text x="${cx}" y="${cy - 12}" fill="#fff" font-size="20" font-weight="800" text-anchor="middle">Pamela Denise</text><text x="${cx}" y="${cy + 14}" fill="#fff" font-size="20" font-weight="800" text-anchor="middle">McCaster</text><text x="${cx}" y="${cy + 42}" fill="#fff" font-size="17" text-anchor="middle">1961–Living</text>${paths}</svg>`;
    chart.querySelectorAll('.fan-person').forEach(el => {
      const show = () => {
        const p = fanPeople[Number(el.dataset.index)];
        detail.innerHTML = `<h3>${p[0]}</h3><p class="fan-years">${p[1]}</p><p><strong>Connection:</strong> ${p[2]}</p><p>This is part of the biological ancestry view. Relationship groups can be added separately without replacing this lineage.</p>`;
      };
      el.addEventListener('click', show);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') show(); });
    });
  }

  function boot() {
    correctDataModel();
    applyLogo();
    reframeRoots();
    insertFanView();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
