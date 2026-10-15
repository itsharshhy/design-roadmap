/* Design Roadmap — shared behaviour. Plain JS, no libraries. */
(() => {
  const PAGES = [
    { f: 'index.html', n: '00', t: 'Start' },
    { f: '01-taste.html', n: '01', t: 'Taste' },
    { f: '02-psychology.html', n: '02', t: 'Psychology' },
    { f: '03-color.html', n: '03', t: 'Colour' },
    { f: '04-typography.html', n: '04', t: 'Type' },
    { f: '05-layout.html', n: '05', t: 'Layout' },
    { f: '06-market-research.html', n: '06', t: 'Research' },
    { f: '07-roadmap.html', n: '07', t: 'Roadmap' },
    { f: '08-sources.html', n: '08', t: 'Sources' },
  ];
  const here = document.body.dataset.page || 'index.html';
  const idx = PAGES.findIndex(p => p.f === here);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- icon sprite (hand-drawn 24px line set) ---- */
  const ICONS = {
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v5h5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
    bookmark: '<path d="M6 3.5h12V21l-6-4-6 4z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/>',
    remix: '<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    loop: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
    pen: '<path d="M4 20l4-1L19 8l-3-3L5 16z"/><path d="M14 7l3 3"/>',
    brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4.5h6V7"/><path d="M3 13h18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15l-3-3c1-4 5-9 13-9 0 8-5 12-9 13z"/><circle cx="15" cy="9" r="1.6"/>',
    alert: '<path d="M12 3.5l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
    half: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    out: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3.2-5.5 6.5-5.5s6 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.5 0 4.2 1.6 4.5 4.5"/>',
    blur: '<circle cx="12" cy="12" r="8.5" stroke-dasharray="2.5 3"/><circle cx="12" cy="12" r="3.5"/>',
  };
  const sprite = document.createElement('div');
  sprite.style.display = 'none';
  sprite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</svg>`;
  document.body.prepend(sprite);
  const ic = (n, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  document.querySelectorAll('[data-ic]').forEach(el => { el.insertAdjacentHTML('afterbegin', ic(el.dataset.ic)); });

  /* ---- pointer parallax for illustrations ---- */
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    let raf = 0;
    addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = document.documentElement.style;
        r.setProperty('--mx', ((e.clientX / innerWidth) - .5).toFixed(3));
        r.setProperty('--my', ((e.clientY / innerHeight) - .5).toFixed(3));
        raf = 0;
      });
    }, { passive: true });
  }

  /* ---- nav ---- */
  const nav = document.getElementById('nav');
  if (nav) {
    nav.className = 'nav';
    nav.innerHTML = `
      <div class="wrap nav__in">
        <a class="logo" href="index.html" aria-label="Design Roadmap home">
          <svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
            <g class="s1"><rect x="4" y="4" width="16" height="16" fill="#E2462B"/></g>
            <circle cx="28" cy="12" r="8" fill="#2340D8"/>
            <path d="M4 36 L20 36 L12 22 Z" fill="#F0B42E"/>
            <rect x="22" y="24" width="14" height="12" rx="6" fill="#16130F"/>
          </svg>
          <span>design<span class="serif-i">/</span>roadmap</span>
        </a>
        <button class="nav__toggle" aria-expanded="false" aria-controls="navlinks">Chapters</button>
        <ul class="nav__links" id="navlinks">
          ${PAGES.slice(1).map(p => `<li><a href="${p.f}" ${p.f === here ? 'aria-current="page"' : ''}><span class="n">${p.n}</span>${p.t}</a></li>`).join('')}
        </ul>
      </div>
      <div class="progress" aria-hidden="true"></div>`;
    const tog = nav.querySelector('.nav__toggle');
    const links = nav.querySelector('.nav__links');
    tog.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      tog.setAttribute('aria-expanded', open);
    });
    const bar = nav.querySelector('.progress');
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      bar.style.width = (p * 100).toFixed(2) + '%';
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- next chapter + footer ---- */
  const next = document.getElementById('next');
  if (next && idx > -1 && idx < PAGES.length - 1) {
    const n = PAGES[idx + 1];
    next.outerHTML = `
      <a class="next" href="${n.f}">
        <span class="next__dot" aria-hidden="true"></span>
        <div class="wrap" style="position:relative">
          <span class="kicker">Next chapter · ${n.n}</span>
          <div class="next__t">${n.t} <span aria-hidden="true">→</span></div>
        </div>
      </a>`;
  } else if (next) next.remove();

  const foot = document.getElementById('foot');
  if (foot) {
    foot.className = 'foot';
    foot.innerHTML = `<div class="wrap"><span>design/roadmap — a from-zero field guide to graphic design. <a href="08-sources.html">All sources →</a></span><span class="mono">Hand-built with HTML, CSS &amp; a little JS. No templates.</span></div>`;
  }

  /* ---- reveal + draw ---- */
  document.querySelectorAll('.draw').forEach(svg => {
    svg.querySelectorAll('path, line, circle, polyline, rect, ellipse').forEach(el => {
      try { el.style.setProperty('--len', Math.ceil(el.getTotalLength()) + 1); } catch (e) {}
    });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv, .draw').forEach(el => io.observe(el));

  /* ---- marquee: duplicate track for seamless loop ---- */
  document.querySelectorAll('.marquee__track').forEach(t => { t.innerHTML += t.innerHTML; });

  /* ---- colour helpers ---- */
  const hsl2hex = (h, s, l) => {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const hex2rgb = hex => { const m = hex.replace('#', ''); return [0, 2, 4].map(i => parseInt(m.substr(i, 2), 16)); };
  const lum = hex => {
    const [r, g, b] = hex2rgb(hex).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return .2126 * r + .7152 * g + .0722 * b;
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const inkFor = hex => contrast(hex, '#16130F') > contrast(hex, '#F3EDE2') ? '#16130F' : '#F3EDE2';

  /* ---- harmony wheel ---- */
  const wheel = document.getElementById('wheel');
  if (wheel) {
    const hueIn = document.getElementById('hue');
    const out = document.getElementById('harmonySwatches');
    const note = document.getElementById('harmonyNote');
    const chips = document.querySelectorAll('[data-harmony]');
    const RULES = {
      complementary: { o: [0, 180], d: 'Opposites on the wheel. Maximum punch. Use one as the hero, the other as a tiny accent — like a red button on a green page.' },
      analogous: { o: [-30, 0, 30], d: 'Neighbours on the wheel. Calm and natural — think of a sunset or a forest. Easy to get right.' },
      triadic: { o: [0, 120, 240], d: 'Three colours evenly spaced. Playful and balanced. Let one dominate or it gets loud fast.' },
      split: { o: [0, 150, 210], d: 'Split-complementary: one colour plus the two neighbours of its opposite. Contrast, but gentler.' },
      monochrome: { o: [0, 0, 0], d: 'One hue, different lightness. Elegant and impossible to clash. The secret weapon of beginners.' },
    };
    let rule = 'complementary';
    const dots = [0, 1, 2].map(() => { const d = document.createElement('span'); d.className = 'wheel__dot'; wheel.appendChild(d); return d; });
    const render = () => {
      const base = +hueIn.value;
      const r = RULES[rule];
      const hues = r.o.map(o => (base + o + 360) % 360);
      const lights = rule === 'monochrome' ? [30, 52, 78] : [52, 52, 52];
      dots.forEach((d, i) => {
        if (i >= hues.length) { d.style.opacity = 0; return; }
        d.style.opacity = 1;
        const ang = (hues[i]) * Math.PI / 180;
        const rad = rule === 'monochrome' ? 70 + i * 22 : 120;
        d.style.transform = `translate(${Math.cos(ang) * rad}px, ${Math.sin(ang) * rad}px)`;
        d.style.background = hsl2hex(hues[i], 72, lights[i]);
      });
      const cols = hues.map((h, i) => hsl2hex(h, 72, lights[i]));
      cols.push(hsl2hex(hues[0], 25, 94));
      out.innerHTML = cols.map((c, i) => `<div class="sw" style="background:${c};color:${inkFor(c)}"><b>${i === cols.length - 1 ? 'Background' : ['Main', 'Accent', 'Support'][i]}</b>${c}</div>`).join('');
      note.textContent = r.d;
    };
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('on')); c.classList.add('on'); rule = c.dataset.harmony; render();
    }));
    hueIn.addEventListener('input', render);
    render();
  }

  /* ---- contrast checker ---- */
  const fg = document.getElementById('fg');
  if (fg) {
    const bg = document.getElementById('bg');
    const pv = document.getElementById('contrastPreview');
    const ratio = document.getElementById('ratio');
    const badges = document.getElementById('badges');
    const run = () => {
      const r = contrast(fg.value, bg.value);
      pv.style.color = fg.value; pv.style.background = bg.value;
      ratio.textContent = r.toFixed(2) + ' : 1';
      const tests = [['AA body text', 4.5], ['AA large text', 3], ['AAA body text', 7]];
      badges.innerHTML = tests.map(([l, t]) => `<span class="badge ${r >= t ? 'pass' : 'fail'}">${r >= t ? '✓' : '✕'} ${l} (${t}:1)</span>`).join('');
    };
    [fg, bg].forEach(i => i.addEventListener('input', run));
    document.querySelectorAll('[data-pair]').forEach(b => b.addEventListener('click', () => {
      const [a, c] = b.dataset.pair.split(','); fg.value = a; bg.value = c; run();
    }));
    run();
  }

  /* ---- brand mood swapper ---- */
  const mock = document.getElementById('brandMock');
  if (mock) {
    const words = document.getElementById('brandWords');
    const MOODS = {
      red: ['#E2462B', '#FFF1EC', 'Exciting · urgent · hungry · bold', 'Netflix, Coca-Cola, YouTube'],
      blue: ['#2340D8', '#EEF1FF', 'Competent · trustworthy · calm · corporate', 'Visa, IBM, Samsung, most banks'],
      green: ['#1F5C4A', '#EAF3EE', 'Natural · healthy · growth · money', 'Whole Foods, Spotify, Starbucks'],
      yellow: ['#F0B42E', '#FFF8E6', 'Cheerful · cheap & cheerful · attention', 'IKEA, McDonald’s arches, Snapchat'],
      black: ['#16130F', '#F3EDE2', 'Luxury · power · sophistication', 'Chanel, Nike, Apple’s marketing'],
      pink: ['#E77A9A', '#FFF0F4', 'Playful · youthful · sweet · romantic', 'Barbie, Baskin-Robbins, Lyft'],
    };
    document.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('[data-mood]').forEach(x => x.classList.remove('on')); b.classList.add('on');
      const [c, bgc, w, ex] = MOODS[b.dataset.mood];
      mock.style.setProperty('--m', c); mock.style.setProperty('--mb', bgc); mock.style.setProperty('--mi', inkFor(c));
      words.innerHTML = `<b>People tend to read it as:</b> ${w}<br><span class="muted">Brands that use this colour: ${ex}</span>`;
    }));
    document.querySelector('[data-mood]').click();
  }

  /* ---- type scale ---- */
  const scaleOut = document.getElementById('scaleOut');
  if (scaleOut) {
    const base = document.getElementById('baseSize');
    const ratioSel = document.getElementById('ratioSel');
    const txt = document.getElementById('scaleText');
    const fam = document.getElementById('scaleFont');
    const names = ['h1', 'h2', 'h3', 'h4', 'body', 'small'];
    const run = () => {
      const b = +base.value, r = +ratioSel.value;
      document.getElementById('baseVal').textContent = b + 'px';
      scaleOut.innerHTML = names.map((n, i) => {
        const px = b * Math.pow(r, 4 - i);
        return `<div class="scale-row"><div class="mono">${n} · ${px.toFixed(1)}px</div><div style="font-size:${px}px;font-family:${fam.value}">${txt.value || 'Design is thinking made visual'}</div></div>`;
      }).join('');
    };
    [base, ratioSel, txt, fam].forEach(el => el.addEventListener('input', run));
    run();
  }

  /* ---- line length & leading ---- */
  const measure = document.getElementById('measure');
  if (measure) {
    const box = document.getElementById('measureText');
    const lead = document.getElementById('leading');
    const lab = document.getElementById('measureLabel');
    const run = () => {
      box.style.maxWidth = measure.value + 'ch';
      box.style.lineHeight = lead.value;
      const m = +measure.value, l = +lead.value;
      let verdict = m < 40 ? 'Too short — eyes jump back too often. Feels choppy.' : m > 85 ? 'Too long — your eye gets lost finding the next line.' : 'Sweet spot. Comfortable reading.';
      if (l < 1.25) verdict += ' Lines are cramped — letters touch the lines above.';
      else if (l > 2) verdict += ' Lines float apart — the paragraph falls to pieces.';
      lab.innerHTML = `<b>${m} characters</b> per line · line-height <b>${l}</b> — ${verdict}`;
    };
    [measure, lead].forEach(el => el.addEventListener('input', run));
    run();
  }

  /* ---- hierarchy toggle ---- */
  document.querySelectorAll('[data-toggle-target]').forEach(btn => {
    const target = document.getElementById(btn.dataset.toggleTarget);
    btn.addEventListener('click', () => {
      document.querySelectorAll(`[data-toggle-target="${btn.dataset.toggleTarget}"]`).forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      target.dataset.state = btn.dataset.state;
    });
  });

  /* ---- roadmap progress ---- */
  const tasks = document.querySelectorAll('.task input[data-id]');
  if (tasks.length) {
    const KEY = 'design-roadmap-progress-v1';
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const ring = document.getElementById('ringFg');
    const pct = document.getElementById('pct');
    const C = 2 * Math.PI * 36;
    if (ring) ring.style.strokeDasharray = C;
    const update = () => {
      const state = {};
      tasks.forEach(t => { state[t.dataset.id] = t.checked; });
      localStorage.setItem(KEY, JSON.stringify(state));
      document.querySelectorAll('.phase').forEach(ph => {
        const all = ph.querySelectorAll('.task input'); const done = ph.querySelectorAll('.task input:checked');
        const b = ph.querySelector('.phase__bar i'); if (b) b.style.width = (done.length / all.length * 100) + '%';
      });
      const done = [...tasks].filter(t => t.checked).length;
      const p = done / tasks.length;
      if (ring) ring.style.strokeDashoffset = C * (1 - p);
      if (pct) pct.textContent = Math.round(p * 100) + '%';
      const cnt = document.getElementById('doneCount'); if (cnt) cnt.textContent = `${done} of ${tasks.length} milestones done`;
    };
    tasks.forEach(t => { t.checked = !!saved[t.dataset.id]; t.addEventListener('change', update); });
    const reset = document.getElementById('resetProgress');
    if (reset) reset.addEventListener('click', () => { tasks.forEach(t => t.checked = false); update(); });
    update();
  }

  /* ---- squint test ---- */
  const squint = document.getElementById('squintBtn');
  if (squint) {
    const t = document.getElementById(squint.dataset.target);
    squint.addEventListener('click', () => {
      const on = t.style.filter;
      t.style.transition = 'filter .6s';
      t.style.filter = on ? '' : 'blur(6px)';
      squint.innerHTML = on ? `${ic('blur')} Squint at it` : `${ic('eye')} Stop squinting`;
    });
  }

  /* ==========================================================================
     Explainer player
     Each object inside .ex__stage carries data-k: a JSON array of per-step
     style keyframes. Steps are cumulative (step 3 = 0+1+2+3 merged), and CSS
     transitions do the in-betweening. Short keys keep the markup readable.
     ========================================================================== */
  const MAP = { x: 'left', y: 'top', w: 'width', h: 'height', o: 'opacity', bg: 'background', c: 'color', br: 'border-radius', bc: 'border-color', ls: 'letter-spacing', fw: 'font-weight', ff: 'font-family', f: 'filter', z: 'z-index', sh: 'box-shadow', tt: 'text-transform', fst: 'font-style', b: 'border' };
  const PCT = new Set(['x', 'y', 'w', 'h']);
  document.querySelectorAll('.ex').forEach(fig => {
    const stage = fig.querySelector('.ex__stage');
    const caps = [...fig.querySelectorAll('.ex__caps li')];
    const n = caps.length;
    caps.forEach((c, j) => { c.dataset.n = String(j + 1).padStart(2, '0'); });
    const dur = +(fig.dataset.dur || 3600);
    const bar = fig.querySelector('.ex__bar i');
    const els = [...fig.querySelectorAll('[data-k]')].map(el => ({ el, base: el.getAttribute('style') || '', k: JSON.parse(el.dataset.k) }));
    let i = 0, timer = 0, playing = false, userPaused = reduced;

    const apply = idx => {
      stage.dataset.step = idx;
      els.forEach(({ el, base, k }) => {
        const st = {};
        for (let j = 0; j <= idx; j++) if (k[j]) Object.assign(st, k[j]);
        let css = base, r = 0, s = 1, tx = 0, ty = 0;
        for (const [key, v] of Object.entries(st)) {
          if (key === 'r') r = v; else if (key === 's') s = v;
          else if (key === 'tx') tx = v; else if (key === 'ty') ty = v;
          else if (key === 't') { if (el.textContent !== v) el.textContent = v; }
          else if (key === 'html') { if (el._h !== v) { el.innerHTML = v; el._h = v; } }
          else if (key === 'fs') css += `;font-size:${v}cqw`;
          else if (key === 'd') css += `;transition-delay:${v}ms`;
          else css += `;${MAP[key] || key}:${typeof v === 'number' && PCT.has(key) ? v + '%' : v}`;
        }
        css += `;transform:translate(${tx}%,${ty}%) rotate(${r}deg) scale(${s})`;
        el.setAttribute('style', css);
      });
      caps.forEach((c, j) => c.classList.toggle('on', j === idx));
      fig.style.setProperty('--dur', (idx === n - 1 ? dur * 1.5 : dur) + 'ms');
      bar.classList.remove('run'); void bar.offsetWidth;
      if (playing) bar.classList.add('run');
    };
    const schedule = () => {
      clearTimeout(timer);
      if (playing) timer = setTimeout(() => { i = (i + 1) % n; apply(i); schedule(); }, i === n - 1 ? dur * 1.5 : dur);
    };
    const play = () => { if (playing) return; playing = true; fig.classList.add('is-playing'); apply(i); schedule(); };
    const pause = () => { playing = false; fig.classList.remove('is-playing'); clearTimeout(timer); bar.classList.remove('run'); };

    fig.classList.add('ex--init'); apply(0); void stage.offsetWidth; fig.classList.remove('ex--init');

    fig.querySelector('[data-ex-play]').addEventListener('click', () => {
      if (playing) { userPaused = true; pause(); } else { userPaused = false; play(); }
    });
    fig.querySelector('[data-ex-replay]').addEventListener('click', () => {
      userPaused = false; pause(); i = 0; apply(0); play();
    });
    caps.forEach((c, j) => c.addEventListener('click', () => { i = j; apply(i); schedule(); }));

    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) play(); else if (!e.isIntersecting) pause();
    }, { threshold: .4 }).observe(stage);
  });
})();
