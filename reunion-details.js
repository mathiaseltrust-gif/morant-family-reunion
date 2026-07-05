(() => {
  const data = window.MORANT_FAMILY_DATA || {};
  const reunion = data.reunion || {
    title: 'Morant Family Reunion 2026',
    location: 'San Antonio, Texas',
    startDate: '2026-07-24',
    endDate: '2026-07-26',
    cost: '$120 per adult. Include T-shirt size with payment.',
    contact: { name: 'Auntie Lynette Johnson', phone: '(210) 317-0330', cashApp: '$LynJohnson260', zelle: '210-317-0330' },
    nextMeeting: { dialIn: '647-802-2164', accessCode: 'Jesus', times: ['6:00 PM PST', '8:00 PM CST', '9:00 PM EST'] }
  };

  function formatEndDate(dateText) {
    const date = new Date(dateText + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10).replaceAll('-', '');
  }

  function downloadCalendar() {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Morant Family Reunion//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:morant-family-reunion-2026@morantfamilyreunion.com',
      'DTSTAMP:20260704T120000Z',
      'SUMMARY:' + reunion.title,
      'LOCATION:' + reunion.location,
      'DESCRIPTION:' + reunion.cost + ' Contact ' + reunion.contact.name + ' ' + reunion.contact.phone,
      'DTSTART;VALUE=DATE:' + reunion.startDate.replaceAll('-', ''),
      'DTEND;VALUE=DATE:' + formatEndDate(reunion.endDate),
      'BEGIN:VALARM',
      'TRIGGER:-P14D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Morant Family Reunion is in two weeks.',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-P2D',
      'ACTION:DISPLAY',
      'DESCRIPTION:Morant Family Reunion starts soon.',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
    anchor.download = 'morant-family-reunion-2026.ics';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  function loadLiveLineage() {
    if (document.querySelector('script[data-live-lineage]')) return;
    const script = document.createElement('script');
    script.src = 'live-lineage.js';
    script.setAttribute('data-live-lineage', 'true');
    document.body.appendChild(script);
  }

  function render() {
    const card = document.querySelector('#reunion');
    if (card && !card.querySelector('.reunion-details')) {
      card.insertAdjacentHTML('beforeend', '<div class="reunion-details"><p><strong>Dates:</strong> July 24–26, 2026</p><p><strong>Location:</strong> ' + reunion.location + '</p><p><strong>Meeting dial-in:</strong> ' + reunion.nextMeeting.dialIn + '<br><strong>Access code:</strong> ' + reunion.nextMeeting.accessCode + '</p><p>' + reunion.nextMeeting.times.join(' • ') + '</p><p><strong>Contact:</strong> ' + reunion.contact.name + ' ' + reunion.contact.phone + '</p><p><strong>Payment:</strong> Cash App ' + reunion.contact.cashApp + ' / Zelle ' + reunion.contact.zelle + '</p><p><strong>Cost:</strong> ' + reunion.cost + '</p></div>');
      setTimeout(() => {
        const button = document.querySelector('#downloadCalendar');
        if (button) button.onclick = downloadCalendar;
      }, 300);
    }
    loadLiveLineage();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();