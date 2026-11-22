export const STATS_EVENT = 'lux-stats';

export function recordConversions(count: number) {
  if (count < 1) return;
  fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ count }) })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { total?: number } | null) => {
      if (d?.total) window.dispatchEvent(new CustomEvent(STATS_EVENT, { detail: d.total }));
    })
    .catch(() => {});
}
