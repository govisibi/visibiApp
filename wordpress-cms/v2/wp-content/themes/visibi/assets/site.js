document.addEventListener('DOMContentLoaded', () => {
  const base = (window.visibiSite && window.visibiSite.base) || '/';
  const siteUrl = path => new URL(path.replace(/^\//, ''), base).href;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const closeNav = () => { if (toggle && nav) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } };
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a[href^="#"],a[href*="/"]').forEach(link => link.addEventListener('click', closeNav));

  const services = document.querySelector('#site-services');
  const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
  const selectService = index => {
    serviceTabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.serviceTab === index)));
    document.querySelectorAll('[data-service-panel],[data-service-promo]').forEach(panel => {
      panel.hidden = (panel.dataset.servicePanel ?? panel.dataset.servicePromo) !== index;
    });
  };
  serviceTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectService(tab.dataset.serviceTab));
    tab.addEventListener('mouseenter', () => { if (window.innerWidth > 1180) selectService(tab.dataset.serviceTab); });
    tab.addEventListener('keydown', event => {
      const offset = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
      if (!offset) return;
      event.preventDefault();
      const next = serviceTabs[(index + offset + serviceTabs.length) % serviceTabs.length];
      selectService(next.dataset.serviceTab);
      next.focus();
    });
  });
  document.addEventListener('mousedown', event => { if (services?.open && !services.contains(event.target)) services.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (services) services.open = false; closeNav(); } });

  const banner = document.querySelector('[data-visibi-announcement]');
  if (banner) {
    const messages = JSON.parse(banner.dataset.messages || '[]');
    const link = banner.querySelector('[data-announcement-link]');
    const dots = [...banner.querySelectorAll('[data-announcement-dot]')];
    let current = 0;
    let paused = false;
    let advanceTimer;
    const queueNext = () => {
      window.clearTimeout(advanceTimer);
      if (reducedMotion || messages.length < 2 || banner.hidden) return;
      advanceTimer = window.setTimeout(() => {
        if (paused) { queueNext(); return; }
        show(current + 1);
      }, current === 0 ? 45000 : 4500);
    };
    const show = index => {
      current = (index + messages.length) % messages.length;
      const message = messages[current];
      if (!message) return;
      link.textContent = message[0];
      link.href = siteUrl(message[1]);
      banner.style.background = message[2];
      dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
      queueNext();
    };
    dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.announcementDot))));
    banner.querySelector('.visibi-announcement__close')?.addEventListener('click', () => { banner.hidden = true; window.clearTimeout(advanceTimer); });
    banner.addEventListener('mouseenter', () => { paused = true; });
    banner.addEventListener('mouseleave', () => { paused = false; });
    queueNext();
  }

  document.querySelectorAll('.visibi-content [style*="visibiMarquee"]').forEach(track => {
    const box = track.parentElement;
    box.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    box.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  });

  // Restore the supplied homepage comparison demo, which was otherwise frozen by the HTML export.
  const hero = document.querySelector('.home .visibi-content section[data-screen-label="Hero"]');
  if (hero) {
    const engines = ['ChatGPT', 'Gemini', 'Perplexity', 'Claude'];
    const categories = ['Magento agency', 'managed hosting provider', 'CRM software', 'accounting firm', 'online furniture store'];
    const tabs = [...hero.querySelectorAll('button')].filter(button => engines.includes(button.textContent.trim()));
    const categoryInput = hero.querySelector('input[aria-label="Your category"]');
    const brandInput = hero.querySelector('input[placeholder="yourbrand.com"]');
    const toggleDemo = [...hero.querySelectorAll('button')].find(button => /See it after VISIBI|Before VISIBI/.test(button.textContent));
    const score = [...hero.querySelectorAll('span')].find(span => /^VISIBILITY\s+\d+%$/.test(span.textContent.trim()));
    const answerLabel = [...hero.querySelectorAll('span')].find(span => /^CHATGPT ANSWER$/.test(span.textContent.trim()));
    const progress = score?.parentElement?.nextElementSibling?.firstElementChild;
    const rows = [...(progress?.parentElement?.nextElementSibling?.children || [])].filter(row => row.children.length >= 3);
    let engine = 0, category = 0, after = false, cycling = true;
    const render = () => {
      const brand = brandInput?.value.trim().replace(/^https?:\/\//, '').split('/')[0] || 'Your brand';
      const competitors = [['Competitor A', 'Competitor B'], ['Competitor B', 'Competitor C'], ['Competitor A', 'Competitor C'], ['Competitor C', 'Competitor A']][engine];
      const values = after
        ? [['1', brand, engine === 2 ? 'Recommended · cited source' : 'Recommended'], ['2', competitors[0], 'Cited'], ['3', competitors[1], 'Mentioned']]
        : [['1', competitors[0], 'Recommended'], ['2', competitors[1], engine === 2 ? 'Cited source' : 'Cited'], ['–', brand, 'Not mentioned']];
      tabs.forEach((tab, index) => { tab.style.background = index === engine ? '#fff' : 'transparent'; tab.style.color = index === engine ? '#0b1530' : '#b9c4dd'; tab.setAttribute('aria-pressed', String(index === engine)); });
      if (score) { score.textContent = 'VISIBILITY ' + (after ? [78, 71, 84, 66][engine] : [0, 4, 0, 8][engine]) + '%'; score.style.color = after ? '#4ade80' : '#f87171'; }
      if (progress) { progress.style.width = (after ? [78, 71, 84, 66][engine] : [0, 4, 0, 8][engine]) + '%'; progress.style.background = after ? '#4ade80' : '#f87171'; }
      if (answerLabel) answerLabel.textContent = engines[engine].toUpperCase() + ' ANSWER';
      rows.slice(0, 3).forEach((row, i) => {
        const cells = row.children;
        [values[i][0], values[i][1], values[i][2]].forEach((value, j) => { cells[j].textContent = value; });
        row.style.background = after && i === 0 ? 'rgba(29,78,216,.35)' : 'rgba(255,255,255,.04)';
        row.style.borderColor = after && i === 0 ? '#6f98ff' : 'rgba(255,255,255,.1)';
        cells[1].style.color = !after && i === 2 ? '#8e9ab6' : '#fff';
        cells[2].style.color = !after && i === 2 ? '#f59e0b' : '#8e9ab6';
      });
      if (toggleDemo) { toggleDemo.textContent = after ? '← Before VISIBI' : 'See it after VISIBI →'; toggleDemo.style.background = after ? 'transparent' : '#1d4ed8'; }
    };
    tabs.forEach((tab, index) => tab.addEventListener('click', () => { engine = index; cycling = false; render(); }));
    toggleDemo?.addEventListener('click', () => { after = !after; cycling = false; render(); });
    categoryInput?.addEventListener('focus', () => { cycling = false; });
    categoryInput?.addEventListener('input', () => { cycling = false; });
    brandInput?.addEventListener('input', render);
    if (!reducedMotion) window.setInterval(() => { if (cycling) { category = (category + 1) % categories.length; engine = (engine + 1) % engines.length; if (categoryInput) categoryInput.value = categories[category]; render(); } }, 4200);
    render();
  }

  // Restore controls that the component export rendered as static HTML.
  const home = document.querySelector('.home .visibi-content');
  if (home) {
    const servicesSection = home.querySelector('#services');
    const serviceButtons = [...(servicesSection?.querySelectorAll('button') || [])];
    const serviceGrid = servicesSection?.querySelector('a.scp2')?.parentElement;
    if (serviceButtons.length === 6 && serviceGrid) {
      fetch(window.visibiSite.theme + '/assets/home-services.json')
        .then(response => { if (!response.ok) throw new Error('Service data unavailable'); return response.json(); })
        .then(groups => {
          serviceButtons.forEach(button => button.addEventListener('click', () => {
            const key = button.textContent.trim();
            const cards = groups[key];
            if (!cards) return;
            serviceButtons.forEach(tab => {
              const selected = tab === button;
              tab.setAttribute('aria-pressed', String(selected));
              tab.style.background = selected ? '#0b1530' : 'transparent';
              tab.style.color = selected ? '#fff' : '#5a6680';
            });
            const sample = serviceGrid.querySelector('a.scp2');
            if (!sample) return;
            serviceGrid.replaceChildren(...cards.map(([tag, title, description, path]) => {
              const card = sample.cloneNode(true);
              card.href = siteUrl(path);
              const parts = card.children;
              if (parts[0]) parts[0].textContent = tag;
              if (parts[1]) parts[1].textContent = title;
              if (parts[2]) parts[2].textContent = description;
              return card;
            }));
          }));
        }).catch(() => {});
    }

    const game = home.querySelector('#game');
    game?.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      window.VisibiDodge?.open({ ctaHref: '#audit' });
    }));

    const steps = home.querySelector('#how');
    const stepTabs = [...(steps?.querySelectorAll('button') || [])].filter(button => /GEO|AI agents/i.test(button.textContent));
    const stepCards = [...(steps?.querySelector('div[style*="border-top"]')?.children || [])];
    const paths = {
      geo: [
        ['AI visibility & GEO audit', 'Free analysis of how AI engines interpret your brand, entities and competitors.'],
        ['Entity & knowledge structuring', 'Rebuild your machine-readable foundation: entities, relationships, schemas.'],
        ['GEO implementation', 'Structured data, content frameworks and authority alignment on priority pages.'],
        ['Measurement & iteration', 'Track descriptions, citations, sentiment and recommendation frequency.'],
        ['Continuous tracking', 'Dashboard monitoring of mentions and competitor presence across AI platforms.']
      ],
      agents: [
        ['Opportunity mapping', 'Find the workflows where agents deliver the highest ROI.'],
        ['Solution & safety design', 'Roles, guardrails, permissions, data access and integrations.'],
        ['Custom agent development', 'Reasoning, tools, APIs and knowledge bases built around real work.'],
        ['Deployment & AgentOps', 'Production monitoring, observability, compliance and human-in-the-loop.'],
        ['Optimise & scale', 'Extend from one use case to many teams based on proven impact.']
      ]
    };
    stepTabs.forEach((button, index) => button.addEventListener('click', () => {
      stepTabs.forEach((tab, i) => {
        tab.style.background = i === index ? '#0b1530' : 'transparent';
        tab.style.color = i === index ? '#fff' : '#5a6680';
        tab.setAttribute('aria-pressed', String(i === index));
      });
      stepCards.slice(0, 5).forEach((card, i) => {
        const cells = card.children;
        if (cells[1]) cells[1].textContent = paths[index ? 'agents' : 'geo'][i][0];
        if (cells[2]) cells[2].textContent = paths[index ? 'agents' : 'geo'][i][1];
      });
    }));
  }

  document.querySelectorAll('.visibi-content a[href$=".dc.html"]').forEach(link => {
    const label = decodeURIComponent(link.getAttribute('href').split('/').pop().replace(/\.dc\.html$/, ''));
    const slug = label.toLowerCase().replace(/^article - /, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    link.href = siteUrl((label.startsWith('Article - ') ? 'insights/' : '') + slug + '/');
  });
  document.querySelectorAll('.visibi-content [data-visibi-static-action]').forEach(button => {
    button.addEventListener('click', () => { window.location.href = siteUrl('contact/#form'); });
  });
});
