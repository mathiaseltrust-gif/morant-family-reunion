(() => {
  const PHOTO_FORM_URL = 'https://airtable.com/app0cm8Ox3JBrH0l9/pag8a7DNq2WWWRHV5/form';
  const PHOTO_URL_KEY = 'morantPhotoUrlSubmissions';

  function currentUser() {
    try { return JSON.parse(localStorage.getItem('morantPortalUser') || 'null'); } catch { return null; }
  }
  function openLogin() {
    const modal = document.querySelector('#loginModal');
    if (modal) modal.hidden = false;
    else document.querySelector('.login-btn')?.click();
  }
  function savedUrls() {
    try { return JSON.parse(localStorage.getItem(PHOTO_URL_KEY) || '[]'); } catch { return []; }
  }
  function saveUrlSubmission(item) {
    const items = savedUrls();
    items.unshift(item);
    localStorage.setItem(PHOTO_URL_KEY, JSON.stringify(items.slice(0, 200), null, 2));
  }
  function isLikelyUrl(value) {
    return /^https?:\/\//i.test(String(value || '').trim());
  }
  function buildSection() {
    if (document.querySelector('#photoUploadCenter')) return;
    const section = document.createElement('section');
    section.id = 'photoUploadCenter';
    section.className = 'panel hidden-section photo-upload-center needs-member-login';
    section.innerHTML = `
      <h2>Shared Photo Uploads</h2>
      <p>This member-only area is for submitting profile photos, ancestor photos, and gallery photos by link or through the shared upload form.</p>
      <div class="photo-intake-grid">
        <article><h3>Photo URL</h3><p>Paste a direct image link for review and assignment to the correct profile.</p></article>
        <article><h3>Shared Form</h3><p>Use the Airtable form when family members need a simple upload page.</p></article>
        <article><h3>Admin Review</h3><p>Submitted photos stay pending until an admin applies them to a profile or gallery.</p></article>
      </div>
      <div id="photoFormBox" class="photo-form-box"></div>
      <p class="note">For now, URL submissions are stored in this browser for quick admin review. Airtable upload form submissions are stored in Airtable.</p>
    `;
    const updates = document.querySelector('#updates');
    updates?.after(section);
    const nav = document.querySelector('nav');
    if (nav && !nav.querySelector('a[href="#photoUploadCenter"]')) nav.insertAdjacentHTML('beforeend', '<a href="#photoUploadCenter">Photos</a>');
  }
  function renderList() {
    const list = document.querySelector('#photoUrlSubmissionList');
    if (!list) return;
    const items = savedUrls();
    if (!items.length) {
      list.innerHTML = '<p class="note">No photo URL submissions saved on this device yet.</p>';
      return;
    }
    list.innerHTML = items.map(item => `
      <div class="submission-item">
        <strong>${item.person || 'Unassigned photo'}</strong>
        <span>${item.category || 'Profile / family photo'} • submitted by ${item.submittedBy || 'family member'}</span>
        <a href="${item.url}" target="_blank" rel="noopener">Open photo URL</a>
        ${item.notes ? `<p>${item.notes}</p>` : ''}
      </div>
    `).join('');
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
    box.innerHTML = `
      <form id="photoUrlForm" class="photo-url-form">
        <h3>Submit Photo by URL</h3>
        <label>Who is this photo for?<input name="person" placeholder="Example: Cornella Morant Ruff" /></label>
        <label>Photo URL<input name="url" type="url" required placeholder="https://..." /></label>
        <label>Photo Category<select name="category"><option>Profile Photo</option><option>Ancestor Photo</option><option>Family Gallery</option><option>Reunion Photo</option><option>Document / Record Image</option></select></label>
        <label>Notes<textarea name="notes" rows="3" placeholder="Tell us who is in the photo, date, branch, or any needed context."></textarea></label>
        <button type="submit" class="black-btn">Save Photo URL</button>
      </form>
      <a class="red-btn photo-form-link" target="_blank" rel="noopener" href="${PHOTO_FORM_URL}">Open Shared Airtable Upload Form</a>
      <p class="note">Signed in as ${user.name || 'family member'}. Use either a photo URL here or the Airtable form for file upload.</p>
      <div id="photoUrlSubmissionList" class="submission-list"></div>
    `;
    document.querySelector('#photoUrlForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const url = String(form.get('url') || '').trim();
      if (!isLikelyUrl(url)) {
        alert('Please paste a valid photo URL starting with http:// or https://');
        return;
      }
      saveUrlSubmission({
        person: String(form.get('person') || '').trim(),
        url,
        category: String(form.get('category') || '').trim(),
        notes: String(form.get('notes') || '').trim(),
        submittedBy: user.name || '',
        submittedEmail: user.email || '',
        submittedAt: new Date().toISOString()
      });
      event.currentTarget.reset();
      renderList();
      alert('Photo URL saved for admin review.');
    });
    renderList();
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