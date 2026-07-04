(() => {
  const photoKeys = () => Object.keys(localStorage).filter(key => key.startsWith('morantPhoto:') || key === 'morantHeroLogo').sort();
  const readJson = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
  const migrationPayload = () => {
    const photos = photoKeys().map(key => ({ key, dataUrl: localStorage.getItem(key), approxBytes: (localStorage.getItem(key) || '').length }));
    return {
      importId: 'morant-migration-' + new Date().toISOString().replace(/[:.]/g, '-'),
      sourceDomain: location.origin,
      exportedAt: new Date().toISOString(),
      photos,
      registrations: readJson('morantReunionRegistrations'),
      notifications: readJson('morantNotificationSignups'),
      familyUpdates: readJson('morantFamilySubmissions'),
      pendingChildren: readJson('morantPendingGrandchildren'),
      notes: 'Exported from browser localStorage before migration to live database.'
    };
  };
  function download(name, content, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
  function render() {
    const section = document.querySelector('#migration');
    if (!section) return;
    const payload = migrationPayload();
    const totalPhotoBytes = payload.photos.reduce((sum, item) => sum + item.approxBytes, 0);
    section.innerHTML = `
      <h2>Migration Center</h2>
      <p>This moves old device-saved data toward the live database. Export this file from each phone or computer that has uploaded photos or saved drafts.</p>
      <div class="migration-grid">
        <div><strong>${payload.photos.length}</strong><small>Local Photos / Logos</small></div>
        <div><strong>${payload.registrations.length}</strong><small>Registration Drafts</small></div>
        <div><strong>${payload.notifications.length}</strong><small>Notification Signups</small></div>
        <div><strong>${payload.familyUpdates.length}</strong><small>Family Updates</small></div>
        <div><strong>${payload.pendingChildren.length}</strong><small>Pending Children</small></div>
        <div><strong>${Math.round(totalPhotoBytes / 1024)} KB</strong><small>Approx Photo Data</small></div>
      </div>
      <div class="migration-actions">
        <button id="downloadMigration" type="button">Download Migration File</button>
        <button id="copyMigrationSummary" type="button">Copy Summary</button>
      </div>
      <p class="note">After downloading, upload the migration JSON here so it can be imported into Airtable. Photos remain preserved in the file as data URLs until we move to permanent cloud photo storage.</p>
      <details><summary>View local photo keys</summary><pre>${payload.photos.map(p => p.key).join('\n') || 'No local photos found.'}</pre></details>
    `;
    section.querySelector('#downloadMigration')?.addEventListener('click', () => {
      const fresh = migrationPayload();
      download(`${fresh.importId}.json`, JSON.stringify(fresh, null, 2));
    });
    section.querySelector('#copyMigrationSummary')?.addEventListener('click', async () => {
      const fresh = migrationPayload();
      const summary = `Migration ${fresh.importId}\nPhotos: ${fresh.photos.length}\nRegistrations: ${fresh.registrations.length}\nNotifications: ${fresh.notifications.length}\nFamily Updates: ${fresh.familyUpdates.length}\nPending Children: ${fresh.pendingChildren.length}`;
      try { await navigator.clipboard.writeText(summary); alert('Migration summary copied.'); } catch { alert(summary); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();