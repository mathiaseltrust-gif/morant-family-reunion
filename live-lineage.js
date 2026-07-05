(() => {
  const LIVE_CHILDREN_KEY = 'morantLiveChildren';
  const LEGACY_PENDING_KEY = 'morantPendingGrandchildren';

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  }
  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value, null, 2));
  }
  function getLiveChildren() {
    const live = readJson(LIVE_CHILDREN_KEY);
    const legacy = readJson(LEGACY_PENDING_KEY).map(item => ({ ...item, migratedFromPending: true }));
    const ids = new Set();
    return [...live, ...legacy].filter(item => {
      const id = [item.branchId, item.parentName, item.childName].join('|').toLowerCase();
      if (ids.has(id)) return false;
      ids.add(id);
      return true;
    });
  }
  function saveLiveChild(item) {
    const current = readJson(LIVE_CHILDREN_KEY);
    current.unshift(item);
    writeJson(LIVE_CHILDREN_KEY, current);
  }
  function currentBranchId() {
    return document.querySelector('#branchSelect')?.value || '';
  }
  function branchById(id) {
    return (window.MORANT_FAMILY_DATA?.branches || []).find(branch => branch.id === id);
  }
  function renderLiveChildren(branchId = currentBranchId()) {
    const branch = branchById(branchId);
    const detail = document.querySelector('#branchDetail');
    if (!branch || !detail) return;
    detail.querySelector('#liveChildrenBlock')?.remove();
    const items = getLiveChildren().filter(item => item.branchId === branch.id);
    if (!items.length) return;
    const byParent = items.reduce((acc, item) => {
      (acc[item.parentName] ||= []).push(item);
      return acc;
    }, {});
    const html = Object.entries(byParent).map(([parent, children]) => `
      <li><strong>${parent}</strong>
        <ul>${children.map(child => `<li><strong>${child.childName}</strong>${child.shirtSize ? ` <small>Shirt: ${child.shirtSize}</small>` : ''}${child.note ? ` <em>${child.note}</em>` : ''}</li>`).join('')}</ul>
      </li>
    `).join('');
    const card = document.createElement('article');
    card.id = 'liveChildrenBlock';
    card.className = 'generation-card live-children-card';
    card.innerHTML = `<h4>Added Children / Next Generation</h4><ul>${html}</ul>`;
    const grid = detail.querySelector('.generation-grid');
    grid?.appendChild(card);
  }
  function relabelChildForm() {
    const form = document.querySelector('#grandchildForm');
    if (!form) return;
    const card = form.closest('.child-entry-card');
    card?.querySelector('h3') && (card.querySelector('h3').textContent = 'Add Children / Next Generation');
    card?.querySelector('p') && (card.querySelector('p').textContent = 'Select the parent in this branch, then add the child directly into this local lineage view.');
    form.querySelector('button[type="submit"]') && (form.querySelector('button[type="submit"]').textContent = 'Save Child to Lineage');
    if (!form.querySelector('[name="shirtSize"]')) {
      const noteLabel = form.querySelector('textarea[name="note"]')?.closest('label');
      noteLabel?.insertAdjacentHTML('beforebegin', '<label>Shirt size<input name="shirtSize" placeholder="Example: Youth M, Adult XL" /></label>');
    }
  }
  function attachCaptureSubmit() {
    document.addEventListener('submit', event => {
      const form = event.target.closest('#grandchildForm');
      if (!form) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const branch = branchById(currentBranchId());
      if (!branch) return;
      const fd = new FormData(form);
      const childName = String(fd.get('childName') || '').trim();
      if (!childName) return alert('Enter the child name first.');
      saveLiveChild({
        branchId: branch.id,
        branchName: branch.name,
        parentName: String(fd.get('parentName') || '').trim(),
        childName,
        shirtSize: String(fd.get('shirtSize') || '').trim(),
        note: String(fd.get('note') || '').trim(),
        createdAt: new Date().toISOString()
      });
      form.reset();
      renderLiveChildren(branch.id);
      alert('Child added to the local lineage view.');
    }, true);
  }
  function enhanceShirtSizeFields() {
    const registrationForm = document.querySelector('#registrationForm');
    const contactForm = document.querySelector('#memberContactForm');
    if (registrationForm) {
      const shirt = registrationForm.querySelector('[name="shirts"]');
      if (shirt) shirt.placeholder = 'Each member shirt size: Mathew XL; Child Youth M';
    }
    if (contactForm && !contactForm.querySelector('[name="shirtSize"]')) {
      const work = contactForm.querySelector('[name="work"]')?.closest('label');
      work?.insertAdjacentHTML('afterend', '<label>Shirt size<input name="shirtSize" placeholder="Example: Adult XL" /></label>');
    }
  }
  function boot() {
    attachCaptureSubmit();
    enhanceShirtSizeFields();
    setInterval(() => {
      relabelChildForm();
      enhanceShirtSizeFields();
      renderLiveChildren();
    }, 900);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();