const data = window.MORANT_FAMILY_DATA;
const branchGrid = document.querySelector('#branchGrid');
const branchSelect = document.querySelector('#branchSelect');
const formBranch = document.querySelector('#formBranch');
const notifyBranch = document.querySelector('#notifyBranch');
const registrationBranch = document.querySelector('#registrationBranch');
const branchDetail = document.querySelector('#branchDetail');
const searchBox = document.querySelector('#searchBox');
const directoryResults = document.querySelector('#directoryResults');
const familyForm = document.querySelector('#familyForm');
const notificationForm = document.querySelector('#notificationForm');
const registrationForm = document.querySelector('#registrationForm');
const submissionList = document.querySelector('#submissionList');
const registrationList = document.querySelector('#registrationList');

const asPerson = item => typeof item === 'string' ? { name: item, years: '' } : item;
const label = person => {
  const p = asPerson(person);
  return `${p.name}${p.years ? ` <span class="years">${p.years}</span>` : ''}${p.note ? ` <em>${p.note}</em>` : ''}`;
};
const plain = person => asPerson(person).name;

function getStored(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
function setStored(key, items) { localStorage.setItem(key, JSON.stringify(items, null, 2)); }
const getSubmissions = () => getStored('morantFamilySubmissions');
const saveSubmissions = items => setStored('morantFamilySubmissions', items);
const getNotifications = () => getStored('morantNotificationSignups');
const saveNotifications = items => setStored('morantNotificationSignups', items);
const getRegistrations = () => getStored('morantReunionRegistrations');
const saveRegistrations = items => setStored('morantReunionRegistrations', items);

function setupHeroLogoUpload() {
  const area = document.querySelector('.editable-logo-area');
  const input = document.querySelector('#heroLogoUpload');
  const preview = document.querySelector('#heroLogoPreview');
  const remove = document.querySelector('#removeHeroLogo');
  if (!area || !input || !preview) return;

  const savedLogo = localStorage.getItem('morantHeroLogo');
  if (savedLogo) {
    preview.src = savedLogo;
    area.classList.add('logo-ready');
  }

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      preview.src = dataUrl;
      localStorage.setItem('morantHeroLogo', dataUrl);
      area.classList.add('logo-ready');
    };
    reader.readAsDataURL(file);
  });

  remove?.addEventListener('click', () => {
    localStorage.removeItem('morantHeroLogo');
    preview.removeAttribute('src');
    area.classList.remove('logo-ready');
    input.value = '';
  });
}

function allPeople() {
  const people = [];
  data.rootCouple.forEach(root => people.push({ name: root.name, years: root.years, branch: 'Founding Elders', generation: root.role || 'Founding Elder' }));
  data.maternalAncestry.forEach(person => people.push({ ...person, branch: 'Maternal Ancestry', generation: 'Documented ancestor / relative' }));
  data.branches.forEach(branch => {
    people.push({ name: branch.name, years: branch.years, branch: branch.name, generation: 'Parent Group / Branch Elder' });
    branch.children.forEach(child => {
      const p = asPerson(child);
      people.push({ name: p.name, years: p.years, branch: branch.name, generation: 'Child / Beneficiary' });
    });
    branch.grandchildren.forEach(group => {
      group.names.forEach(grandchild => {
        const p = asPerson(grandchild);
        people.push({ name: p.name, years: p.years, branch: branch.name, generation: `Grandchild of ${group.parent}` });
      });
    });
  });
  return people;
}

