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

  function reframeRoots() {
    const rootCards = document.querySelectorAll('.root-photos .photo-card strong');
    if (rootCards[0]) rootCards[0].innerHTML = 'Richard Henry<br>Morant';
    if (rootCards[1]) rootCards[1].innerHTML = 'Johnnie Mae<br>Allen';
    const rootLabel = document.querySelector('.root-label');
    if (rootLabel) rootLabel.textContent = 'Morant / Allen Roots';
    const about = document.querySelector('#roots .about-card');
    if (about) {
      const title = about.querySelector('h3');
      const copy = about.querySelector('p');
      if (title) title.textContent = 'Shared Ancestry';
      if (copy) copy.textContent = 'This portal centers the Morant family reunion and the Morant / Allen ancestry. Spouse and household relationships can be shown in the proper profile context without replacing biological lineage.';
    }
    const statLabels = document.querySelectorAll('.stats-grid small');
    statLabels.forEach(label => {
      if (label.textContent.trim() === 'Family Roots') label.textContent = 'Morant / Allen Roots';
    });
    const relationship = document.querySelector('input[name="relationship"]');
    if (relationship) relationship.placeholder = 'Example: child of Pamela McCaster';
  }

  function correctDataModel() {
    if (!window.MORANT_FAMILY_DATA) return;
    window.MORANT_FAMILY_DATA.rootCouple = [
      { name: 'Richard Henry Morant', years: '1918–1987', role: 'Morant line' },
      { name: 'Johnnie Mae Allen', years: '1917–1978', role: 'Allen line' }
    ];
    window.MORANT_FAMILY_DATA.relationshipNote = 'Cornella Morant Ruff should be treated as a person with multiple relationships. Bobbie Ruff is not the biological root for every branch. Children should remain attached to their correct parent relationship when confirmed.';
  }

  function boot() {
    correctDataModel();
    applyLogo();
    reframeRoots();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
