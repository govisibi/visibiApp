(() => {
  const hero = document.querySelector('[data-screen-label="Hero"]');
  if (!hero) return;

  const urlFields = [...document.querySelectorAll('#audit input[name="visibi_url"]')];
  const heroField = document.createElement('input');
  heroField.type = 'text';
  heroField.inputMode = 'url';
  heroField.autocomplete = 'url';
  heroField.placeholder = 'Enter your store URL';
  heroField.setAttribute('aria-label', 'Store URL');
  heroField.className = 'visibi-ecommerce-url';
  const heroAction = hero.querySelector('a[href="#audit"]');
  if (heroAction) {
    heroAction.before(heroField);
    heroAction.addEventListener('click', () => {
      if (urlFields[0] && heroField.value.trim()) urlFields[0].value = heroField.value.trim();
    });
  }

  const calculator = document.getElementById('calculator');
  if (calculator) {
    const config = [
      { key: 'visitors', min: 5000, max: 500000, step: 5000, value: 50000 },
      { key: 'aov', min: 20, max: 500, step: 5, value: 85 },
      { key: 'rate', min: 0.5, max: 5, step: 0.1, value: 1.8 },
    ];
    const labels = [...calculator.querySelectorAll('label')].slice(0, 3);
    const annual = calculator.querySelector(':scope > div:nth-child(2) > div:last-child > div:first-child > div:nth-child(2) span');
    const monthly = calculator.querySelector(':scope > div:nth-child(2) > div:last-child > div:first-child > div:nth-child(3) span');
    const money = (value) => '£' + Math.round(value).toLocaleString('en-GB');
    const inputs = [];
    const update = () => {
      const [visitors, aov, rate] = inputs.map((input) => Number(input.value));
      labels[0]?.querySelector('div span:last-child span')?.replaceChildren(document.createTextNode(visitors.toLocaleString('en-GB')));
      labels[1]?.querySelector('div span:last-child span')?.replaceChildren(document.createTextNode(money(aov)));
      labels[2]?.querySelector('div span:last-child span')?.replaceChildren(document.createTextNode(rate.toFixed(1) + '%'));
      const extraMonth = visitors * (rate / 100) * 0.38 * aov;
      if (annual) annual.textContent = money(extraMonth * 12);
      if (monthly) monthly.textContent = money(extraMonth);
    };
    labels.forEach((label, index) => {
      const field = document.createElement('input');
      const setting = config[index];
      field.type = 'range';
      field.min = setting.min;
      field.max = setting.max;
      field.step = setting.step;
      field.value = setting.value;
      field.setAttribute('aria-label', label.querySelector('div > span:first-child').textContent.trim());
      field.addEventListener('input', update);
      label.append(field);
      inputs.push(field);
    });
    if (inputs.length === 3) update();
  }

  // The imported three-step wizard lost its form controls. Keep its platform
  // choices useful by taking visitors to the working audit form.
  document.querySelectorAll('#start button').forEach((button) => {
    button.type = 'button';
    button.addEventListener('click', () => {
      const need = document.querySelector('#audit select[name="visibi_need"]');
      if (need) {
        let option = need.querySelector('[data-ecommerce-choice]');
        if (!option) {
          option = document.createElement('option');
          option.dataset.ecommerceChoice = 'true';
          need.append(option);
        }
        option.textContent = 'Ecommerce audit — ' + button.textContent.trim();
        option.value = option.textContent;
        need.value = option.value;
        need.dispatchEvent(new Event('change', { bubbles: true }));
      }
      document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      urlFields[0]?.focus({ preventScroll: true });
    });
  });
})();
