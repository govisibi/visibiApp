document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('[data-visibi-insights-list]');
  const hero = document.querySelector('.visibi-content section[data-screen-label="Hero"]');
  if (!list || !hero) return;
  const cards = [...list.querySelectorAll('[data-visibi-insight-card]')];
  const more = list.querySelector('[data-visibi-insights-more]');
  const empty = list.querySelector('[data-visibi-insights-empty]');
  const buttons = [...(hero.querySelector('h1')?.parentElement?.querySelectorAll('button') || [])];
  const search = hero.querySelector('input[aria-label="Search guides"]');
  const chips = [...(search?.nextElementSibling?.querySelectorAll('button') || [])];
  const results = search?.nextElementSibling?.nextElementSibling;
  const sampleResult = results?.querySelector('a')?.cloneNode(true);
  const originalResults = results?.cloneNode(true);
  const quickTerms = { 'Slow store': 'performance', 'Hacked site': 'security', 'AWS bill': 'aws', 'AI visibility': 'geo', 'Tracking': 'analytics' };
  let category = 'All';
  let shown = 12;

  const matches = card => {
    const cat = card.dataset.category || '';
    const query = (search?.value || '').trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    return (category === 'All' || cat.toLowerCase() === category.toLowerCase()) &&
      words.every(word => (card.dataset.search || '').includes(word));
  };
  const render = () => {
    const filtered = cards.filter(matches);
    cards.forEach(card => { card.hidden = true; });
    filtered.slice(0, shown).forEach(card => { card.hidden = false; });
    const remaining = Math.max(0, filtered.length - shown);
    if (more) { more.hidden = remaining === 0; more.textContent = `Show more articles (${remaining})`; }
    if (empty) empty.hidden = filtered.length !== 0;
    buttons.forEach(button => {
      const selected = button.textContent.trim() === category;
      button.setAttribute('aria-pressed', String(selected));
      button.style.background = selected ? '#fff' : 'transparent';
      button.style.color = selected ? '#0b1530' : '#b9c4dd';
      button.style.borderColor = selected ? '#fff' : 'rgba(255,255,255,.2)';
    });
    if (results && originalResults && !(search?.value || category !== 'All')) {
      results.replaceChildren(...[...originalResults.children].map(child => child.cloneNode(true)));
    } else if (results && sampleResult) {
      results.replaceChildren(...filtered.slice(0, 3).map(card => {
        const link = sampleResult.cloneNode(true);
        link.href = card.href;
        link.textContent = card.querySelector('div:nth-child(2)')?.textContent || card.textContent;
        return link;
      }));
    }
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.textContent.trim();
    shown = 12;
    render();
  }));
  search?.addEventListener('input', () => { shown = 12; render(); });
  chips.forEach(button => button.addEventListener('click', () => {
    category = 'All';
    if (search) search.value = quickTerms[button.textContent.trim()] || button.textContent.trim();
    shown = 12;
    render();
    search?.focus();
  }));
  more?.addEventListener('click', () => { shown += 12; render(); });
  render();
});
