(() => {
  const KEY = 'morantPendingGrandchildren';
  const getItems = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const saveItems = items => localStorage.setItem(KEY, JSON.stringify(items, null, 2));
  const branchSelect = () => document.querySelector('#branchSelect');
  const branchDetail = () => document.querySelector('#branchDetail');
  const data = () => window.MORANT_FAMILY_DATA;

  function currentBranch() {
    const id = branchSelect()?.value;
    return data()?.branches?.find(branch => branch.id === id);
  }

  function showAdded(branch) {
    const card = branchDetail()?.querySelector('.generation-card:nth-child(2)');
    if (!card || !branch) return;
    card.querySelector('.pending-grandchildren-list')?.remove();
    const additions = getItems().filter(item => item.branchId === branch.id);
    const html = additions.length
      ? additions.map(item => '<li><strong>' + item.childName + '</strong><small> child of ' + item.parentName + '</small></li>').join('')
      : '<li class="empty-slot">No pending children added on this device yet.</li>';
    card.insertAdjacentHTML('beforeend', '<ul class="pending-grandchildren-list">' + html + '</ul>');
  }

  function addForm() {
    const detail = branchDetail();
    const branch = currentBranch();
    if (!detail || !branch || detail.querySelector('#grandchildForm')) return;
    const options = (branch.children || []).map(child => {
      const name = typeof child === 'string' ? child : child.name;
      return '<option value="' + name + '">' + name + '</option>';
    }).join('');
    detail.insertAdjacentHTML('beforeend', '<div class="child-entry-card"><h3>Add Children / Grandchildren</h3><p>Save a pending branch update on this device.</p><form id="grandchildForm"><label>Parent in this branch<select name="parentName">' + options + '</select></label><label>Child name<input name="childName" required placeholder="Full name" /></label><label>Notes<textarea name="note" rows="3" placeholder="Birth year or relationship notes"></textarea></label><button type="submit">Save Pending Child</button></form></div>');
    const select = detail.querySelector('#grandchildForm select[name="parentName"]');
    if (branch.id === 'pamela') select.value = 'Mathew McCaster';
    detail.querySelector('#grandchildForm').addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const items = getItems();
      items.unshift({ branchId: branch.id, branchName: branch.name, parentName: formData.get('parentName'), childName: formData.get('childName'), note: formData.get('note'), createdAt: new Date().toISOString() });
      saveItems(items);
      event.target.reset();
      if (branch.id === 'pamela') select.value = 'Mathew McCaster';
      showAdded(branch);
    });
    showAdded(branch);
  }

  function boot() {
    document.querySelectorAll('#downloadNotifications,#downloadNotificationsVisible,#testNotification,#downloadCsv,#downloadRegistrations,#printBranch,#clearSubmissions,#copySubmission').forEach(el => el.classList.add('admin-only'));
    document.querySelector('.login-btn')?.addEventListener('click', event => { event.preventDefault(); document.body.classList.toggle('admin-mode'); });
    const detail = branchDetail();
    if (detail) new MutationObserver(() => setTimeout(addForm, 0)).observe(detail, { childList: true, subtree: true });
    setTimeout(addForm, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();