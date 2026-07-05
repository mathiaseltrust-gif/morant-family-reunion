(() => {
  const LOGO_URL = 'assets/Untitled%20design%20(3).PNG';
  function applyLogo() {
    const img = document.querySelector('#heroLogoPreview');
    const area = document.querySelector('.editable-logo-area');
    const card = document.querySelector('.logo-upload-card');
    const tools = document.querySelector('.logo-tools');
    if (img) {
      img.src = LOGO_URL;
      img.classList.remove('hidden-logo');
      img.style.display = 'block';
    }
    if (area) area.classList.add('logo-ready');
    if (card) card.style.display = 'none';
    if (tools) tools.style.display = 'none';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyLogo);
  else applyLogo();
})();
