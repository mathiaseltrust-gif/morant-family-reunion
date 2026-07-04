(() => {
  const data = window.MORANT_FAMILY_DATA || {};
  const r = data.reunion || {
    title: 'Morant Family Reunion 2026',
    location: 'San Antonio, Texas',
    startDate: '2026-07-24',
    endDate: '2026-07-26',
    cost: '$120 per adult. Include T-shirt size with payment.',
    contact: { name: 'Auntie Lynette Johnson', phone: '(210) 317-0330', cashApp: '$LynJohnson260', zelle: '210-317-0330' },
    nextMeeting: { date: 'To be announced', dialIn: '647-802-2164', accessCode: 'Jesus', times: ['6:00 PM PST', '8:00 PM CST', '9:00 PM EST'] },
    familyHistoryPrompt: 'Each family branch may choose someone to share their family history.'
  };

  const AUTH_KEY = 'morantPortalUser';
  const roleLabels = { admin: 'Administrator', elder: 'Elder', member: 'Family Member' };

  function formatEndDate(dateText) {
    const d = new Date(dateText + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replaceAll('-', '');
  }

  function signedInUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
  }

  function setUser(user) {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
    applyAuthState();
  }

  function canAdmin(user) {
    return user && (user.role === 'admin' || user.role === 'elder');
  }

  function applyAuthState() {
    const user = signedInUser();
    const adminAllowed = canAdmin(user);
    document.body.classList.toggle('admin-mode', !!adminAllowed);
    localStorage.setItem('morantAdminMode', adminAllowed ? 'true' : 'false');
    const button = document.querySelector('.login-btn');
    if (button) button.textContent = user ? `${roleLabels[user.role] || 'Signed In'}: ${user.name || 'User'}` : 'Login';
    document.querySelectorAll('[data-auth-status]').forEach(el => {
      el.textContent = user ? `Signed in as ${user.name || 'Family Member'} (${roleLabels[user.role] || user.role})` : 'Not signed in';
    });
  }

  function ensureLoginModal() {
    if (document.querySelector('#loginModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="loginModal" class="login-modal" hidden>
        <div class="login-box">
          <button class="login-close" type="button" aria-label="Close">×</button>
          <h2>Morant Family Login</h2>
          <p class="login-note">Temporary front-end login for this device. Real secure accounts come with backend authentication.</p>
          <p data-auth-status></p>
          <form id="loginForm">
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Role<select name="role"><option value="member">Family Member</option><option value="elder">Elder</option><option value="admin">Administrator</option></select></label>
            <label>Passcode<input name="passcode" type="password" placeholder="Passcode" /></label>
            <button type="submit">Sign In</button>
          </form>
          <button id="logoutButton" type="button">Logout</button>
          <small>Temporary passcodes: member, elder, admin. These are not secure and should be replaced before public admin access.</small>
        </div>
      </div>`);
    const modal = document.querySelector('#loginModal');
    document.querySelector('.login-close').addEventListener('click', () => modal.hidden = true);
    document.querySelector('#logoutButton').addEventListener('click', () => { setUser(null); modal.hidden = true; });
    document.querySelector('#loginForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.target);
      const role = form.get('role');
      const passcode = String(form.get('passcode') || '').trim().toLowerCase();
      const valid = (role === 'member' && passcode === 'member') || (role === 'elder' && passcode === 'elder') || (role === 'admin' && passcode === 'admin');
      if (!valid) return alert('Passcode not accepted for that role.');
      setUser({ name: form.get('name'), role, signedInAt: new Date().toISOString() });
      modal.hidden = true;
    });
  }

  function setupLogin() {
    ensureLoginModal();
    const button = document.querySelector('.login-btn');
    if (!button) return;
    const modal = document.querySelector('#loginModal');
    button.setAttribute('href', '#');
    button.onclick = event => { event.preventDefault(); modal.hidden = false; applyAuthState(); };
    applyAuthState();
  }

  function downloadCalendar() {
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Morant Family Reunion//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
      'BEGIN:VEVENT','UID:morant-family-reunion-2026@morantfamilyreunion.com','DTSTAMP:20260704T120000Z','SUMMARY:' + r.title,
      'LOCATION:' + r.location,
      'DESCRIPTION:' + r.cost + ' Contact ' + r.contact.name + ' ' + r.contact.phone,
      'DTSTART;VALUE=DATE:' + r.startDate.replaceAll('-', ''),'DTEND;VALUE=DATE:' + formatEndDate(r.endDate),
      'BEGIN:VALARM','TRIGGER:-P14D','ACTION:DISPLAY','DESCRIPTION:Morant Family Reunion is in two weeks.','END:VALARM',
      'BEGIN:VALARM','TRIGGER:-P2D','ACTION:DISPLAY','DESCRIPTION:Morant Family Reunion starts soon.','END:VALARM',
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'morant-family-reunion-2026.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function render() {
    setupLogin();
    const card = document.querySelector('#reunion');
    if (!card || card.querySelector('.reunion-details')) return;
    card.insertAdjacentHTML('beforeend', '<div class="reunion-details"><p><strong>Dates:</strong> July 24–26, 2026</p><p><strong>Location:</strong> ' + r.location + '</p><p><strong>Meeting dial-in:</strong> ' + r.nextMeeting.dialIn + '<br><strong>Access code:</strong> ' + r.nextMeeting.accessCode + '</p><p>' + r.nextMeeting.times.join(' • ') + '</p><p><strong>Contact:</strong> ' + r.contact.name + ' ' + r.contact.phone + '</p><p><strong>Payment:</strong> Cash App ' + r.contact.cashApp + ' / Zelle ' + r.contact.zelle + '</p><p><strong>Cost:</strong> ' + r.cost + '</p></div>');
    setTimeout(() => {
      const oldButton = document.querySelector('#downloadCalendar');
      if (oldButton) oldButton.onclick = downloadCalendar;
    }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();