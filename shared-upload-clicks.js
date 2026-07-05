(() => {
  const LOGO_URL = 'assets/Untitled%20design%20(3).PNG';
  const JOHNNIE_MAE_PHOTO = 'assets/johnnie-mae-allen.png';

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

  function addRootPortraits() {
    const cards = document.querySelectorAll('.root-photos .photo-card');
    if (cards[0]) {
      cards[0].querySelectorAll('.add-photo,.profile-photo-upload,.photo-remove').forEach(el => el.remove());
      if (!cards[0].querySelector('.blank-root-photo')) {
        cards[0].insertAdjacentHTML('afterbegin', '<div class="blank-root-photo" aria-hidden="true">M</div>');
      }
    }
    if (cards[1]) {
      cards[1].querySelectorAll('.add-photo,.profile-photo-upload,.photo-remove').forEach(el => el.remove());
      if (!cards[1].querySelector('.root-portrait')) {
        cards[1].insertAdjacentHTML('afterbegin', '<img class="root-portrait" src="' + JOHNNIE_MAE_PHOTO + '" alt="Johnnie Mae Allen portrait" />');
      }
    }
  }

  function reframeRoots() {
    const rootCards = document.querySelectorAll('.root-photos .photo-card strong');
    if (rootCards[0]) rootCards[0].innerHTML = 'Richard Henry<br>Morant';
    if (rootCards[1]) rootCards[1].innerHTML = 'Johnnie Mae<br>Allen';
    const connector = document.querySelector('.root-photos .heart');
    if (connector) connector.textContent = '⟐';
    const rootLabel = document.querySelector('.root-label');
    if (rootLabel) rootLabel.textContent = 'Pedigree Roots';
    const about = document.querySelector('#roots .about-card');
    if (about) {
      const title = about.querySelector('h3');
      const copy = about.querySelector('p');
      if (title) title.textContent = 'Member Access';
      if (copy) copy.textContent = 'The public page shows only the pedigree root names. Family branches, profiles, records, photos, and deeper history open after member login.';
    }
    document.querySelectorAll('.stats-grid small').forEach(label => {
      if (label.textContent.trim() === 'Family Roots') label.textContent = 'Pedigree Roots';
    });
    const relationship = document.querySelector('input[name="relationship"]');
    if (relationship) relationship.placeholder = 'Example: child of Pamela McCaster';
  }

  function correctDataModel() {
    if (!window.MORANT_FAMILY_DATA) return;
    window.MORANT_FAMILY_DATA.rootCouple = [
      { name: 'Richard Henry Morant', years: '1918–1987', role: 'Pedigree root' },
      { name: 'Johnnie Mae Allen', years: '1917–1978', role: 'Pedigree root', photo: JOHNNIE_MAE_PHOTO }
    ];
    window.MORANT_FAMILY_DATA.relationshipNote = 'Public view shows only the two pedigree root names. Member access unlocks deeper family information. Stephan Ruff spelling is Stephan.';
  }

  function removeFanView() {
    document.querySelector('#ancestryFanSection')?.remove();
  }

  function boot() {
    correctDataModel();
    applyLogo();
    reframeRoots();
    addRootPortraits();
    removeFanView();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();