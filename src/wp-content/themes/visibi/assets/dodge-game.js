// VISIBI — "Dodge the Client Requests" mini-game. Usage: window.VisibiDodge.open({ ctaHref })
(function () {
  if (window.VisibiDodge) return;
  const REQ = ['Can you make the logo bigger?', 'Can we launch today?', 'Just one tiny change…', 'Can you make it pop?', 'My nephew says the website is slow', 'Can we add AI?', 'Can you copy this competitor?', 'Can we launch Friday at 5pm?', 'I only changed 47 things', 'Can you make the website viral?', 'Quick call?', 'Make it look like Apple', 'Can the font be more… fun?', 'Budget is tight, but…', 'Can we see 12 more options?'];
  const QUIPS = ['Still alive.', 'Scope creep detected.', 'Designer currently crying.', 'Developer has left the chat.', 'Friday deployment incoming.', 'Client said it was only one change.'];
  const RESULT = s => s >= 100 ? 'Congratulations. You are now emotionally qualified to run an agency.' : s > 80 ? 'You’ve clearly seen some things.' : s > 60 ? 'Senior agency material.' : s > 30 ? 'You survived the first client call.' : 'You may be better suited to accounting.';
  const DUR = 30, FONT = "'Plus Jakarta Sans',system-ui,sans-serif";
  const el = (t, st, html) => { const e = document.createElement(t); if (st) e.style.cssText = st; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, st) => el('button', 'border:0;cursor:pointer;font-family:' + FONT + ';' + st, label);

  let root, cv, ctx, W, H, dpr, raf, state, soundOn = false, actx, opts = {};

  function beep(f, d, v) { if (!soundOn) return; try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.value = v || .04; g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + d); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d); } catch (e) {} }

  function build() {
    root = el('div', 'position:fixed;inset:0;z-index:1000;background:rgba(4,8,20,.86);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:clamp(0px,3vw,32px);font-family:' + FONT);
    const stage = el('div', 'position:relative;width:min(1200px,100%);height:min(650px,100%);background:radial-gradient(120% 80% at 50% 0%,rgba(29,78,216,.22),transparent 60%),#070e22;border:1px solid rgba(255,255,255,.1);border-radius:clamp(0px,2vw,24px);overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.8);touch-action:none;user-select:none');
    const grid = el('div', 'position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:56px 56px;pointer-events:none');
    cv = el('canvas', 'position:absolute;inset:0;width:100%;height:100%;display:block');
    const bar = el('div', 'position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;color:#fff;z-index:3;pointer-events:none');
    const left = el('div', 'display:flex;gap:18px;align-items:baseline');
    const sc = el('div', 'display:flex;flex-direction:column', '<span style="font:500 10px \'JetBrains Mono\',monospace;letter-spacing:.1em;color:#7c88a6">SCORE</span><span data-k="score" style="font-size:clamp(17px,5vw,22px);font-weight:800">0</span>');
    const tm = el('div', 'display:flex;flex-direction:column', '<span style="font:500 10px \'JetBrains Mono\',monospace;letter-spacing:.1em;color:#7c88a6">TIME LEFT</span><span data-k="time" style="font-size:clamp(17px,5vw,22px);font-weight:800">30s</span>');
    left.append(sc, tm);
    const right = el('div', 'display:flex;gap:8px;pointer-events:auto');
    const snd = btn('🔇', 'width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.08);color:#fff;font-size:16px');
    snd.setAttribute('aria-label', 'Sound'); snd.textContent = '♪'; snd.style.opacity = '.45';
    snd.onclick = () => { soundOn = !soundOn; snd.style.opacity = soundOn ? '1' : '.45'; snd.style.background = soundOn ? 'rgba(29,78,216,.6)' : 'rgba(255,255,255,.08)'; if (soundOn) beep(660, .12, .05); };
    const cls = btn('×', 'width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.08);color:#fff;font-size:22px;line-height:1');
    cls.setAttribute('aria-label', 'Close'); cls.onclick = close;
    right.append(snd, cls); bar.append(left, right);
    const panel = el('div', 'position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;color:#fff');
    panel.dataset.k = 'panel';
    stage.append(grid, cv, bar, panel); root.append(stage); document.body.append(root);
    root.addEventListener('click', e => { if (e.target === root) close(); });
    const setX = cx => { const r = cv.getBoundingClientRect(); if (state) state.tx = Math.max(24, Math.min(W - 24, cx - r.left)); };
    cv.addEventListener('pointermove', e => setX(e.clientX));
    cv.addEventListener('pointerdown', e => { setX(e.clientX); cv.setPointerCapture && cv.setPointerCapture(e.pointerId); });
    root._key = e => { if (e.key === 'Escape') close(); if (!state) return; if (e.key === 'ArrowLeft' || e.key === 'a') state.kl = e.type === 'keydown'; if (e.key === 'ArrowRight' || e.key === 'd') state.kr = e.type === 'keydown'; };
    window.addEventListener('keydown', root._key); window.addEventListener('keyup', root._key);
    root._rs = () => resize(); window.addEventListener('resize', root._rs);
    root._q = k => root.querySelector('[data-k="' + k + '"]');
    document.body.style.overflow = 'hidden';
  }

  function resize() { const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }

  function panelStart() {
    const p = root._q('panel'); p.style.display = 'flex'; p.style.background = 'rgba(7,14,34,.55)';
    p.innerHTML = '<div style="display:flex;flex-direction:column;gap:16px;align-items:center;max-width:520px"><div style="font:500 12px \'JetBrains Mono\',monospace;letter-spacing:.12em;color:#6f98ff">DODGE THE CLIENT REQUESTS</div><div style="font-size:clamp(22px,6.2vw,44px);font-weight:800;letter-spacing:-.03em;line-height:1.1">Move the VISIBI logo.<br>Dodge the requests.<br>Survive 30 seconds.</div><div style="font-size:14px;color:#b9c4dd">Drag, move your mouse or use ← →</div></div>';
    const go = btn('Start →', 'margin-top:8px;background:#1d4ed8;color:#fff;border-radius:999px;padding:15px 28px;font-size:16px;font-weight:700;box-shadow:0 10px 30px -10px rgba(29,78,216,.8)');
    go.onmouseenter = () => go.style.background = '#2b5cf0'; go.onmouseleave = () => go.style.background = '#1d4ed8';
    go.onclick = start; p.firstChild.append(go); setTimeout(() => go.focus(), 50);
  }

  function start() {
    resize(); root._q('panel').style.display = 'none';
    state = { t: 0, last: performance.now(), x: W / 2, tx: W / 2, vx: 0, items: [], parts: [], spawn: 0, bonus: 0, quip: null, quipT: 4 + Math.random() * 2, boss: false, over: false, kl: false, kr: false };
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); beep(520, .15, .05);
  }

  function spawn(boss) {
    const small = W < 600, text = boss ? 'CAN YOU MAKE IT POP?' : REQ[Math.floor(Math.random() * REQ.length)];
    const big = boss || Math.random() < .18, red = boss || Math.random() < .22;
    const fs = boss ? (small ? 17 : 34) : big ? (small ? 13 : 20) : (small ? 11.5 : 15);
    ctx.font = (boss ? 800 : 600) + ' ' + fs + 'px ' + FONT;
    const w = Math.min(W - 24, ctx.measureText(text).width + (boss ? (small ? 32 : 56) : (small ? 22 : 32))), h = fs + (boss ? (small ? 24 : 34) : (small ? 16 : 22));
    const k = Math.min(1, state.t / DUR), sp = (boss ? 150 : 170 + k * 230 + (big ? 50 : 0) + Math.random() * 60) * (small ? .85 : 1);
    state.items.push({ text, fs, w, h, x: 12 + Math.random() * (W - w - 24), y: -h - 10, sp, red, big, boss, wob: Math.random() * 6, passed: false, trail: [] });
  }

  function loop(now) {
    const s = state; if (!s || s.over) return;
    const dt = Math.min(.05, (now - s.last) / 1000); s.last = now; s.t += dt;
    if (s.kl) s.tx -= 620 * dt; if (s.kr) s.tx += 620 * dt; s.tx = Math.max(24, Math.min(W - 24, s.tx));
    const px = s.x; s.x += (s.tx - s.x) * Math.min(1, dt * 14); s.vx = (s.x - px) / Math.max(dt, .001);
    const k = Math.min(1, s.t / DUR); s.spawn -= dt;
    if (s.spawn <= 0) { spawn(false); s.spawn = Math.max(.32, 1.05 - k * .75) * (W < 600 ? 1.15 : 1) * (.7 + Math.random() * .6); }
    if (!s.boss && s.t > 20) { s.boss = true; spawn(true); s.quip = { t: 'Boss request incoming.', a: 2.2 }; beep(180, .4, .06); }
    s.quipT -= dt; if (s.quipT <= 0) { s.quip = { t: QUIPS[Math.floor(Math.random() * QUIPS.length)], a: 2.2 }; s.quipT = 5 + Math.random() * 2; }
    const R = W < 600 ? 20 : 24, py = H - (W < 600 ? 70 : 80);
    for (const it of s.items) {
      it.trail.unshift(it.y); if (it.trail.length > 4) it.trail.pop(); it.y += it.sp * dt; if (it.boss) it.x += Math.sin(s.t * 3 + it.wob) * 70 * dt;
      const cx = Math.max(it.x, Math.min(s.x, it.x + it.w)), cy = Math.max(it.y, Math.min(py, it.y + it.h)), d = Math.hypot(s.x - cx, py - cy);
      if (d < R * .92) return end(false);
      if (!it.passed && it.y > py + R) { it.passed = true; const gap = Math.min(Math.abs(s.x - it.x), Math.abs(s.x - it.x - it.w)); if ((s.x < it.x || s.x > it.x + it.w) && gap < R + 26) { s.bonus += it.boss ? 8 : 2; for (let i = 0; i < 14; i++) s.parts.push({ x: s.x, y: py, vx: (Math.random() - .5) * 260, vy: -Math.random() * 220, a: 1 }); s.quip = { t: it.boss ? 'It did not pop. You win.' : 'Close one! +2', a: 1.2 }; beep(880, .08, .04); } }
    }
    s.items = s.items.filter(it => it.y < H + 60);
    for (const p of s.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 400 * dt; p.a -= dt * 1.6; } s.parts = s.parts.filter(p => p.a > 0);
    const score = Math.min(100, Math.floor(s.t * 2.9) + s.bonus);
    root._q('score').textContent = score; root._q('time').textContent = Math.max(0, Math.ceil(DUR - s.t)) + 's';
    draw(R, py);
    if (s.t >= DUR) return end(true);
    raf = requestAnimationFrame(loop);
  }

  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function draw(R, py) {
    const s = state; ctx.clearRect(0, 0, W, H);
    for (const it of s.items) {
      if (it.sp > 300) it.trail.forEach((ty, i) => { ctx.globalAlpha = .08 * (4 - i) / 4; rr(it.x, ty, it.w, it.h, it.h / 2); ctx.fillStyle = '#fff'; ctx.fill(); });
      ctx.globalAlpha = 1; const pulse = it.boss ? 1 + Math.sin(s.t * 10) * .04 : 1;
      ctx.save(); ctx.translate(it.x + it.w / 2, it.y + it.h / 2); ctx.scale(pulse, pulse); ctx.translate(-it.w / 2, -it.h / 2);
      if (it.red) { ctx.shadowColor = 'rgba(248,113,113,.55)'; ctx.shadowBlur = it.boss ? 34 : 16; }
      rr(0, 0, it.w, it.h, it.h / 2); ctx.fillStyle = it.boss ? 'rgba(220,38,38,.28)' : 'rgba(255,255,255,.08)'; ctx.fill(); ctx.shadowBlur = 0;
      ctx.lineWidth = it.boss ? 2 : 1; ctx.strokeStyle = it.red ? 'rgba(248,113,113,.75)' : 'rgba(255,255,255,.22)'; ctx.stroke();
      ctx.font = (it.boss ? 800 : 600) + ' ' + it.fs + 'px ' + FONT; ctx.fillStyle = it.boss ? '#fff' : '#e6ebf5'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(it.text, it.w / 2, it.h / 2 + 1);
      ctx.restore();
    }
    for (const p of s.parts) { ctx.globalAlpha = Math.max(0, p.a); ctx.fillStyle = '#6f98ff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
    const mv = Math.min(1, Math.abs(s.vx) / 600), sc = R / 26;
    ctx.save(); ctx.translate(s.x, py); ctx.rotate(Math.max(-.35, Math.min(.35, s.vx / 2400)));
    ctx.shadowColor = 'rgba(111,152,255,' + (.35 + mv * .5) + ')'; ctx.shadowBlur = 12 + mv * 22;
    ctx.lineWidth = 15 * sc * .95; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, 26 * sc * .78, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26 * sc * .95, 46 * sc * .72); ctx.lineTo(50 * sc * .95, 22 * sc * .72); ctx.stroke();
    ctx.restore(); ctx.shadowBlur = 0;
    if (s.quip && s.quip.a > 0) { s.quip.a -= 1 / 60; ctx.globalAlpha = Math.min(1, s.quip.a); ctx.font = '700 ' + (W < 600 ? 13 : 20) + 'px ' + FONT; ctx.fillStyle = '#b9c9ff'; ctx.textAlign = 'center'; ctx.fillText(s.quip.t, W / 2, W < 600 ? 84 : 96); ctx.globalAlpha = 1; }
  }

  function end(won) {
    const s = state; s.over = true; cancelAnimationFrame(raf);
    const score = won ? 100 : Math.min(99, Math.floor(s.t * 2.9) + s.bonus);
    beep(won ? 990 : 150, won ? .3 : .45, .06);
    const p = root._q('panel'); p.style.display = 'flex'; p.style.background = 'rgba(7,14,34,.78)';
    p.innerHTML = '<div style="display:flex;flex-direction:column;gap:14px;align-items:center;max-width:560px"><div style="font:500 12px \'JetBrains Mono\',monospace;letter-spacing:.12em;color:#6f98ff">' + (won ? 'YOU SURVIVED' : 'A REQUEST GOT YOU') + '</div><div style="font-size:14px;color:#b9c4dd">Agency Survival Score</div><div style="font-size:clamp(46px,13vw,96px);font-weight:800;letter-spacing:-.04em;line-height:1">' + score + '<span style="font-size:.4em;color:#7c88a6"> / 100</span></div><div style="font-size:clamp(15px,4vw,22px);font-weight:700;line-height:1.35;text-wrap:balance">' + RESULT(score) + '</div></div>';
    const row = el('div', 'display:flex;flex-direction:column;gap:10px;align-items:center;margin-top:10px;width:100%');
    const again = btn('↻ Play again', 'background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:12px 22px;font-size:14px;font-weight:600');
    again.onmouseenter = () => again.style.background = 'rgba(255,255,255,.18)'; again.onmouseleave = () => again.style.background = 'rgba(255,255,255,.1)'; again.onclick = start;
    const cta = el('a', 'display:inline-flex;flex-direction:column;gap:2px;align-items:center;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:18px;padding:14px 22px;box-shadow:0 10px 30px -10px rgba(29,78,216,.8)', '<span style="font-size:13px;color:#dbe5ff">Let VISIBI handle the difficult stuff</span><span style="font-size:16px;font-weight:800">Get a Free Website Assessment →</span>');
    cta.href = opts.ctaHref || '#audit'; cta.onclick = () => close();
    cta.onmouseenter = () => cta.style.background = '#2b5cf0'; cta.onmouseleave = () => cta.style.background = '#1d4ed8';
    row.append(cta, again); p.firstChild.append(row);
  }

  function close() { if (!root) return; cancelAnimationFrame(raf); state = null; window.removeEventListener('keydown', root._key); window.removeEventListener('keyup', root._key); window.removeEventListener('resize', root._rs); root.remove(); root = null; document.body.style.overflow = ''; }

  window.VisibiDodge = { open(o) { opts = o || {}; if (root) return; build(); resize(); panelStart(); } };
})();
