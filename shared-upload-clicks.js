(() => {
  const FORM_URL = 'https://airtable.com/app0cm8Ox3JBrH0l9/pag8a7DNq2WWWRHV5/form';

  function currentUser() {
    try { return JSON.parse(localStorage.getItem('morantPortalUser') || 'null'); } catch { return null; }
  }

  function openLogin() {
    const modal = document.querySelector('#loginModal');
    if (modal) modal.hidden = false;
    else document.querySelector('.login-btn')?.click();
  }

  function openSharedUpload() {
    if (!currentUser()) {
      openLogin();
      return;
    }
    window.open(FORM_URL, '_blank', 'noopener');
  }

  function intercept(event) {
    const el = event.target.closest('.profile-photo-upload, .logo-upload-card, .editable-logo-area, #heroLogoUpload');
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    openSharedUpload();
  }

  document.addEventListener('click', intercept, true);
  document.addEventListener('change', event => {
    if (!event.target.matches('#heroLogoUpload, .profile-photo-upload input[type="file"]')) return;
    event.preventDefault();
    event.stopPropagation();
    event.target.value = '';
    openSharedUpload();
  }, true);
})();