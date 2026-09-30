/* Reconnect the approved AI Agents HTML demo and filters after WordPress import. */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.visibi-content section[data-screen-label="Hero"]');
  const usecases = document.querySelector('#usecases');
  const packages = document.querySelector('#packages');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenarios = [
    ['Support', 'SUPPORT TRIAGE', [['RECEIVE', 'New ticket: “Order #48213 hasn’t arrived”'], ['LOOKUP', 'Order found · carrier API: delayed at depot'], ['DECIDE', 'Within policy → offer reship or refund'], ['ACT', 'Reply drafted, reship queued in ERP'], ['ESCALATE', 'Refund > £200 → sent to human for approval']], 'Handled in 38 seconds · 11 min saved'],
    ['Sales', 'LEAD QUALIFICATION', [['RECEIVE', 'Web form: “Need 40 seats, Q3 rollout”'], ['ENRICH', 'Company found · 220 staff · fintech'], ['SCORE', 'Fit 92/100 → high priority'], ['ACT', 'CRM deal created, meeting slots sent'], ['ESCALATE', 'Enterprise deal → AE notified in Slack']], 'Qualified in 22 seconds · replied instantly'],
    ['Finance', 'INVOICE CHASING', [['SCAN', '14 invoices overdue > 30 days'], ['CHECK', 'Payment history & disputes reviewed'], ['DECIDE', '11 reminders · 3 need a call'], ['ACT', 'Personalised reminders sent via Xero'], ['ESCALATE', '£18k disputed invoice → finance lead']], '£46k chased in 2 minutes'],
    ['Ops', 'STOCK & SUPPLIERS', [['MONITOR', 'SKU MX-204 below reorder point'], ['FORECAST', '9 days of stock left at current sales'], ['DECIDE', 'Reorder 600 units from preferred supplier'], ['ACT', 'PO drafted in ERP, supplier emailed'], ['ESCALATE', 'PO > £10k → manager approval']], 'Stock-out avoided · 0 manual steps']
  ];
  if (hero) {
    const tabGrid = [...hero.querySelectorAll('div')].find(div => div.children.length === 4 && [...div.children].every((child, index) => child.tagName === 'BUTTON' && child.textContent.trim() === scenarios[index][0]));
    const tabs = [...(tabGrid?.children || [])];
    const panel = tabGrid?.parentElement;
    const titleRow = panel?.children[1];
    const runRows = [...(panel?.children || [])].slice(2, 7);
    const footer = panel?.children[7];
    const replay = footer?.querySelector('button');
    const saved = footer?.querySelector('span');
    let chosen = 0, step = 5, manual = false, runTimer, nextTimer;
    const render = () => {
      const scenario = scenarios[chosen];
      tabs.forEach((tab, index) => { const active = index === chosen; tab.style.background = active ? '#fff' : 'transparent'; tab.style.color = active ? '#0b1530' : '#b9c4dd'; tab.setAttribute('aria-pressed', String(active)); });
      if (titleRow?.children[0]) titleRow.children[0].textContent = 'AGENT RUN · ' + scenario[1];
      if (titleRow?.children[1]) { titleRow.children[1].textContent = '● ' + (step >= 5 ? 'DONE' : 'RUNNING'); titleRow.children[1].style.color = step >= 5 ? '#4ade80' : '#6f98ff'; }
      runRows.forEach((row, index) => {
        const [key, value] = scenario[2][index];
        if (row.children[0]) row.children[0].textContent = key;
        if (row.children[1]) row.children[1].textContent = value;
        if (row.children[2]) row.children[2].textContent = index < step || step >= 5 ? '✓' : index === step ? '…' : '';
        row.style.opacity = index <= step ? '1' : '.25';
        row.style.background = index === step && step < 5 ? 'rgba(29,78,216,.22)' : 'rgba(255,255,255,.04)';
        row.style.borderColor = index === step && step < 5 ? 'rgba(111,152,255,.5)' : 'rgba(255,255,255,.08)';
      });
      if (saved) saved.textContent = step >= 5 ? scenario[3] : 'Working…';
    };
    const start = (index, fromClick = false) => {
      clearInterval(runTimer); clearTimeout(nextTimer);
      if (fromClick) manual = true;
      chosen = index; step = reduced ? 5 : 0; render();
      if (reduced) return;
      runTimer = setInterval(() => {
        step += 1; render();
        if (step >= 5) {
          clearInterval(runTimer);
          if (!manual) nextTimer = setTimeout(() => start((chosen + 1) % scenarios.length), 2600);
        }
      }, 850);
    };
    tabs.forEach((tab, index) => tab.addEventListener('click', () => start(index, true)));
    replay?.addEventListener('click', () => start(chosen, true));
    if (tabs.length === 4 && runRows.length === 5) start(0);
  }

  const cases = {
    Marketing: [['Content operations agent', 'Briefs, drafts, optimises and schedules content against your brand and GEO guidelines.', 'CMS · GA4 · SEARCH CONSOLE'], ['Campaign reporting agent', 'Pulls ad, analytics and CRM data into weekly insight reports.', 'GOOGLE ADS · META · HUBSPOT'], ['AI visibility monitor', 'Tracks how AI engines describe you and flags inaccuracies.', 'CHATGPT · GEMINI · PERPLEXITY']],
    Sales: [['Lead research agent', 'Enriches inbound leads and drafts tailored first replies.', 'CRM · LINKEDIN · EMAIL'], ['Proposal agent', 'Assembles proposals from templates, pricing and past wins.', 'DOCS · CRM'], ['Pipeline hygiene agent', 'Chases stale deals and updates CRM fields automatically.', 'SALESFORCE · HUBSPOT']],
    Support: [['Ticket triage agent', 'Classifies, prioritises and routes tickets; resolves the routine ones.', 'ZENDESK · FRESHDESK'], ['Order status agent', 'Answers where-is-my-order with live data from your store and carrier.', 'SHOPIFY · MAGENTO · CARRIERS'], ['Returns agent', 'Handles eligibility, labels and refunds within policy limits.', 'ERP · PAYMENTS']],
    Finance: [['Invoice processing agent', 'Extracts, matches and posts invoices; escalates exceptions.', 'XERO · SAGE · NETSUITE'], ['Month-end agent', 'Reconciles accounts and prepares close checklists.', 'ERP · BANK FEEDS'], ['Spend monitor', 'Flags anomalies and duplicate payments.', 'ERP · CARDS']],
    HR: [['Onboarding agent', 'Coordinates accounts, documents and first-week schedules.', 'HRIS · SLACK · GOOGLE WORKSPACE'], ['Policy Q&A agent', 'Answers staff questions from your handbook, with sources.', 'INTRANET · SLACK'], ['Recruiting coordinator', 'Screens applications and books interviews.', 'ATS · CALENDAR']],
    Operations: [['Inventory agent', 'Forecasts stock, raises POs and alerts on shortfalls.', 'ERP · WMS'], ['Catalogue agent', 'Enriches product data and keeps feeds GEO-ready.', 'PIM · STORE · FEEDS'], ['Reporting agent', 'Daily ops dashboards and exception alerts.', 'BI · SLACK']]
  };
  if (usecases) {
    const tabs = [...usecases.querySelectorAll('button')].filter(button => Object.hasOwn(cases, button.textContent.trim()));
    const cards = [...(tabs[0]?.parentElement?.nextElementSibling?.children || [])];
    const select = team => {
      tabs.forEach(button => { const active = button.textContent.trim() === team; button.style.background = active ? '#0b1530' : '#fff'; button.style.color = active ? '#fff' : '#0b1530'; button.style.borderColor = active ? '#0b1530' : '#e3e8f2'; button.setAttribute('aria-pressed', String(active)); });
      cards.slice(0, 3).forEach((card, index) => { [...card.children].forEach((cell, part) => { if (cases[team][index]?.[part]) cell.textContent = cases[team][index][part]; }); });
    };
    tabs.forEach(button => button.addEventListener('click', () => select(button.textContent.trim())));
    if (tabs.length === 6 && cards.length >= 3) select('Marketing');
  }

  if (packages) {
    const code = packages.querySelector('input[placeholder="Promo code"]');
    const apply = code?.nextElementSibling;
    const banner = packages.children[1]?.querySelector('div:first-child > span:nth-child(2)');
    const priceNodes = [...packages.querySelectorAll('span')].filter(span => !span.children.length && /^£[\d,]+$/.test(span.textContent.trim()) && span.parentElement?.style.fontSize === '36px');
    const original = priceNodes.map(span => Number(span.textContent.replace(/[^\d]/g, '')));
    const feedback = document.createElement('span'); feedback.setAttribute('role', 'status'); feedback.style.cssText = 'font-size:12px;color:#b91c1c'; code?.parentElement?.after(feedback);
    let applied = false;
    const render = () => {
      priceNodes.forEach((span, index) => { span.textContent = '£' + Math.round(original[index] * (applied ? .8 : 1)).toLocaleString('en-GB'); });
      if (banner) banner.textContent = applied ? 'EXTRA20 applied — 60% off your first term' : 'Launch offer — plus an extra 20% off with code EXTRA20';
      if (apply) apply.textContent = applied ? 'Remove' : 'Apply';
    };
    code?.addEventListener('input', () => { code.removeAttribute('aria-invalid'); feedback.textContent = ''; });
    apply?.addEventListener('click', () => {
      if (applied) { applied = false; code.value = ''; feedback.textContent = ''; }
      else if (code.value.trim().toUpperCase() === 'EXTRA20') { applied = true; feedback.textContent = ''; }
      else { code.setAttribute('aria-invalid', 'true'); feedback.textContent = 'That code is not valid. Try EXTRA20.'; }
      render();
    });
  }
});
