document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.visibi-content');
  const hero = content?.querySelector('section[data-screen-label="Hero"]');
  const pricing = content?.querySelector('#pricing');
  if (!hero || !pricing) return;

  const issues = [...hero.querySelectorAll('button')].filter(button => /^(Found:|Fixed:)/.test(button.textContent.trim()));
  const toggle = [...hero.querySelectorAll('button')].find(button => /See it after VISIBI|Before VISIBI/.test(button.textContent));
  const descriptions = [
    'Crawlability, indexation, Core Web Vitals and site architecture fixed by our developers.',
    'Category, product and faceted navigation optimised for buying-intent searches.',
    'Titles, copy, internal links and intent-matched content for priority pages.'
  ];
  const score = [...hero.querySelectorAll('span')].find(span => /^SCORE\s+\d+%/.test(span.textContent.trim()));
  const progress = score?.parentElement?.nextElementSibling?.firstElementChild;
  let selectedIssue = 0;
  let after = false;
  const renderHero = () => {
    issues.forEach((button, index) => {
      const active = index === selectedIssue;
      const body = button.children[1];
      const title = body?.children[0];
      let description = body?.children[1];
      if (body && !description) {
        description = document.createElement('span');
        description.style.cssText = 'font-size:13px;color:#b9c4dd;line-height:1.5';
        body.append(description);
      }
      if (title) title.textContent = (after ? 'Fixed: ' : 'Found: ') + title.textContent.replace(/^(Found:|Fixed:)\s*/, '');
      if (description) { description.textContent = descriptions[index] || ''; description.hidden = !active; }
      if (button.children[2]) {
        button.children[2].textContent = after ? ['+18%', '+24%', '+11%'][index] : 'Issue';
        button.children[2].style.color = after ? '#4ade80' : '#fbbf24';
      }
      if (button.children[0]) button.children[0].style.background = after ? '#4ade80' : '#fbbf24';
      button.style.background = active ? 'rgba(29,78,216,.25)' : 'rgba(255,255,255,.04)';
      button.style.borderColor = active ? 'rgba(111,152,255,.5)' : 'rgba(255,255,255,.08)';
      button.setAttribute('aria-pressed', String(active));
    });
    if (score) { score.textContent = 'SCORE ' + (after ? '86%' : '42%'); score.style.color = after ? '#4ade80' : '#f59e0b'; }
    if (progress) { progress.style.width = after ? '86%' : '42%'; progress.style.background = after ? '#4ade80' : '#f59e0b'; }
    if (toggle) { toggle.textContent = after ? '← Before VISIBI' : 'See it after VISIBI →'; toggle.style.background = after ? 'transparent' : '#1d4ed8'; toggle.setAttribute('aria-pressed', String(after)); }
  };
  issues.forEach((button, index) => button.addEventListener('click', () => { selectedIssue = index; renderHero(); }));
  toggle?.addEventListener('click', () => { after = !after; renderHero(); });
  renderHero();

  const monthly = [...pricing.querySelectorAll('button')].find(button => button.textContent.trim() === 'Monthly');
  const annual = [...pricing.querySelectorAll('button')].find(button => /^Annual/.test(button.textContent.trim()));
  const code = pricing.querySelector('input[placeholder="Promo code"]');
  const apply = code?.nextElementSibling;
  const priceElements = [...pricing.querySelectorAll('span')].filter(span =>
    !span.children.length && /^[£$][\d,]+$/.test(span.textContent.trim()) && span.parentElement?.style.fontSize === '38px');
  const prices = priceElements.map(span => Number(span.textContent.replace(/[^\d]/g, '')));
  const promoText = [...pricing.querySelectorAll('span')].find(span => span.textContent.trim().startsWith('Limited-time offer'));
  const feedback = document.createElement('span');
  feedback.setAttribute('role', 'status');
  feedback.style.cssText = 'font-size:12px;color:#b91c1c;align-self:center';
  code?.parentElement?.after(feedback);
  let annualBilling = false;
  let applied = false;
  const money = amount => '£' + Math.round(amount).toLocaleString('en-GB');
  const renderPricing = () => {
    [monthly, annual].forEach((button, index) => {
      if (!button) return;
      const active = annualBilling === !!index;
      button.setAttribute('aria-pressed', String(active));
      button.style.background = active ? '#0b1530' : 'transparent';
      button.style.color = active ? '#fff' : '#5a6680';
    });
    priceElements.forEach((element, index) => {
      const price = prices[index] * (annualBilling ? 0.85 : 1) * (applied ? 0.8 : 1);
      element.textContent = money(price);
      const note = element.parentElement?.parentElement?.nextElementSibling;
      if (note) note.textContent = annualBilling ? `per month, billed annually (${money(price * 12)}/yr)` : 'per month, billed monthly';
    });
    if (promoText) promoText.textContent = applied ? 'EXTRA20 applied — 60% off your first term' : 'Limited-time offer — plus an extra 20% off with code EXTRA20';
    if (apply) apply.textContent = applied ? 'Remove' : 'Apply';
  };
  monthly?.addEventListener('click', () => { annualBilling = false; renderPricing(); });
  annual?.addEventListener('click', () => { annualBilling = true; renderPricing(); });
  code?.addEventListener('input', () => { code.removeAttribute('aria-invalid'); feedback.textContent = ''; });
  apply?.addEventListener('click', () => {
    if (applied) { applied = false; if (code) code.value = ''; feedback.textContent = ''; }
    else if (code?.value.trim().toUpperCase() === 'EXTRA20') { applied = true; feedback.textContent = ''; }
    else { if (code) code.setAttribute('aria-invalid', 'true'); feedback.textContent = 'That code is not valid. Try EXTRA20.'; }
    renderPricing();
  });
  renderPricing();
});
