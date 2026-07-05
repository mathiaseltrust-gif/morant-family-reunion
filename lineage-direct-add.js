(() => {
  const KEY = 'morantDirectLineageEntries';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const write = items => localStorage.setItem(KEY, JSON.stringify(items, null, 2));
  const branchById = id => (window.MORANT_FAMILY_DATA?.branches || []).find(b => b.id === id);
  const activeBranch = () => branchById(document.querySelector('#branchSelect')?.value || document.querySelector('#directoryBranchSelect')?.value);
  const safe = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  function store(entry) {
    const key = [entry.branchId, entry.parentName, entry.name].map(safe).join('|');
    const next = read().filter(item => [item.branchId, item.parentName, item.name].map(safe).join('|') !== key);
    next.unshift(entry);
    write(next);
  }

  function draw() {
    const branch = activeBranch();
    if (!branch) return;
    document.querySelectorAll('.direct-lineage-card').forEach(el => el.remove());
    const entries = read().filter(item => item.branchId === branch.id);
    const form = document.querySelector('#grandchildForm');
    if (form) {
      const button = form.querySelector('button[type="submit"]');
      if (button) button.textContent = 'Add to Lineage';
      const header = form.closest('.child-entry-card')?.querySelector('h3');
      if (header) header.textContent = 'Add Family Member';
      if (!form.querySelector('[name="shirtSize"]')) {
        form.querySelector('textarea[name="note"]')?.closest('label')?.insertAdjacentHTML('afterend', '<label>Shirt size<input name="shirtSize" placeholder="Adult L, Youth M, etc." /></label>');
      }
    }
    if (!entries.length) return;
    const list = entries.map(item => `<li><strong>${item.name}</strong><small> under ${item.parentName}</small>${item.shirtSize ? `<em>Shirt: ${item.shirtSize}</em>` : ''}${item.note ? `<em>${item.note}</em>` : ''}</li>`).join('');
    const card = `<article class="generation-card direct-lineage-card"><h4>Direct Added Family</h4><ul>${list}</ul></article>`;
    document.querySelector('#branchDetail .generation-grid')?.insertAdjacentHTML('beforeend', card);
    document.querySelector('#lineageDirectoryView .generation-grid')?.insertAdjacentHTML('beforeend', card.replace('direct-lineage-card','direct-lineage-card directory-copy'));
  }

  document.addEventListener('submit', event => {
    const form = event.target.closest?.('#grandchildForm');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const branch = activeBranch();
    const fd = new FormData(form);
    const entry = {
      branchId: branch?.id || '',
      branchName: branch?.name || '',
      parentName: String(fd.get('parentName') || '').trim(),
      name: String(fd.get('childName') || '').trim(),
      shirtSize: String(fd.get('shirtSize') || '').trim(),
      note: String(fd.get('note') || '').trim(),
      createdAt: new Date().toISOString()
    };
    if (!entry.branchId || !entry.parentName || !entry.name) return alert('Choose branch, parent, and name first.');
    store(entry);
    form.reset();
    draw();
    alert('Added to the lineage view.');
  }, true);

  document.addEventListener('DOMContentLoaded', () => setInterval(draw, 1000));
  if (document.readyState !== 'loading') setInterval(draw, 1000);
})();