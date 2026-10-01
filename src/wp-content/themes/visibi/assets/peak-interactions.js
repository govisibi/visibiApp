document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  if (!$('[data-peak-countdown]')) return;
  const money = n => '£' + Math.round(n).toLocaleString('en-GB');
  const clock = () => {
    let t = Math.max(0, Date.parse('2026-11-27T00:00:00Z') - Date.now());
    const parts = {days: Math.floor(t / 864e5), hours: Math.floor(t / 36e5) % 24, mins: Math.floor(t / 6e4) % 60, secs: Math.floor(t / 1e3) % 60};
    Object.entries(parts).forEach(([k, v]) => { const e = $(`[data-peak-countdown="${k}"]`); if (e) e.textContent = String(v).padStart(2, '0'); });
    const f = Date.parse('2026-11-02T00:00:00Z'), s = Date.parse('2026-09-01T00:00:00Z');
    const days = Math.max(0, Math.ceil((f - Date.now()) / 864e5));
    $('[data-peak-freeze-left]').textContent = days ? `${days} days left` : 'Code freeze reached';
    $('[data-peak-freeze-progress]').style.width = `${Math.max(0, Math.min(100, (Date.now() - s) / (f - s) * 100))}%`;
  };
  clock(); setInterval(clock, 1000);

  const weeks = [['Oct wk 1',72,0],['Oct wk 2',78,0],['Oct wk 3',84,0],['Oct wk 4',90,0],['Nov wk 1',95,1],['Nov wk 2',98,1],['Nov wk 3',104,1],['Black Friday',110.8,2],['Cyber Monday',108,2],['Dec wk 1',101,2],['Dec wk 2',97,2],['Dec wk 3',92,2],['Boxing Day',106,2]];
  const tips = ['Run your load test now — traffic is already building and there is time to fix what breaks.','Code freeze and final retests. Changes from here should be emergency-only.','Engineers watching live dashboards, ready to scale or roll back within minutes.'];
  const weekButtons = $$('[data-peak-week]'), phases = $$('[data-peak-phase]');
  let selected = 7;
  const select = i => {
    selected = i;
    const [label, value, phase] = weeks[i];
    $('[data-peak-season-label]').textContent = label;
    const valueNode = $('[data-peak-season-value]');
    valueNode.textContent = `${value >= 100 ? '+' : ''}${(value - 100).toFixed(value % 1 ? 1 : 0)}% vs Nov avg`;
    valueNode.style.color = value >= 100 ? '#fca5a5' : '#86efac';
    $('[data-peak-season-tip]').textContent = tips[phase];
    weekButtons.forEach((b, n) => { const active = n === i; b.setAttribute('aria-pressed', String(active)); b.style.background = active ? '#6f98ff' : weeks[n][2] === phase ? ['#22c55e','#f59e0b','#ef4444'][phase] : 'rgba(255,255,255,.14)'; b.style.boxShadow = active ? '0 0 0 2px #fff' : 'none'; });
    phases.forEach((b, n) => { const active = n === phase; b.setAttribute('aria-pressed', String(active)); b.style.background = active ? ['#22c55e','#f59e0b','#dc2626'][n] : 'transparent'; b.style.color = active ? (n === 2 ? '#fff' : '#0b1530') : '#b9c4dd'; });
  };
  weekButtons.forEach((b, i) => b.addEventListener('click', () => select(i)));
  phases.forEach((b, i) => b.addEventListener('click', () => select(i === 2 ? 7 : weeks.findIndex(w => w[2] === i))));
  select(selected);

  const labels = $$('#calc label').filter(l => l.querySelector('input[type="range"]'));
  if (labels.length === 4) {
    const ranges = labels.map(l => l.querySelector('input[type="range"]'));
    const displays = labels.map(l => l.querySelector('span > span:last-child'));
    const estimate = labels[3].nextElementSibling;
    const render = () => {
      const [visitors, conversion, order, minutes] = ranges.map(r => Number(r.value));
      const values = [visitors.toLocaleString('en-GB'),`${conversion}%`,money(order),minutes >= 60 ? `${+(minutes / 60).toFixed(1)} h` : `${minutes} min`];
      displays.forEach((d, i) => { d.textContent = values[i]; ranges[i].setAttribute('aria-valuetext', values[i]); });
      const perMinute = visitors * conversion / 100 * order;
      estimate.children[1].textContent = money(perMinute * minutes);
      estimate.children[2].textContent = `${money(perMinute)} per minute · lost orders only — excludes wasted ad spend, refunds and customers who don’t return`;
    };
    ranges.forEach(r => r.addEventListener('input', render)); render();
  }

  let promoInput = $('[data-peak-promo-input]');
  const promoButton = $('[data-peak-promo-apply]');
  // WordPress can remove input elements from page HTML. Restore this control before binding the other interactions.
  if (promoButton && !promoInput) {
    promoInput = document.createElement('input');
    promoInput.type = 'text';
    promoInput.placeholder = 'Promo code';
    promoInput.setAttribute('data-peak-promo-input', '1');
    promoInput.style.cssText = 'border:0;outline:none;padding:8px 12px;font-size:13px;width:150px;min-width:0;background:transparent;text-transform:uppercase';
    promoButton.before(promoInput);
  }
  let applied = false;
  const showPromo = () => {
    $$('[data-peak-price]').forEach((e, i) => e.textContent = money([895,2695,1795][i] * (applied ? .8 : 1)));
    $('[data-peak-promo-text]').textContent = applied ? 'EXTRA20 applied — 60% off' : 'Peak season offer — plus an extra 20% off with code EXTRA20';
    promoButton.textContent = applied ? 'Remove' : 'Apply'; promoInput.setAttribute('aria-invalid', 'false');
  };
  if (promoButton && promoInput) promoButton.addEventListener('click', () => {
    if (applied) { applied = false; promoInput.value = ''; }
    else if (promoInput.value.trim().toUpperCase() === 'EXTRA20') applied = true;
    else { promoInput.setAttribute('aria-invalid','true'); promoInput.focus(); return; }
    showPromo();
  });
  if (promoInput && promoButton) promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); promoButton.click(); } });

  $$('[data-peak-faq]').forEach(b => b.addEventListener('click', () => {
    const wasOpen = b.getAttribute('aria-expanded') === 'true';
    $$('[data-peak-faq]').forEach(item => { item.setAttribute('aria-expanded','false'); const answer = document.getElementById(item.getAttribute('aria-controls')); if (answer) answer.hidden = true; item.lastElementChild.textContent = '+'; });
    if (!wasOpen) { b.setAttribute('aria-expanded','true'); const answer = document.getElementById(b.getAttribute('aria-controls')); if (answer) answer.hidden = false; b.lastElementChild.textContent = '−'; }
  }));
  $$('[data-peak-history]').forEach(b => b.addEventListener('click', () => {
    $('[name="visibi_peak_history"]').value = b.dataset.peakHistory;
    $$('[data-peak-history]').forEach(c => c.setAttribute('aria-pressed', String(c === b)));
  }));
});
