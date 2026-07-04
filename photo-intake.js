(() => {
  const PHOTO_FORM_URL = 'https://airtable.com/app0cm8Ox3JBrH0l9/pag8a7DNq2WWWRHV5/form';
  function currentUser() {
    try { return JSON.parse(localStorage.getItem('morantPortalUser') || 'null'); } catch { return null; }
  }
  function openLogin() {
    const modal = document.querySelector('#loginModal');
    if (modal) modal.hidden = false;
    else document.querySelector('.login-btn')?.click();
  }
  function buildSection() {
    if (document.querySelector('#photoUploadCenter')) return;
    const section = document.createElement('section');
    section.id = 'photoUploadCenter';
    section.className = 'panel hidden-section photo-upload-center needs-member-login';
    section.innerHTML = `
      <h2>Shared Photo Uploads</h2>
      <p>This member-only area is for shared family photos, profile photos, reunion logo updates, gallery photos, and family history images.</p>
      <div class="photo-intake-grid">
        <article><h3>Profile Photos</h3><p>Upload a photo for a specific family member or household.</p></article>
        <article><h3>Reunion Logo</h3><p>Submit the official reunion logo or a replacement image for review.</p></article>
        <article><h3>Family Gallery</h3><p>Submit reunion, ancestor, and family-history photos.</p></article>
      </div>
      <div id="photoFormBox" class="photo-form-box"></div>
      <p class="note">Uploads submitted here go to the shared Airtable intake for review and display. Local preview uploads are temporary.</p>
    `;
    const updates = document.querySelector('#updates');
    updates?.after(section);
    const nav = document.querySelector('nav');
    if (nav && !nav.querySelector('a[href="#photoUploadCenter"]')) nav.insertAdjacentHTML('beforeend', '<a href="#photoUploadCenter">Photos</a>');
  }
  function renderFormBox() {
    const box = document.querySelector('#photoFormBox');
    if (!box) return;
    const user = currentUser();
    if (!user) {
      box.innerHTML = `<div class="callout"><strong>Login Required</strong><p>Photo uploads are available only after member login.</p><button type="button" id="photoLoginButton" class="black-btn">Member Login</button></div>`;
      document.querySelector('#photoLoginButton')?.addEventListener('click', openLogin);
      return;
    }
    box.innerHTML = `<a class="red-btn photo-form-link" target="_blank" rel="noopener" href="${PHOTO_FORM_URL}">Open Shared Photo Upload</a><p class="note">Signed in as ${user.name || 'family member'}. Use the form to send photos into the shared family Airtable intake.</p>`;
  }
  function boot() {
    buildSection();
    renderFormBox();
    window.addEventListener('storage', renderFormBox);
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href="#photoUploadCenter"]');
      if (!link) return;
      if (!currentUser()) {
        event.preventDefault();
        document.querySelector('#photoUploadCenter')?.scrollIntoView({ behavior: 'smooth' });
        renderFormBox();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();