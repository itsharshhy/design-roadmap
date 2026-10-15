/* Design Roadmap — shared behaviour. Plain JS, no libraries. */
(() => {
  const PAGES = [
    { f: 'index.html', n: '00', t: 'Start' },
    { f: '01-taste.html', n: '01', t: 'Taste' },
    { f: '02-psychology.html', n: '02', t: 'Psychology' },
    { f: '03-color.html', n: '03', t: 'Color' },
    { f: '04-typography.html', n: '04', t: 'Type' },
    { f: '05-layout.html', n: '05', t: 'Layout' },
    { f: '06-market-research.html', n: '06', t: 'Research' },
    { f: '07-roadmap.html', n: '07', t: 'Roadmap' },
  ];
  const here = document.body.dataset.page || 'index.html';
  const idx = PAGES.findIndex(p => p.f === here);

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
    foot.innerHTML = `<div class="wrap"><span>design/roadmap — a from-zero field guide to graphic design.</span><span class="mono">Hand-built with HTML, CSS &amp; a little JS. No templates.</span></div>`;
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
      squint.textContent = on ? 'Squint at it 👀' : 'Stop squinting';
    });
  }
})();
