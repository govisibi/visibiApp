document.addEventListener('DOMContentLoaded', () => {
  const calculator = document.querySelector('#calc');
  if (!calculator) return;

  const labels = [...calculator.querySelectorAll('label')].filter(label => label.querySelector('input[type="range"]'));
  if (labels.length !== 4) return;
  const ranges = labels.map(label => label.querySelector('input[type="range"]'));
  const displays = labels.map(label => label.firstElementChild?.lastElementChild?.firstElementChild);
  const estimate = labels[3].nextElementSibling;
  const total = estimate?.children[1];
  const perMinute = estimate?.children[2]?.firstElementChild;
  if (displays.some(display => !display) || !total || !perMinute) return;

  const symbol = total.textContent.trim().startsWith('$') ? '$' : '£';
  const money = amount => symbol + Math.round(amount).toLocaleString('en-GB');
  const render = () => {
    const [visitors, conversion, orderValue, minutes] = ranges.map(range => Number(range.value));
    const values = [
      visitors.toLocaleString('en-GB'),
      conversion + '%',
      symbol + orderValue,
      minutes >= 60 ? (minutes / 60).toFixed(1).replace('.0', '') + ' h' : minutes + ' min'
    ];
    displays.forEach((display, index) => {
      display.textContent = values[index];
      ranges[index].setAttribute('aria-valuetext', values[index]);
    });
    const revenuePerMinute = visitors * (conversion / 100) * orderValue;
    total.textContent = money(revenuePerMinute * minutes);
    perMinute.textContent = money(revenuePerMinute);
  };

  ranges.forEach(range => {
    range.addEventListener('input', render);
    range.addEventListener('change', render);
  });
  render();
});
