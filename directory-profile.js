(() => {
  const CONTACT_KEY = 'morantMemberContactProfiles';

  function currentUser() {
    try { return JSON.parse(localStorage.getItem('morantPortalUser') || 'null'); } catch { return null; }
  }
  function getContacts() {
    try { return JSON.parse(localStorage.getItem(CONTACT_KEY) || '[]'); } catch { return []; }
  }
  function saveContacts(items) {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(items, null, 2));
  }
  function branchOptions() {
    return (window.MORANT_FAMILY_DATA?.branches || []).map(branch => `<option value="${branch.id}">${branch.name}</option>`).join('');
  }
  function lineagePath(branch) {
    const base = ['Richard Henry Morant + Johnnie Mae Allen', 'Cornella Morant Ruff'];
    if (branch) base.push(branch.name);
    return base;
  }
  function asPerson(item) {
    return typeof item === 'string' ? { name: item, years: '' } : (item || { name: '' });
  }
  function ensureDirectorySection() {
    if (document.querySelector('#memberDirectory')) return;
    const section = document.createElement('section');
    section.id = 'memberDirectory';
    section.className = 'panel member-directory needs-member-login';
    section.innerHTML = `
      <h2>Family Lineage Directory</h2>
      <p>This is a member-only lineage directory. It is not a social media feed. Active members may share contact information, shirt size, how they can be reached, and what they do.</p>
      <div class="directory-layout">
        <aside class="lineage-picker">
          <label>Choose parent branch<select id="directoryBranchSelect">${branchOptions()}</select></label>
          <button type="button" id="openSelectedLineage" class="black-btn">Open Lineage</button>
        </aside>
        <div id="lineageDirectoryView" class="lineage-directory-view"></div>
      </div>
      <div class="member-contact-card">
        <h3>Active Member Contact Card</h3>
        <form id="memberContactForm">
          <label>Your Name<input name="name" required placeholder="Your full name" /></label>
          <label>Branch<select name="branchId">${branchOptions()}</select></label>
          <label>Email<input name="email" type="email" placeholder="name@example.com" /></label>
          <label>Phone<input name="phone" type="tel" placeholder="Optional" /></label>
          <label>Shirt Size<input name="shirtSize" placeholder="Adult L, Youth M, etc." /></label>
          <label>What do you do?<input name="work" placeholder="Profession, business, service, ministry, skill, etc." /></label>
          <label>Best way to reach you<textarea name="notes" rows="3" placeholder="Optional contact notes"></textarea></label>
          <button type="submit" class="black-btn">Save My Contact Card</button>
        </form>
        <button id="downloadMemberContacts" type="button" class="black-btn">Download Member Contacts CSV</button>
        <div id="memberContactList" class="submission-list"></div>
      </div>
    `;
    const lower = document.querySelector('.lower-dashboard');
    lower?.after(section);
  }
  function downloadContactsCsv() {
    const rows = [['Name','Branch','Email','Phone','Shirt Size','What They Do','Contact Notes','Updated']];
    getContacts().forEach(item => rows.push([item.name || '', item.branchName || '', item.email || '', item.phone || '', item.shirtSize || '', item.work || '', item.notes || '', item.updatedAt || '']));
    const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'morant-member-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  function renderContacts() {
    const list = document.querySelector('#memberContactList');
    if (!list) return;
    const contacts = getContacts();
    if (!contacts.length) {
      list.innerHTML = '<p class="note">No active member contact cards saved on this device yet.</p>';
      return;
    }
    list.innerHTML = contacts.map(item => `
      <div class="submission-item member-contact-item">
        <strong>${item.name || 'Unnamed member'} — ${item.branchName || 'Branch not selected'}</strong>
        <p>${item.work || 'No work/service listed yet.'}</p>
        <small>${item.email || ''}${item.email && item.phone ? ' • ' : ''}${item.phone || ''}</small>
        ${item.shirtSize ? `<p><strong>Shirt size:</strong> ${item.shirtSize}</p>` : ''}
        ${item.notes ? `<p>${item.notes}</p>` : ''}
      </div>
    `).join('');
  }
  function renderLineage(branchId) {
    const data = window.MORANT_FAMILY_DATA || {};
    const branch = (data.branches || []).find(item => item.id === branchId) || (data.branches || [])[0];
    const view = document.querySelector('#lineageDirectoryView');
    if (!view || !branch) return;
    const path = lineagePath(branch);
    const children = (branch.children || []).map(asPerson);
    const grandchildren = (branch.grandchildren || []);
    view.innerHTML = `
      <div class="pedigree-path">${path.map((name, index) => `<div class="pedigree-step"><span>${index + 1}</span><strong>${name}</strong></div>`).join('')}</div>
      <article class="lineage-card">
        <p class="eyebrow">Parent Branch</p>
        <h3>${branch.name}</h3>
        ${branch.years ? `<p class="years">${branch.years}</p>` : ''}
        <p>${branch.notes || 'This branch shows the family line beneath the parent group.'}</p>
      </article>
      <div class="generation-grid">
        <article class="generation-card"><h4>Children / Sibling Line</h4><ul>${children.length ? children.map(child => `<li><strong>${child.name}</strong>${child.years ? ` <span class="years">${child.years}</span>` : ''}${child.note ? `<em>${child.note}</em>` : ''}</li>`).join('') : '<li class="empty-slot">Children not listed yet.</li>'}</ul></article>
        <article class="generation-card"><h4>Next Generation</h4><ul>${grandchildren.length ? grandchildren.map(group => `<li><strong>${group.parent}</strong>${group.names?.length ? `<ul>${group.names.map(name => `<li>${asPerson(name).name}</li>`).join('')}</ul>` : '<small>No children listed yet.</small>'}</li>`).join('') : '<li class="empty-slot">No next-generation details listed yet.</li>'}</ul></article>
      </div>
    `;
  }
  function setupDirectoryActions() {
    ensureDirectorySection();
    const select = document.querySelector('#directoryBranchSelect');
    const button = document.querySelector('#openSelectedLineage');
    const viewFamilyButton = document.querySelector('#viewFamilyDirectory');
    const form = document.querySelector('#memberContactForm');
    const downloadButton = document.querySelector('#downloadMemberContacts');
    if (select && !select.dataset.bound) {
      select.dataset.bound = 'true';
      select.addEventListener('change', () => renderLineage(select.value));
    }
    if (button && !button.dataset.bound) {
      button.dataset.bound = 'true';
      button.addEventListener('click', () => renderLineage(select?.value));
    }
    if (downloadButton && !downloadButton.dataset.bound) {
      downloadButton.dataset.bound = 'true';
      downloadButton.addEventListener('click', downloadContactsCsv);
    }
    if (viewFamilyButton && !viewFamilyButton.dataset.bound) {
      viewFamilyButton.dataset.bound = 'true';
      viewFamilyButton.addEventListener('click', () => {
        const user = currentUser();
        if (!user) {
          document.querySelector('.login-btn')?.click();
          return;
        }
        document.querySelector('#memberDirectory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        renderLineage(select?.value || window.MORANT_FAMILY_DATA?.branches?.[0]?.id);
      });
    }
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', event => {
        event.preventDefault();
        const fd = new FormData(form);
        const branch = (window.MORANT_FAMILY_DATA?.branches || []).find(item => item.id === fd.get('branchId'));
        const item = Object.fromEntries(fd.entries());
        item.branchName = branch?.name || '';
        item.updatedAt = new Date().toISOString();
        const contacts = getContacts().filter(existing => !(existing.name === item.name && existing.branchId === item.branchId));
        contacts.unshift(item);
        saveContacts(contacts);
        renderContacts();
        alert('Contact card saved on this device.');
      });
    }
    renderLineage(select?.value || window.MORANT_FAMILY_DATA?.branches?.[0]?.id);
    renderContacts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupDirectoryActions);
  else setupDirectoryActions();
})();