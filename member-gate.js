(() => {
  const AUTH_KEY = 'morantPortalUser';
  const locked = ['#explore', '.lower-dashboard', '#registration', '#branchPanel', '#search', '#add-family', '#heritage', '#gallery', '#stories', '#migration'];
  function currentUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
  }
  function showLogin() {
    const modal = document.querySelector('#loginModal');
    if (modal) modal.hidden = false;
    else document.querySelector('.login-btn')?.click();
  }
  function makeNotice() {
    let notice = document.querySelector('#memberAccessNotice');
    if (!notice) {
      notice = document.createElement('section');
      notice.id = 'memberAccessNotice';
      notice.className = 'panel member-access-notice';
      notice.innerHTML = '<h2>Member Access</h2><p>Family branches, profiles, photos, stories, and deeper history open after member login.</p><button type="button" id="memberNoticeButton">Login</button><p class="note">The public homepage remains available for reunion basics.</p>';
      document.querySelector('#roots')?.after(notice);
      notice.querySelector('#memberNoticeButton')?.addEventListener('click', showLogin);
    }
    return notice;
  }
  function applyGate() {
    const signedIn = !!currentUser();
    document.body.classList.toggle('member-logged-in', signedIn);
    document.body.classList.toggle('member-logged-out', !signedIn);
    locked.forEach(selector => document.querySelectorAll(selector).forEach(el => el.classList.toggle('needs-member-login', !signedIn)));
    if (!signedIn) makeNotice();
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || currentUser()) return;
    const href = link.getAttribute('href');
    if (['#explore','#gallery','#stories','#migration','#search','#registration','#add-family','#heritage'].includes(href)) {
      event.preventDefault();
      makeNotice().scrollIntoView({ behavior: 'smooth' });
    }
  });
  window.addEventListener('storage', applyGate);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(applyGate, 500)); else setTimeout(applyGate, 500);
})();