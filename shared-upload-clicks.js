(() => {
  const FORM_URL = 'https://airtable.com/app0cm8Ox3JBrH0l9/pag8a7DNq2WWWRHV5/form';
  const LOGO_URL = 'assets/morant-reunion-logo.svg';
  const user = () => { try { return JSON.parse(localStorage.getItem('morantPortalUser') || 'null'); } catch { return null; } };
  const showLogin = () => { const modal = document.querySelector('#loginModal'); if (modal) modal.hidden = false; };
  const openUpload = () => { if (!user()) return showLogin(); window.open(FORM_URL, '_blank'); };
  const applyLogo = () => {
    const img = document.querySelector('#heroLogoPreview');
    const area = document.querySelector('.editable-logo-area');
    if (img) { img.src = LOGO_URL; img.classList.remove('hidden-logo'); img.style.display = 'block'; }
    if (area) area.classList.add('logo-ready');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLogo); else applyLogo();
  document.addEventListener('click', event => {
    const el = event.target.closest('.profile-photo-upload, .logo-upload-card, .editable-logo-area');
    if (!el) return;
    event.preventDefault();
    openUpload();
  }, true);
})();