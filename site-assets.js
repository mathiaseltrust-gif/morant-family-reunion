(() => {
  const LOGO_URL = 'assets/Untitled%20design%20(3).PNG';
  function applyLogo() {
    const img = document.querySelector('#heroLogoPreview');
    const area = document.querySelector('.editable-logo-area');
    if (img) {
      img.src = LOGO_URL;
      img.classList.remove('hidden-logo');
      img.style.display = 'block';
    }
    if (area) area.classList.add('logo-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLogo);
  else applyLogo();
})();