function renderBranchCards() {
  branchGrid.innerHTML = data.branches.map(branch => `
    <article class="branch-card" style="--branch-color:${branch.color}">
      <p class="eyebrow">Parent Group</p>
      <h3>${branch.name}</h3>
      ${branch.years ? `<p class="years big-years">${branch.years}</p>` : ''}
      <button type="button" data-branch-button="${branch.id}">Open Parent Group</button>
    </article>
  `).join('');
  document.querySelectorAll('[data-branch-button]').forEach(button => {
    button.addEventListener('click', () => {
      branchSelect.value = button.dataset.branchButton;
      renderBranchDetail(button.dataset.branchButton);
      branchDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renderSelects() {
  const options = data.branches.map(branch => `<option value="${branch.id}">${branch.name}</option>`).join('');
  [branchSelect, formBranch, notifyBranch, registrationBranch].filter(Boolean).forEach(select => select.innerHTML = options);
}

function renderHeritage() {
  const heritage = document.querySelector('#heritageContent');
  const ancestry = document.querySelector('#ancestryList');
  if (!heritage || !ancestry) return;
  heritage.innerHTML = `
    <h3>${data.heritage.title}</h3>
    <p>${data.heritage.summary}</p>
    <p class="note">${data.heritage.note}</p>
  `;
  ancestry.innerHTML = '<p class="note">Detailed ancestor names are available through search or admin-approved profile pages.</p>';
}

function renderBranchDetail(branchId = '') {
  if (!branchId) {
    branchDetail.innerHTML = '<div class="callout">Select a parent group to view the first generation beneath that parent. Full descendant names remain hidden unless a branch is opened or searched.</div>';
    return;
  }
  const branch = data.branches.find(item => item.id === branchId);
  if (!branch) return;
  const childList = branch.children.length
    ? branch.children.map(child => `<li>${label(child)}</li>`).join('')
    : '<li class="empty-slot">Children not listed yet</li>';
  branchDetail.innerHTML = `
    <div class="branch-title">
      <div><p class="eyebrow">Opened Parent Group</p><h2>${branch.name}</h2>${branch.years ? `<p class="years big-years">${branch.years}</p>` : ''}</div>
      <span>${branch.children.length} children listed</span>
    </div>
    <div class="generation-grid">
      <article class="generation-card">
        <h4>Children / Beneficiaries</h4>
        <ul>${childList}</ul>
      </article>
      <article class="generation-card">
        <h4>Grandchildren</h4>
        <p class="empty-slot">Grandchildren stay hidden from the general page. Search a name or submit updates for approval.</p>
      </article>
    </div>
  `;
}

function renderDirectory(filter = '') {
  const q = filter.trim().toLowerCase();
  if (!q) {
    directoryResults.innerHTML = '<p class="note">Start typing to reveal matching names. The full list is not displayed publicly.</p>';
    return;
  }
  const people = allPeople().filter(person => person.name.toLowerCase().includes(q) || person.branch.toLowerCase().includes(q));
  directoryResults.innerHTML = people.map(person => `
    <div class="directory-item">
      <strong>${person.name}</strong>
      <span>${person.years ? `${person.years} • ` : ''}${person.generation} • ${person.branch}</span>
    </div>
  `).join('') || '<p>No matches found.</p>';
}

function renderSubmissions() {
  const items = getSubmissions();
  submissionList.innerHTML = items.map((item) => `
    <div class="submission-item"><strong>${item.submitter || 'Unnamed submission'} — ${item.branchName}</strong><pre>${item.familyMembers || 'No details entered yet.'}</pre><small>${new Date(item.createdAt).toLocaleString()}</small></div>
  `).join('') || '<p class="note">No saved family update drafts yet.</p>';
}

function renderRegistrations() {
  if (!registrationList) return;
  const items = getRegistrations();
  registrationList.innerHTML = items.map(item => `
    <div class="submission-item"><strong>${item.name || 'Unnamed registration'} — ${item.branchName}</strong><p>${item.adults || 0} adults • ${item.children || 0} children • Hotel: ${item.hotel || 'No'}</p><small>${new Date(item.createdAt).toLocaleString()}</small></div>
  `).join('') || '<p class="note">No saved registration drafts yet.</p>';
}

function downloadCsv(filename, rows) {
  const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function downloadRegistryCsv() {
  const rows = [['Name', 'Years', 'Branch', 'Generation']];
  allPeople().forEach(person => rows.push([person.name, person.years || '', person.branch, person.generation]));
  downloadCsv('morant-family-bloodline-registry.csv', rows);
}
function downloadNotificationsCsv() {
  const rows = [['Name', 'Branch', 'Email', 'Phone', 'Email Updates', 'Text Updates', 'Created']];
  getNotifications().forEach(item => rows.push([item.name, item.branchName, item.email, item.phone, item.emailOptIn ? 'Yes' : 'No', item.textOptIn ? 'Yes' : 'No', item.createdAt]));
  downloadCsv('morant-reunion-notification-signups.csv', rows);
}
function downloadRegistrationsCsv() {
  const rows = [['Name', 'Branch', 'Email', 'Phone', 'Adults', 'Children', 'Shirts', 'Hotel', 'Notes', 'Created']];
  getRegistrations().forEach(item => rows.push([item.name, item.branchName, item.email, item.phone, item.adults, item.children, item.shirts, item.hotel, item.notes, item.createdAt]));
  downloadCsv('morant-reunion-registrations.csv', rows);
}

setupHeroLogoUpload();
renderBranchCards();
renderSelects();
renderHeritage();
renderBranchDetail('');
renderDirectory('');
renderSubmissions();
renderRegistrations();

branchSelect.addEventListener('change', event => renderBranchDetail(event.target.value));
searchBox.addEventListener('input', event => renderDirectory(event.target.value));
document.querySelector('#downloadCsv').addEventListener('click', downloadRegistryCsv);
document.querySelector('#printBranch').addEventListener('click', () => window.print());
document.querySelector('#downloadNotifications')?.addEventListener('click', downloadNotificationsCsv);
document.querySelector('#downloadRegistrations')?.addEventListener('click', downloadRegistrationsCsv);

notificationForm?.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(notificationForm);
  const branch = data.branches.find(item => item.id === form.get('branch'));
  const item = Object.fromEntries(form.entries());
  item.branchName = branch?.name || item.branch;
  item.emailOptIn = form.has('emailOptIn');
  item.textOptIn = form.has('textOptIn');
  item.createdAt = new Date().toISOString();
  const items = getNotifications(); items.unshift(item); saveNotifications(items);
  notificationForm.reset(); notifyBranch.value = data.branches[0].id;
  alert('Saved to the reunion update list on this device. Next step: connect this to email/text broadcast.');
});
registrationForm?.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(registrationForm);
  const branch = data.branches.find(item => item.id === form.get('branch'));
  const item = Object.fromEntries(form.entries());
  item.branchName = branch?.name || item.branch;
  item.createdAt = new Date().toISOString();
  const items = getRegistrations(); items.unshift(item); saveRegistrations(items);
  renderRegistrations(); registrationForm.reset(); registrationBranch.value = data.branches[0].id;
  alert('Registration saved as a draft on this device. Next step: connect this to the live database.');
});
familyForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(familyForm);
  const branch = data.branches.find(item => item.id === form.get('branch'));
  const item = Object.fromEntries(form.entries());
  item.branchName = branch?.name || item.branch;
  item.createdAt = new Date().toISOString();
  const items = getSubmissions(); items.unshift(item); saveSubmissions(items);
  renderSubmissions(); familyForm.reset(); formBranch.value = data.branches[0].id;
  alert('Family update saved as a draft on this device.');
});
document.querySelector('#copySubmission').addEventListener('click', async () => {
  const [latest] = getSubmissions();
  if (!latest) return alert('No family update draft to copy yet.');
  const text = `Morant Family Bloodline Submission\n\nName: ${latest.submitter}\nEmail: ${latest.email}\nBranch: ${latest.branchName}\nRelationship: ${latest.relationship}\n\nFamily Members:\n${latest.familyMembers}\n\nMedia Notes:\n${latest.mediaNotes}`;
  await navigator.clipboard.writeText(text);
  alert('Latest family update copied.');
});
document.querySelector('#clearSubmissions').addEventListener('click', () => {
  if (confirm('Clear saved family update drafts on this device?')) { saveSubmissions([]); renderSubmissions(); }
});
