(() => {
  const data = window.MORANT_FAMILY_DATA || {};
  const r = data.reunion;
  if (!r) return;

  function formatEndDate(dateText) {
    const d = new Date(dateText + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replaceAll('-', '');
  }

  function downloadCalendar() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Morant Family Reunion//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:morant-family-reunion-2026@morantfamilyreunion.com',
      'DTSTAMP:20260704T120000Z',
      'SUMMARY:' + r.title,
      'LOCATION:' + r.location,
      'DESCRIPTION:' + r.cost + ' Contact ' + r.contact.name + ' ' + r.contact.phone,
      'DTSTART;VALUE=DATE:' + r.startDate.replaceAll('-', ''),
      'DTEND;VALUE=DATE:' + formatEndDate(r.endDate),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'morant-family-reunion-2026.ics';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function render() {
    const card = document.querySelector('#reunion');
    if (!card || card.querySelector('.reunion-details')) return;
    const location = card.querySelector('p');
    const date = card.querySelector('em');
    if (location) location.textContent = r.location;
    if (date) date.textContent = r.startDate + ' thru ' + r.endDate;
    card.insertAdjacentHTML('beforeend', '<div class="reunion-details"><p><strong>Next meeting:</strong> ' + r.nextMeeting.date + '</p><p><strong>Dial-in:</strong> ' + r.nextMeeting.dialIn + '<br><strong>Access code:</strong> ' + r.nextMeeting.accessCode + '</p><p>' + r.nextMeeting.times.join(' • ') + '</p><p><strong>Contact:</strong> ' + r.contact.name + ' ' + r.contact.phone + '</p><p><strong>Payment:</strong> Cash App ' + r.contact.cashApp + ' / Zelle ' + r.contact.zelle + '</p><p><strong>Cost:</strong> ' + r.cost + '</p><p><strong>Family history:</strong> ' + r.familyHistoryPrompt + '</p></div>');
    setTimeout(() => {
      const oldButton = document.querySelector('#downloadCalendar');
      if (oldButton) oldButton.onclick = downloadCalendar;
    }, 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();