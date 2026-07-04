const data = window.MORANT_FAMILY_DATA;
const branchGrid = document.querySelector('#branchGrid');
const branchSelect = document.querySelector('#branchSelect');
const formBranch = document.querySelector('#formBranch');
const branchDetail = document.querySelector('#branchDetail');
const searchBox = document.querySelector('#searchBox');
const directoryResults = document.querySelector('#directoryResults');
const familyForm = document.querySelector('#familyForm');
const submissionList = document.querySelector('#submissionList');

function getSubmissions() {
  return JSON.parse(localStorage.getItem('morantFamilySubmissions') || '[]');
}

function saveSubmissions(items) {
  localStorage.setItem('morantFamilySubmissions', JSON.stringify(items, null, 2));
}

function allPeople() {
  const people = [];
  data.branches.forEach(branch => {
    people.push({ name: branch.name, branch: branch.name, generation: 'Branch Elder' });
    branch.children.forEach(name => people.push({ name, branch: branch.name, generation: 'Child / Beneficiary' }));
    branch.grandchildren.forEach(group => {
      group.names.forEach(name => people.push({ name, branch: branch.name, generation: `Grandchild of ${group.parent}` }));
    });
  });
  return people;
}

function renderBranchCards() {
  branchGrid.innerHTML = data.branches.map(branch => `
    <article class="branch-card" style="--branch-color:${branch.color}">
      <p class="eyebrow">Branch Elder</p>
      <h3>${branch.name}</h3>
      <p class="count">${branch.children.length} children listed • ${branch.grandchildren.reduce((n, g) => n + g.names.length, 0)} grandchildren listed</p>
      <button type="button" data-branch-button="${branch.id}">View Branch</button>
    </article>
  `).join('');
  document.querySelectorAll('[data-branch-button]').forEach(button => {
    button.addEventListener('click', () => {
      branchSelect.value = button.dataset.branchButton;
      renderBranchDetail(button.dataset.branchButton);
      document.querySelector('#branches').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderSelects() {
  const options = data.branches.map(branch => `<option value="${branch.id}">${branch.name}</option>`).join('');
  branchSelect.innerHTML = options;
  formBranch.innerHTML = options;
}

function renderBranchDetail(branchId = data.branches[0].id) {
  const branch = data.branches.find(item => item.id === branchId) || data.branches[0];
  const childList = branch.children.length
    ? branch.children.map(name => `<li>${name}</li>`).join('')
    : '<li class="empty-slot">Children not listed yet</li>';
  const grandchildCards = branch.children.map(child => {
    const group = branch.grandchildren.find(item => item.parent === child);
    const names = group?.names?.length ? group.names : [];
    return `
      <article class="generation-card">
        <h4>Children of ${child}</h4>
        <ul>${names.length ? names.map(name => `<li>${name}</li>`).join('') : '<li class="empty-slot">Open slot for grandchildren</li><li class="empty-slot">Open slot for great-grandchildren</li>'}</ul>
      </article>
    `;
  }).join('');

  branchDetail.innerHTML = `
    <div class="branch-title">
      <div>
        <p class="eyebrow">Branch Elder</p>
        <h2>${branch.name}</h2>
      </div>
      <span>${branch.children.length} children • ${branch.grandchildren.reduce((n, g) => n + g.names.length, 0)} grandchildren</span>
    </div>
    <div class="generation-grid">
      <article class="generation-card">
        <h4>Generation 3 — Their Children</h4>
        <ul>${childList}</ul>
      </article>
      ${grandchildCards || '<article class="generation-card"><h4>Generation 4 — Grandchildren</h4><ul><li class="empty-slot">Open slot for grandchildren</li></ul></article>'}
    </div>
  `;
}

function renderDirectory(filter = '') {
  const q = filter.trim().toLowerCase();
  const people = allPeople().filter(person => !q || person.name.toLowerCase().includes(q) || person.branch.toLowerCase().includes(q));
  directoryResults.innerHTML = people.map(person => `
    <div class="directory-item">
      <strong>${person.name}</strong>
      <span>${person.generation} • ${person.branch}</span>
    </div>
  `).join('') || '<p>No matches found.</p>';
}

function renderSubmissions() {
  const items = getSubmissions();
  submissionList.innerHTML = items.map((item, index) => `
    <div class="submission-item">
      <strong>${item.submitter || 'Unnamed submission'} — ${item.branchName}</strong>
      <pre>${item.familyMembers || 'No family member details entered yet.'}</pre>
      <small>${new Date(item.createdAt).toLocaleString()}</small>
    </div>
  `).join('') || '<p class="note">No saved draft submissions yet.</p>';
}

function downloadCsv() {
  const rows = [['Name', 'Branch', 'Generation']];
  allPeople().forEach(person => rows.push([person.name, person.branch, person.generation]));
  const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'morant-family-bloodline-registry.csv';
  a.click();
  URL.revokeObjectURL(url);
}

renderBranchCards();
renderSelects();
renderBranchDetail();
renderDirectory();
renderSubmissions();

branchSelect.addEventListener('change', event => renderBranchDetail(event.target.value));
searchBox.addEventListener('input', event => renderDirectory(event.target.value));
document.querySelector('#downloadCsv').addEventListener('click', downloadCsv);
document.querySelector('#printBranch').addEventListener('click', () => window.print());

familyForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(familyForm);
  const branch = data.branches.find(item => item.id === form.get('branch'));
  const item = Object.fromEntries(form.entries());
  item.branchName = branch?.name || item.branch;
  item.createdAt = new Date().toISOString();
  const items = getSubmissions();
  items.unshift(item);
  saveSubmissions(items);
  renderSubmissions();
  familyForm.reset();
  formBranch.value = data.branches[0].id;
  alert('Family information saved as a draft on this device. Next step: connect this form to email or a database.');
});

document.querySelector('#copySubmission').addEventListener('click', async () => {
  const [latest] = getSubmissions();
  if (!latest) return alert('No submission draft to copy yet.');
  const text = `Morant Family Bloodline Submission\n\nName: ${latest.submitter}\nEmail: ${latest.email}\nBranch: ${latest.branchName}\nRelationship: ${latest.relationship}\n\nFamily Members:\n${latest.familyMembers}\n\nMedia Notes:\n${latest.mediaNotes}`;
  await navigator.clipboard.writeText(text);
  alert('Latest submission copied.');
});

document.querySelector('#clearSubmissions').addEventListener('click', () => {
  if (confirm('Clear saved draft submissions on this device?')) {
    saveSubmissions([]);
    renderSubmissions();
  }
});
