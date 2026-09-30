/* Restore the original shared hosting, store and development HeroDemo widgets. */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.visibi-content section[data-screen-label="Hero"]');
  if (!hero) return;
  const buttons = [...hero.querySelectorAll('button')];
  const byText = text => buttons.find(button => button.textContent.trim() === text);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const spike = buttons.find(button => /Simulate Black Friday spike|Back to normal/.test(button.textContent));
  if (spike) {
    const card = spike.parentElement?.parentElement;
    const stats = [...(card?.children[1]?.children || [])];
    const traffic = card?.children[2];
    const trafficLabel = traffic?.children[0]?.children[1];
    const bars = [...(traffic?.children[1]?.children || [])];
    const nodes = [...(card?.children[3]?.children[1]?.children || [])];
    let active = false, tick = 0;
    const base = [30, 34, 31, 36, 33, 38, 35, 37, 34, 39, 36, 38, 35, 40, 37, 39];
    const render = () => {
      if (stats[0]?.children[0]) stats[0].children[0].textContent = (active ? 190 + (tick % 3) * 12 : 120 + (tick % 4) * 9) + 'ms';
      if (stats[2]?.children[0]) stats[2].children[0].textContent = active ? '9.2×' : '1×';
      if (trafficLabel) trafficLabel.textContent = active ? 'Black Friday spike' : 'Normal day';
      bars.forEach((bar, index) => { bar.style.height = (active && index > 7 ? Math.min(98, base[index] + 45 + ((index + tick) % 3) * 6) : base[index] + ((index + tick) % 3) * 3) + '%'; bar.style.background = active && index > 7 ? '#fbbf24' : 'rgba(111,152,255,.55)'; });
      nodes.forEach((node, index) => { const on = index < (active ? 8 : 2); node.style.background = on ? 'rgba(74,222,128,.35)' : 'rgba(255,255,255,.04)'; node.style.borderColor = on ? '#4ade80' : 'rgba(255,255,255,.12)'; });
      spike.textContent = active ? '← Back to normal' : 'Simulate Black Friday spike ⚡';
      spike.style.background = active ? 'transparent' : '#1d4ed8';
      spike.setAttribute('aria-pressed', String(active));
    };
    spike.addEventListener('click', () => { active = !active; render(); });
    if (!reduced) setInterval(() => { tick++; render(); }, 1400);
    if (stats.length === 3 && bars.length === 16) render();
  }

  const mobile = byText('Mobile'), desktop = byText('Desktop');
  const storeToggle = buttons.find(button => /See it after VISIBI|Before VISIBI/.test(button.textContent));
  if (mobile && desktop && storeToggle) {
    const card = mobile.parentElement?.parentElement;
    const state = card?.children[1]?.children[1];
    const rows = [...(card?.children[2]?.children || [])];
    const matrix = [
      [['Page speed (LCP)', '4.8s', '1.3s', 28, 90], ['Responsiveness (INP)', '420ms', '140ms', 35, 88], ['Layout shift (CLS)', '0.24', '0.03', 30, 95], ['Conversion rate', '1.1%', '2.3%', 30, 78]],
      [['Page speed (LCP)', '3.1s', '0.9s', 45, 94], ['Responsiveness (INP)', '260ms', '90ms', 50, 92], ['Layout shift (CLS)', '0.14', '0.02', 48, 96], ['Conversion rate', '1.9%', '3.2%', 42, 80]]
    ];
    let device = 0, after = false;
    const render = () => {
      [mobile, desktop].forEach((button, index) => { const on = index === device; button.style.background = on ? '#fff' : 'transparent'; button.style.color = on ? '#0b1530' : '#b9c4dd'; button.setAttribute('aria-pressed', String(on)); });
      if (state) { state.textContent = after ? 'AFTER VISIBI' : 'TYPICAL TODAY'; state.style.color = after ? '#4ade80' : '#fbbf24'; }
      rows.slice(0, 4).forEach((row, index) => {
        const [label, before, improved, beforeWidth, afterWidth] = matrix[device][index];
        const heading = row.children[0];
        if (heading?.children[0]) heading.children[0].textContent = label;
        if (heading?.children[1]) { heading.children[1].textContent = after ? improved : before; heading.children[1].style.color = after ? '#4ade80' : '#f87171'; }
        const bar = row.children[1]?.firstElementChild;
        if (bar) { bar.style.width = (after ? afterWidth : beforeWidth) + '%'; bar.style.background = after ? '#4ade80' : '#f87171'; }
      });
      storeToggle.textContent = after ? '← Before' : 'See it after VISIBI →';
      storeToggle.style.background = after ? 'transparent' : '#1d4ed8';
      storeToggle.setAttribute('aria-pressed', String(after));
    };
    mobile.addEventListener('click', () => { device = 0; render(); });
    desktop.addEventListener('click', () => { device = 1; render(); });
    storeToggle.addEventListener('click', () => { after = !after; render(); });
    if (rows.length === 4) render();
  }

  const build = byText('New build'), upgrade = byText('Upgrade'), takeOver = byText('Take over'), support = byText('Support');
  if (build && upgrade && takeOver && support) {
    const card = build.parentElement?.parentElement?.parentElement;
    const groups = [...(card?.children || [])].filter(child => child.querySelectorAll('button').length > 1);
    const choices = groups.map(group => [...group.querySelectorAll('button')]);
    const output = [...(groups.at(-1)?.nextElementSibling?.children || [])];
    const picked = [0, 1, 0];
    const render = () => {
      choices.slice(0, 3).forEach((group, groupIndex) => group.forEach((button, index) => {
        const on = picked[groupIndex] === index;
        button.style.background = on ? 'rgba(29,78,216,.35)' : 'rgba(255,255,255,.04)';
        button.style.borderColor = on ? '#6f98ff' : 'rgba(255,255,255,.12)';
        button.setAttribute('aria-pressed', String(on));
      }));
      const weeks = [[6, 12, 20], [3, 6, 12], [2, 3, 4], [1, 1, 1]][picked[0]][picked[1]];
      const team = [1, 1, 3][picked[2]] + (picked[1] === 2 ? 1 : 0);
      const values = [picked[0] === 3 ? 'Monthly' : weeks + ' wks', team + (team === 1 ? ' dev' : ' people'), picked[2] === 1 ? 'Monthly' : 'Fixed'];
      output.slice(0, 3).forEach((box, index) => { if (box.children[0]) box.children[0].textContent = values[index]; });
    };
    choices.slice(0, 3).forEach((group, groupIndex) => group.forEach((button, index) => button.addEventListener('click', () => { picked[groupIndex] = index; render(); })));
    if (choices.length === 3 && output.length === 3) render();
  }
});
