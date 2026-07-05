(() => {
  const AUTH_KEY = 'morantPortalUser';
  const PASSCODES = {
    member: 'morant2026',
    admin: 'admin2026'
  };
  const ROLE_LABELS = {
    member: 'Family Member',
    admin: 'Administrator'
  };

  function getUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
  }
  function saveUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user, null, 2));
    localStorage.setItem('morantAdminMode', user.role === 'admin' ? 'true' : 'false');
    document.body.classList.toggle('admin-mode', user.role === 'admin');
    updateLoginButton();
    window.dispatchEvent(new Event('storage'));
  }
  function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.setItem('morantAdminMode', 'false');
    document.body.classList.remove('admin-mode');
    updateLoginButton();
    window.dispatchEvent(new Event('storage'));
  }
  function modalHtml() {
    return [
      '<div id="loginModal" class="login-modal" hidden>',
      '<div class="login-box" role="dialog" aria-modal="true" aria-labelledby="loginTitle">',
      '<button type="button" class="login-close" id="closeLogin">×</button>',
      '<h2 id="loginTitle">Member Login</h2>',
      '<p class="login-note">Enter your name, email, role, and passcode.</p>',
      '<form id="loginForm">',
      '<label>Full Name<input name="name" required autocomplete="name" placeholder="Your full name" /></label>',
      '<label>Email<input name="email" type="email" autocomplete="email" placeholder="name@example.com" /></label>',
      '<label>Role<select name="role"><option value="member">Family Member</option><option value="admin">Administrator</option></select></label>',
      '<label>Passcode<input name="passcode" required type="password" autocomplete="current-password" placeholder="Enter passcode" /></label>',
      '<button type="submit">Enter Family Portal</button>',
      '</form>',
      '<button type="button" id="logoutButton">Logout</button>',
      '</div>',
      '</div>'
    ].join('');
  }
  function ensureModal() {
    let modal = document.querySelector('#loginModal');
    if (!modal) {
      document.body.insertAdjacentHTML('beforeend', modalHtml());
      modal = document.querySelector('#loginModal');
      modal.querySelector('#closeLogin')?.addEventListener('click', () => modal.hidden = true);
      modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
      modal.querySelector('#logoutButton')?.addEventListener('click', () => { logout(); modal.hidden = true; });
      modal.querySelector('#loginForm')?.addEventListener('submit', event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const role = String(form.get('role') || 'member');
        const passcode = String(form.get('passcode') || '').trim();
        if (PASSCODES[role] !== passcode) {
          alert('That passcode did not match the selected role.');
          return;
        }
        saveUser({
          name: String(form.get('name') || '').trim(),
          email: String(form.get('email') || '').trim(),
          role,
          roleLabel: ROLE_LABELS[role] || 'Family Member',
          loggedInAt: new Date().toISOString()
        });
        modal.hidden = true;
        alert('Login successful. Family portal unlocked.');
      });
    }
    return modal;
  }
  function updateLoginButton() {
    const button = document.querySelector('.login-btn');
    const user = getUser();
    if (!button) return;
    button.textContent = user ? `${user.roleLabel}: ${user.name || 'Signed In'}` : 'Member Login';
    button.setAttribute('href', '#login');
  }
  function openLogin(event) {
    event?.preventDefault();
    event?.stopImmediatePropagation?.();
    const modal = ensureModal();
    const user = getUser();
    modal.hidden = false;
    const logoutButton = modal.querySelector('#logoutButton');
    if (logoutButton) logoutButton.style.display = user ? 'block' : 'none';
  }
  function boot() {
    ensureModal();
    updateLoginButton();
    const button = document.querySelector('.login-btn');
    if (button) button.addEventListener('click', openLogin, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();