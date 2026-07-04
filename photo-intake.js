(() => {
  const CONFIG_KEY = 'morantAirtablePhotoFormUrl';
  const defaultText = 'Shared photo storage is set up in Airtable. Add the Airtable photo form link here when available so uploads from every family member go to the shared database.';

  function getFormUrl() {
    return localStorage.getItem(CONFIG_KEY) || '';
  }
  function setFormUrl(url) {
    localStorage.setItem(CONFIG_KEY, url.trim());
  }
  function currentUser() {
    try { return JSON.parse(localStorage.getItem('morantPortalUser') || 'null'); } catch { return null; }
  }
  function buildSection() {
    if (document.querySelector('#photoUploadCenter')) return;
    const section = document.createElement('section');
    section.id = 'photoUploadCenter';
    section.className = 'panel hidden-section photo-upload-center needs-member-login';
    section.innerHTML = `
      <h2>Shared Photo Uploads</h2>
      <p>Use this area for photos that should be visible to the family portal, including profile photos, reunion logo updates, gallery photos, and family history images.</p>
      <div class="photo-intake-grid">
        <article><h3>Profile Photos</h3><p>Upload a photo for a specific family member or household.</p></article>
        <article><h3>Reunion Logo</h3><p>Submit the official reunion logo or a replacement image for review.</p></article>
        <article><h3>Family Gallery</h3><p>Submit reunion, ancestor, and family-history photos.</p></article>
      </div>
      <div id="photoFormBox" class="photo-form-box"></div>
      <details class="admin-only photo-admin-tools"><summary>Admin: Set Airtable Photo Form Link</summary><label>Airtable photo upload form URL<input id="photoFormUrlInput" placeholder="https://airtable.com/..." /></label><button id="savePhotoFormUrl" type="button">Save Photo Form Link</button></details>
      <p class="note">Local preview uploads are temporary. Shared uploads should go through the Airtable photo form so everyone can see them.</p>
    `;
    const updates = document.querySelector('#updates');
    updates?.after(section);
    document.querySelector('nav')?.insertAdjacentHTML('beforeend', '<a href="#photoUploadCenter">Photos</a>');
  }
  function renderFormBox() {
    const box = document.querySelector('#photoFormBox');
    if (!box) return;
    const url = getFormUrl();
    if (url) {
      const user = currentUser();
      box.innerHTML = `<a class="red-btn photo-form-link" target="_blank" rel="noopener" href="${url}">Open Shared Photo Upload</a><p class="note">Signed in as ${user?.name || 'family member'}. Photos submitted through the form are stored in Airtable for shared review/display.</p>`;
    } else {
      box.innerHTML = `<div class="callout"><strong>Shared storage is ready.</strong><p>${defaultText}</p></div>`;
    }
    const input = document.querySelector('#photoFormUrlInput');
    if (input) input.value = url;
  }
  function wireAdminTools() {
    document.querySelector('#savePhotoFormUrl')?.addEventListener('click', () => {
      const input = document.querySelector('#photoFormUrlInput');
      setFormUrl(input?.value || '');
      renderFormBox();
      alert('Photo form link saved on this device. Once we hard-code the link, every family member will see it.');
    });
  }
  function boot() {
    buildSection();
    renderFormBox();
    wireAdminTools();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();