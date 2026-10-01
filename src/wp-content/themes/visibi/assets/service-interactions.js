/* Restore the source HTML project's service widgets after its markup is imported into WordPress. */
const visibiServiceDataUrl = new URL('service-interactions-data.json', document.currentScript.src);
document.addEventListener('DOMContentLoaded', async () => {
  const slug = location.pathname.replace(/\/$/, '').split('/').pop();
  let data;
  try { data = (await (await fetch(visibiServiceDataUrl)).json())[slug]; } catch { return; }
  if (!data) return;
  const hero = document.querySelector('.visibi-content section[data-screen-label="Hero"]');
  const pricing = document.querySelector('.visibi-content #pricing');
  const money = value => '£' + Math.round(value).toLocaleString('en-GB');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero && data.group === 'marketing') {
    const issues = [...hero.querySelectorAll('button')].filter(button => /^(Found:|Fixed:)/.test(button.textContent.trim()));
    const toggle = [...hero.querySelectorAll('button')].find(button => /See it after VISIBI|Before VISIBI/.test(button.textContent));
    const score = [...hero.querySelectorAll('span')].find(span => /^SCORE\s+\d+%/.test(span.textContent.trim()));
    const progress = score?.parentElement?.nextElementSibling?.firstElementChild;
    let selected = 0, after = false;
    const render = () => {
      issues.forEach((button, index) => {
        const active = selected === index;
        const body = button.children[1];
        const label = body?.children[0];
        let description = body?.children[1];
        if (body && !description) { description = document.createElement('span'); description.style.cssText = 'font-size:13px;color:#b9c4dd;line-height:1.5'; body.append(description); }
        if (label) label.textContent = (after ? 'Fixed: ' : 'Found: ') + (data.services[index]?.[0] || 'Issue');
        if (description) { description.textContent = data.services[index]?.[1] || ''; description.hidden = !active; }
        if (button.children[2]) { button.children[2].textContent = after ? ['+18%', '+24%', '+11%'][index] : 'Issue'; button.children[2].style.color = after ? '#4ade80' : '#fbbf24'; }
        if (button.children[0]) button.children[0].style.background = after ? '#4ade80' : '#fbbf24';
        button.style.background = active ? 'rgba(29,78,216,.25)' : 'rgba(255,255,255,.04)';
        button.style.borderColor = active ? 'rgba(111,152,255,.5)' : 'rgba(255,255,255,.08)';
        button.setAttribute('aria-pressed', String(active));
      });
      if (score) { score.textContent = 'SCORE ' + (after ? '86%' : '42%'); score.style.color = after ? '#4ade80' : '#f59e0b'; }
      if (progress) { progress.style.width = after ? '86%' : '42%'; progress.style.background = after ? '#4ade80' : '#f59e0b'; }
      if (toggle) { toggle.textContent = after ? '← Before VISIBI' : 'See it after VISIBI →'; toggle.style.background = after ? 'transparent' : '#1d4ed8'; toggle.setAttribute('aria-pressed', String(after)); }
    };
    issues.forEach((button, index) => button.addEventListener('click', () => { selected = index; render(); }));
    toggle?.addEventListener('click', () => { after = !after; render(); });
    if (issues.length) render();
  }

  if (hero && data.group === 'cloud') {
    const bill = hero.querySelector('input[inputmode="decimal"]');
    const slider = hero.querySelector('input[type="range"][aria-label="Monthly bill"]');
    const values = [...hero.querySelectorAll('span')].filter(span => !span.children.length && /^£[\d,]+$/.test(span.textContent.trim()));
    const render = value => {
      const amount = Math.max(0, Number(String(value).replace(/[^\d.]/g, '')) || 0);
      if (bill) bill.value = String(value);
      if (slider) slider.value = String(Math.min(200000, Math.max(1000, amount)));
      if (values[0]) values[0].textContent = money(amount);
      if (values[1]) values[1].textContent = money(amount * .65);
      if (values[2]) values[2].textContent = money(amount * .35 * 12);
    };
    bill?.addEventListener('input', () => render(bill.value));
    slider?.addEventListener('input', () => render(slider.value));
  }

  if (hero && data.group === 'consulting') {
    const groups = [...hero.querySelectorAll('button')].filter(button => /^(Grow|Cut costs|Modernise|Now|This quarter|This year|Small|Mid-size|Enterprise)$/.test(button.textContent.trim()));
    const answers = [0, 1, 1];
    const render = () => {
      groups.forEach((button, index) => {
        const active = answers[Math.floor(index / 3)] === index % 3;
        button.style.background = active ? 'rgba(29,78,216,.35)' : 'rgba(255,255,255,.04)';
        button.style.borderColor = active ? '#6f98ff' : 'rgba(255,255,255,.12)';
        button.setAttribute('aria-pressed', String(active));
      });
      const plan = data.plans[Math.min(data.plans.length - 1, answers[2] === 2 ? 2 : answers[1] === 0 ? 0 : 1)];
      const title = [...hero.querySelectorAll('span')].find(span => span.textContent.trim() === 'Strategy sprint' || span.textContent.trim() === 'Workshop' || span.dataset.visibiRecommendation);
      if (title && plan) { title.dataset.visibiRecommendation = '1'; title.textContent = plan[0].charAt(0) + plan[0].slice(1).toLowerCase(); }
    };
    groups.forEach((button, index) => button.addEventListener('click', () => { answers[Math.floor(index / 3)] = index % 3; render(); }));
    if (groups.length === 9) render();
  }

  if (pricing && data.plans?.length) {
    const monthly = [...pricing.querySelectorAll('button')].find(button => button.textContent.trim() === 'Monthly');
    const annual = [...pricing.querySelectorAll('button')].find(button => /^Annual/.test(button.textContent.trim()));
    const code = pricing.querySelector('input[placeholder="Promo code"]');
    const apply = code?.nextElementSibling;
    const promo = pricing.children[1]?.querySelector('div:first-child > span:nth-child(2)');
    const cards = [...(pricing.children[2]?.children || [])].slice(0, data.plans.length);
    const feedback = document.createElement('span');
    feedback.setAttribute('role', 'status');
    feedback.style.cssText = 'font-size:12px;color:#b91c1c;align-self:center';
    code?.parentElement?.after(feedback);
    let annualBilling = false, applied = false;
    const render = () => {
      [monthly, annual].forEach((button, index) => {
        if (!button) return;
        const active = annualBilling === !!index;
        button.setAttribute('aria-pressed', String(active));
        button.style.background = active ? '#0b1530' : 'transparent';
        button.style.color = active ? '#fff' : '#5a6680';
      });
      cards.forEach((card, index) => {
        const plan = data.plans[index];
        const base = Number(plan[2]);
        const sale = annualBilling && data.annual ? base * .85 : base;
        const price = applied ? sale * .8 : sale;
        const block = card.children[1];
        const regular = block?.children[0]?.firstElementChild;
        const amount = block?.children[1]?.firstElementChild?.firstElementChild;
        const note = block?.children[2]?.firstElementChild;
        const unit = plan[4] || data.unit;
        if (regular) regular.textContent = money(sale * 2);
        if (amount) amount.textContent = money(price);
        if (note) note.textContent = (unit === '/mo' && !data.annual ? 'per month, rolling' : data.annual ? (annualBilling ? `per month, billed annually (${money(price * 12)}/yr)` : 'per month, billed monthly') : 'one-off, fixed price') + (applied ? ' · EXTRA20 applied' : '');
      });
      if (promo) promo.textContent = applied ? 'EXTRA20 applied — 60% off your first term' : 'Limited-time offer — plus an extra 20% off with code EXTRA20';
      if (apply) apply.textContent = applied ? 'Remove' : 'Apply';
    };
    monthly?.addEventListener('click', () => { annualBilling = false; render(); });
    annual?.addEventListener('click', () => { annualBilling = true; render(); });
    code?.addEventListener('input', () => { code.removeAttribute('aria-invalid'); feedback.textContent = ''; });
    apply?.addEventListener('click', () => {
      if (applied) { applied = false; code.value = ''; feedback.textContent = ''; }
      else if (code.value.trim().toUpperCase() === 'EXTRA20') { applied = true; feedback.textContent = ''; }
      else { code.setAttribute('aria-invalid', 'true'); feedback.textContent = 'That code is not valid. Try EXTRA20.'; }
      render();
    });
    if (cards.length === data.plans.length) render();
  }

  if (hero && !reduce && ['security', 'support', 'fleet'].includes(data.group)) {
    const heading = [...hero.querySelectorAll('div,span')].find(node => /^(LIVE PROTECTION|SUPPORT DESK|FLEET JOBS)/.test(node.textContent.trim()) && ![...node.children].some(child => /^(LIVE PROTECTION|SUPPORT DESK|FLEET JOBS)/.test(child.textContent.trim())));
    const titleRow = heading?.parentElement?.children.length === 2 ? heading.parentElement : heading?.parentElement?.parentElement;
    const card = titleRow?.parentElement;
    const entries = [...(card?.children[2]?.children || [])];
    const stats = [...(card?.children[1]?.children || [])];
    const securityEvents = ['SQL injection blocked', 'Bad bot challenged', 'Card-testing attempt stopped', 'Brute-force login blocked', 'XSS payload blocked', 'Skimmer script prevented', 'Spam sign-up rejected', 'DDoS burst absorbed'];
    const fleetJobs = ['Wave 3 · Linux kernel patch · 25%', 'Canary · Windows cumulative update', 'Scheduled · certificate renewal', 'On-demand · log clean-up script', 'Wave 4 · OpenSSL update · 50%', 'Scheduled · CIS compliance scan'];
    let tick = 1;
    if (entries.length === 4) window.setInterval(() => {
      tick++;
      if (data.group === 'security') {
        const count = card.children[1]?.children[0];
        if (count) count.textContent = (12840 + tick * 7).toLocaleString('en-GB');
      } else if (stats[data.group === 'fleet' ? 0 : 2]?.children[0]) {
        stats[data.group === 'fleet' ? 0 : 2].children[0].textContent = data.group === 'fleet' ? (118400 + tick * 37).toLocaleString('en-GB') : String(1240 + tick);
      }
      entries.forEach((entry, index) => {
        const title = entry.children[0];
        const state = entry.children[1];
        if (title) title.textContent = data.group === 'security' ? securityEvents[(tick + index) % securityEvents.length] : data.group === 'fleet' ? fleetJobs[(tick + index) % fleetJobs.length] : data.services[(tick + index) % data.services.length]?.[0] || title.textContent;
        if (state) state.textContent = data.group === 'security' ? index ? `${index * 3} min ago` : 'just now' : index ? data.group === 'fleet' ? 'Complete' : 'Resolved' : data.group === 'fleet' ? 'Running' : 'In progress';
        entry.style.background = index ? 'rgba(255,255,255,.04)' : data.group === 'security' ? 'rgba(74,222,128,.12)' : 'rgba(251,191,36,.10)';
      });
    }, 2200);
  }
});
