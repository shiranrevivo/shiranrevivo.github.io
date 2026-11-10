(() => {
  'use strict';

  const CONFIG = {
    email: 'shiranrevivo193@gmail.com',
    portrait: 'assets/img/me.jpg',    // drop your photo here — falls back to a pixel avatar
    loaderMs: 1000,
    // contact form: paste a Formspree endpoint (https://formspree.io/f/xxxx) and the form sends for real.
    // Empty = it opens the visitor's mail app (mailto), as before.
    formEndpoint: 'https://formspree.io/f/xbgordaj'
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const page = document.body.dataset.page || 'home';
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, active: false };

  document.documentElement.classList.add('js');

  /* ======================================================================
     PIXEL ART — every icon is a tiny bitmap, rendered to crisp SVG
     ====================================================================== */
  const PX = {
    invaderA: ['..#.....#..', '...#...#...', '..#######..', '.##.###.##.', '###########', '#.#######.#', '#.#.....#.#', '...##.##...'],
    invaderB: ['..#.....#..', '#..#...#..#', '#.#######.#', '###.###.###', '###########', '.#########.', '..#.....#..', '.#.......#.'],
    home: ['....#....', '...###...', '..#####..', '.#######.', '#########', '.##...##.', '.##...##.', '.##...##.', '.#######.'],
    user: ['...###...', '..#####..', '..#####..', '..#####..', '...###...', '.........', '.#######.', '#########', '#########'],
    grid: ['####.####', '#..#.#..#', '#..#.#..#', '####.####', '.........', '####.####', '#..#.#..#', '#..#.#..#', '####.####'],
    doc: ['#####..', '#...#..', '#...###', '#.....#', '#.###.#', '#.....#', '#.###.#', '#.....#', '#######'],
    chat: ['.#######.', '#.......#', '#.#.#.#.#', '#.......#', '.#######.', '..##.....', '.#.......'],
    play: ['##....', '####..', '######', '######', '####..', '##....'],
    arrow: ['....#....', '.....#...', '......#..', '#########', '......#..', '.....#...', '....#....'],
    arrowL: ['....#....', '...#.....', '..#......', '#########', '..#......', '...#.....', '....#....'],
    up: ['...#...', '..###..', '.#.#.#.', '#..#..#', '...#...', '...#...', '...#...'],
    diamond: ['..#..', '.###.', '#####', '.###.', '..#..'],
    spark: ['...#...', '...#...', '..###..', '#######', '..###..', '...#...', '...#...'],
    sound: ['...#.....', '..##..#..', '####...#.', '####.#.#.', '####.#.#.', '####...#.', '..##..#..', '...#.....'],
    mute: ['...#.....', '..##.....', '####.#..#', '####..##.', '####..##.', '####.#..#', '..##.....', '...#.....'],
    menu: ['#######', '.......', '#######', '.......', '#######'],
    close: ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'],
    check: ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....'],
    copy: ['..#####', '..#...#', '###...#', '#.#...#', '#.#####', '#...#..', '#####..'],
    ext: ['..#####', '....###', '...#.##', '..#...#', '.#.....', '#......'],
    heart: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
    download: ['...#...', '...#...', '...#...', '#..#..#', '.#.#.#.', '..###..', '...#...', '.......', '#######'],
    trophy: ['.#######.', '#.#####.#', '#.#####.#', '.#######.', '...###...', '....#....', '....#....', '..#####..'],
    cartridge: ['.#########.', '.#.......#.', '.#.#####.#.', '.#.#...#.#.', '.#.#####.#.', '.#.......#.', '.#########.', '..#.#.#.#..', '..#######..'],
    // case-study icons (usability features)
    eye: ['...#####...', '.##.....##.', '#...###...#', '#..##.##..#', '#...###...#', '.##.....##.', '...#####...'],
    book: ['##.......##', '#.##...##.#', '#...#.#...#', '#....#....#', '#....#....#', '#....#....#', '.##..#..##.', '...##.##...'],
    lotus: ['...###...', '...###...', '.........', '..#####..', '.#.###.#.', '#..###..#', '...###...', '.#######.', '#########'],
    cloud: ['...##..##..', '..########.', '.##########', '###########', '###########', '.#########.', '...........', '..##.......', '#..........']
  };

  function pxSVG(rows, colors = { '#': 'currentColor' }, scale = 1) {
    const h = rows.length;
    const w = Math.max(...rows.map(r => r.length));
    const paths = {};
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        const ch = row[x];
        if (colors[ch]) {
          let n = 1;
          while (row[x + n] === ch) n++;
          (paths[ch] = paths[ch] || []).push(`M${x} ${y}h${n}v1h-${n}z`);
          x += n;
        } else x++;
      }
    });
    const body = Object.entries(paths).map(([ch, d]) => `<path fill="${colors[ch]}" d="${d.join('')}"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
  }

  function renderIcons(root = document) {
    $$('[data-px]', root).forEach(el => {
      const map = PX[el.dataset.px];
      if (map) el.innerHTML = pxSVG(map);
    });
  }

  function setIcon(el, name) { el.dataset.px = name; el.innerHTML = pxSVG(PX[name]); }

  /* pixel cursor */
  function initCursor() {
    if (!finePointer) return;
    const arrow = [
      '#', '##', '#o#', '#oo#', '#ooo#', '#oooo#', '#ooooo#', '#oooooo#', '#ooooooo#', '#oooooooo#',
      '#ooooo#####', '#oo#oo#', '#o#.#oo#', '##..#oo#', '#....#oo#', '.....#oo#', '......##'
    ];
    const url = colors => `url("data:image/svg+xml,${encodeURIComponent(pxSVG(arrow, colors, 2))}") 0 0`;
    const root = document.documentElement.style;
    root.setProperty('--cursor', `${url({ '#': '#FF7BF8', o: '#0B0408' })}, auto`);
    root.setProperty('--cursor-hover', `${url({ '#': '#0B0408', o: '#FF7BF8' })}, pointer`);
  }

  /* ======================================================================
     8-BIT SOUND (off by default)
     ====================================================================== */
  const Sound = {
    on: true,
    ctx: null,
    out: null,
    btn: null,
    last: 0,
    init() {
      this.btn = $('#soundBtn');
      try { this.on = localStorage.getItem('px-sound-v2') !== '0'; } catch (e) { /* storage unavailable */ }
      this.sync();
      this.btn?.addEventListener('click', () => this.toggle());

      // a soft retro tick on every click; interactive elements get a gentle two-note "select"
      // Played on pointerdown in the capture phase: it fires before a link navigates away (a click
      // sound on "click" gets cut off by the page unload) and before any handler can stopPropagation.
      const interactive = 'a, button, label, input, textarea, select, summary, [role="button"], .card, .chip, .tags li';
      const play = target => {
        if (!(target instanceof Element)) return;
        if (target.closest('#soundBtn')) return;
        // these make their own sound (the view-master reel), not the generic click
        if (target.closest('#factPager button, .eyepiece [data-step]')) return;
        if (target.closest('#viewer') && !target.closest('.vm__lens')) return;
        const now = performance.now();
        if (now - this.last < 60) return;   // label → input fires twice
        this.last = now;
        if (target.closest(interactive)) this.select(); else this.tick();
      };
      document.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        this.lastPointer = performance.now();
        play(e.target);
      }, true);
      // keyboard activation (Enter / Space) has no pointerdown
      document.addEventListener('click', e => {
        if (performance.now() - (this.lastPointer || -1e9) < 1000) return;
        play(e.target);
      }, true);
    },
    sync() {
      if (!this.btn) return;
      this.btn.setAttribute('aria-pressed', String(this.on));
      this.btn.setAttribute('aria-label', this.on ? 'Mute sound' : 'Turn sound on');
      setIcon($('.px-ico', this.btn), this.on ? 'sound' : 'mute');
    },
    toggle() {
      this.on = !this.on;
      try { localStorage.setItem('px-sound-v2', this.on ? '1' : '0'); } catch (e) { /* ignore */ }
      this.sync();
      this.select();
    },
    audio() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        const lp = this.ctx.createBiquadFilter();   // rounds off the 8-bit edge
        lp.type = 'lowpass';
        lp.frequency.value = 2200;
        this.out = this.ctx.createGain();
        this.out.gain.value = 1;
        this.out.connect(lp).connect(this.ctx.destination);
      }
      if (this.ctx.state !== 'running') this.ctx.resume();
      return this.ctx;
    },
    tone(freq, { dur = .05, vol = .05, type = 'triangle', when = 0, slide = 1 } = {}) {
      if (!this.on) return;
      try {
        const ctx = this.audio();
        const t = ctx.currentTime + when;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        if (slide !== 1) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + .004);
        g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        o.connect(g).connect(this.out);
        o.start(t);
        o.stop(t + dur + .02);
      } catch (e) { /* audio unavailable */ }
    },
    // tiny burst of filtered noise — the "texture" of a soft key press
    noise(dur = .015, vol = .03, freq = 3000, when = 0) {
      if (!this.on) return;
      try {
        const ctx = this.audio();
        if (!this.noiseBuf) {
          this.noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .05, ctx.sampleRate);
          const d = this.noiseBuf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        }
        const t = ctx.currentTime + when;
        const src = ctx.createBufferSource();
        const bp = ctx.createBiquadFilter();
        const g = ctx.createGain();
        src.buffer = this.noiseBuf;
        bp.type = 'bandpass';
        bp.frequency.value = freq;
        bp.Q.value = 1.2;
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        src.connect(bp).connect(g).connect(this.out);
        src.start(t);
        src.stop(t + dur + .01);
      } catch (e) { /* audio unavailable */ }
    },
    // slight random detune so repeated clicks never sound identical
    vary: f => f * (0.96 + Math.random() * .08),
    // soft, low "tock" — like a rubber key on an old handheld
    tick() {
      this.tone(this.vary(420), { dur: .045, vol: .12, type: 'sine', slide: .75 });
      this.noise(.012, .025, 2400);
    },
    // gentle upward "pop" for buttons and links
    select() {
      this.tone(this.vary(560), { dur: .06, vol: .12, type: 'sine', slide: 1.35 });
      this.noise(.012, .02, 3200);
    },
    // hero game: a soft two-note "ding" for a picked-up item
    pickup() {
      this.tone(660, { dur: .07, vol: .07, type: 'sine' });
      this.tone(990, { dur: .12, vol: .06, type: 'sine', when: .07 });
    },
    // one physical click: a noise impulse rung through a resonant band (the plastic body),
    // on its own path that skips the 8-bit lowpass so it keeps its real "tick"
    knock(when, { freq = 1200, q = 4, dur = .02, vol = .1, type = 'bandpass' } = {}) {
      if (!this.on) return;
      try {
        const ctx = this.audio();
        if (!this.raw) {
          this.raw = ctx.createGain();
          this.raw.gain.value = 1;
          this.raw.connect(ctx.destination);
          this.knockBuf = ctx.createBuffer(1, ctx.sampleRate * .2, ctx.sampleRate);
          const d = this.knockBuf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        }
        const t = ctx.currentTime + when;
        const src = ctx.createBufferSource();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        src.buffer = this.knockBuf;
        src.playbackRate.value = .9 + Math.random() * .2;
        f.type = type;
        f.frequency.value = this.vary(freq);
        f.Q.value = q;
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        src.connect(f).connect(g).connect(this.raw);
        src.start(t, Math.random() * .03);
        src.stop(t + dur + .01);
      } catch (e) { /* audio unavailable */ }
    },
    // view-master lever, the real thing: the lever slides down, the reel's ratchet ticks over,
    // the slide drops into place (lined up with the visual swap at 140ms), the spring lets go
    reel() {
      this.knock(0, { freq: 2200, q: .7, dur: .07, vol: .035 });                     // plastic lever sliding
      [.045, .085, .115].forEach((w, i) => this.knock(w, { freq: 3400 - i * 300, q: 6, dur: .012, vol: .05 }));
      this.knock(.14, { freq: 950, q: 5, dur: .045, vol: .16 });                     // the reel seats: clack
      this.knock(.14, { freq: 4200, q: 1, dur: .008, vol: .05, type: 'highpass' });  // its crisp edge
      this.tone(this.vary(150), { dur: .06, vol: .06, type: 'sine', when: .14, slide: .6 }); // body thump
      this.knock(.27, { freq: 1700, q: 5, dur: .025, vol: .06 });                    // lever springs back
    },
    // all five found: a short rising arpeggio
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => this.tone(f, { dur: .16, vol: .06, type: 'triangle', when: i * .09 }));
    }
  };

  /* ======================================================================
     DOT-MATRIX BACKGROUND — reacts to the cursor, twinkles softly
     ====================================================================== */
  function initDotField() {
    const cv = $('#dots');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const GAP = 8, RADIUS = 150;
    let w, h, dpr, base;
    const twinkles = [];
    const m = { x: -999, y: -999 };

    function resize() {
      // match the CSS size (100lvh); skip the redraw when only the mobile address bar moved
      const nw = innerWidth, nh = Math.max(innerHeight, Math.round(cv.getBoundingClientRect().height));
      if (base && nw === w && nh <= h) return;
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = nw; h = nh;
      cv.width = w * dpr; cv.height = h * dpr;
      base = document.createElement('canvas');
      base.width = cv.width; base.height = cv.height;
      const b = base.getContext('2d');
      b.scale(dpr, dpr);
      b.fillStyle = 'rgba(255,123,248,.07)';
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) b.fillRect(x, y, 1.5, 1.5);
      if (reduceMotion) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(base, 0, 0); }
    }

    function frame() {
      if (!document.hidden) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.drawImage(base, 0, 0);
        ctx.scale(dpr, dpr);

        if (pointer.active) {
          m.x += (pointer.x - m.x) * .18;
          m.y += (pointer.y - m.y) * .18;
          const x0 = Math.floor((m.x - RADIUS) / GAP), x1 = Math.ceil((m.x + RADIUS) / GAP);
          const y0 = Math.floor((m.y - RADIUS) / GAP), y1 = Math.ceil((m.y + RADIUS) / GAP);
          for (let gy = y0; gy <= y1; gy++) {
            for (let gx = x0; gx <= x1; gx++) {
              const x = gx * GAP + GAP / 2, y = gy * GAP + GAP / 2;
              const d = Math.hypot(x - m.x, y - m.y);
              if (d > RADIUS) continue;
              const k = 1 - d / RADIUS;
              ctx.fillStyle = `rgba(255,123,248,${(k * k * .55).toFixed(3)})`;
              const s = 1.5 + k * 1.5;
              ctx.fillRect(x - s / 2 + .75, y - s / 2 + .75, s, s);
            }
          }
        }

        if (Math.random() < .35) {
          twinkles.push({
            x: (Math.floor(Math.random() * w / GAP)) * GAP + GAP / 2,
            y: (Math.floor(Math.random() * h / GAP)) * GAP + GAP / 2,
            life: 1
          });
        }
        for (let i = twinkles.length - 1; i >= 0; i--) {
          const t = twinkles[i];
          t.life -= .025;
          if (t.life <= 0) { twinkles.splice(i, 1); continue; }
          ctx.fillStyle = `rgba(255,123,248,${(Math.sin(t.life * Math.PI) * .45).toFixed(3)})`;
          ctx.fillRect(t.x - .5, t.y - .5, 2.5, 2.5);
        }
      }
      requestAnimationFrame(frame);
    }

    resize();
    addEventListener('resize', resize);
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  function trackPointer() {
    const coords = $('#hudCoords');
    let queued = false;
    addEventListener('pointermove', e => {
      pointer.x = e.clientX; pointer.y = e.clientY;
      pointer.nx = e.clientX / innerWidth * 2 - 1;
      pointer.ny = e.clientY / innerHeight * 2 - 1;
      pointer.active = e.pointerType === 'mouse';
      if (coords && !queued) {
        queued = true;
        requestAnimationFrame(() => {
          coords.innerHTML = `X <b>${pad(Math.round(pointer.x), 4)}</b> · Y <b>${pad(Math.round(pointer.y + scrollY), 4)}</b>`;
          queued = false;
        });
      }
    });
    document.addEventListener('pointerleave', () => { pointer.active = false; });
  }

  /* ======================================================================
     LOADER — 3s boot sequence
     ====================================================================== */
  function runLoader(done) {
    const el = $('#loader');
    if (!el) { done(); return; }
    const fill = $('#loaderFill'), pct = $('#loaderPct'), bar = $('.loader__bar', el);
    const status = $('#loaderStatus'), log = $('#loaderLog'), label = $('.loader__text', el);

    // progress curve with little "stalls" so it feels like real loading
    const KEYS = [[0, 0], [.12, .16], [.26, .21], [.5, .58], [.62, .62], [.86, .93], [1, 1]];
    const LOG = [
      [.03, '> mounting pixels ........ OK'],
      [.24, '> calibrating pink ....... #FF7BF8'],
      [.48, '> loading case studies ... OK'],
      [.7, '> brewing coffee ......... OK'],
      [.93, '> ready player one_']
    ];
    const STATUS = [[0, 'BOOTING PORTFOLIO.EXE'], [.5, 'RENDERING INTERFACE'], [.9, 'ALMOST THERE']];
    const dur = reduceMotion ? 600 : CONFIG.loaderMs;
    let start = null, li = 0;

    const curve = t => {
      for (let i = 1; i < KEYS.length; i++) {
        const [t1, v1] = KEYS[i], [t0, v0] = KEYS[i - 1];
        if (t <= t1) return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
      }
      return 1;
    };

    function frame(now) {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / dur);
      const p = curve(t);
      fill.style.width = (Math.floor(p * 40) / 40 * 100) + '%';
      pct.textContent = pad(Math.round(p * 100), 3) + '%';
      bar.setAttribute('aria-valuenow', Math.round(p * 100));
      while (li < LOG.length && t >= LOG[li][0]) {
        const line = document.createElement('div');
        line.textContent = LOG[li][1];
        log.appendChild(line);
        li++;
      }
      status.textContent = STATUS.filter(s => t >= s[0]).pop()[1];
      if (t < 1) requestAnimationFrame(frame);
      else finish();
    }

    function finish() {
      label.textContent = 'ready!';
      status.textContent = 'PRESS START';
      el.classList.add('is-done');
      setTimeout(() => {
        el.classList.add('is-exit');
        setTimeout(done, 350);
        setTimeout(() => el.remove(), 800);
      }, 200);
    }

    requestAnimationFrame(frame);
  }

  /* ======================================================================
     TEXT SCRAMBLE / REVEAL / COUNTERS
     ====================================================================== */
  const GLYPHS = '█▓▒░#@$%&*+=<>/\\_';

  // maxMs caps long lines (the view-master card), so a slide change resolves quickly
  function scramble(el, maxMs = Infinity) {
    if (el.dataset.scrambled) return;
    el.dataset.scrambled = '1';
    const final = el.textContent;
    if (reduceMotion) return;
    el.setAttribute('aria-label', final);
    const dur = Math.min(maxMs, 900, Math.max(350, final.length * 22));
    let start = null;
    function step(now) {
      if (start === null) start = now;
      const p = (now - start) / dur;
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        out += (c === ' ' || i / final.length < p) ? c : GLYPHS[Math.random() * GLYPHS.length | 0];
      }
      el.textContent = out;
      if (p < 1) setTimeout(() => requestAnimationFrame(step), 45);
      else { el.textContent = final; el.removeAttribute('aria-label'); }
    }
    requestAnimationFrame(step);
  }

  function startReveals() {
    const delayOf = el => (parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0) * 1000;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        if (el.classList.contains('reveal')) el.classList.add('is-in');
        if (el.hasAttribute('data-scramble')) setTimeout(() => scramble(el), delayOf(el));
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal, [data-scramble]').forEach(el => io.observe(el));
  }

  /* ======================================================================
     NAV — scroll state, scroll-spy, mobile menu
     ====================================================================== */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const menuBtn = $('#menuBtn');
    const hudLevel = $('#hudLevel');

    // every screen: scrolling down tucks the nav (and the sticky filter bar) away, scrolling up brings them back
    let lastY = scrollY;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const y = Math.min(Math.max(scrollY, 0), max);     // ignore the iOS rubber-band bounce at either end
      const dy = y - lastY;
      nav.classList.toggle('is-scrolled', y > 8);
      if (nav.classList.contains('is-open') || y < 80) { document.body.classList.remove('nav-hidden'); lastY = y; return; }
      if (dy > 12) { document.body.classList.add('nav-hidden'); lastY = y; }          // a real swipe down hides
      else if (dy < -8) { document.body.classList.remove('nav-hidden'); lastY = y; }  // a small swipe up brings it back
      else if ((dy > 0) === document.body.classList.contains('nav-hidden')) lastY = y; // keep the anchor moving with the current direction
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    const setMenu = open => {
      nav.classList.toggle('is-open', open);
      if (open) document.body.classList.remove('nav-hidden');
      menuBtn?.setAttribute('aria-expanded', String(open));
      if (menuBtn) setIcon($('.px-ico', menuBtn), open ? 'close' : 'menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    $$('.nav__link').forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

    if (page !== 'home') return;
    const sections = $$('main [data-section]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        $$('.nav__link').forEach(a => {
          const on = a.dataset.target === id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
        if (hudLevel) {
          const i = sections.indexOf(e.target);
          hudLevel.innerHTML = `LVL <b>${pad(i + 1)}</b> — ${e.target.dataset.section}`;
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* pixel things from Shiran's world: collected in the hero game, reused by the about-page viewer */
  const ITEM_COLORS = {
    o: '#A3A9B8', O: '#6F7486', a: '#F0A93E', e: '#1A0A0E', n: '#FF9EC7', // blue-grey scottish fold, amber eyes
    P: '#FF7BF8', D: '#93408F', K: '#0B0408', w: '#F6ECF2', W: '#C9BCC4', c: '#6B3A22',      // pen tool, mug, coffee
    s: 'rgba(255,244,236,.45)', g: '#C8C2CC', G: '#8E8794', b: '#2A2320', l: '#3B1440'   // steam, metal, body, glass
  };
  // `at`: where it sits, as a fraction of the walkable area (kept away from her start, bottom centre)
  const ITEMS = [
    // folded ears = the two dark caps lying flat on a round head
    { id: 'cat', label: 'scottish fold · moral support', at: [.1, .3], rows: [
      '..OoooO....', '.OOoooOO...', '.ooooooo...', '.oaeoaeo...', '.ooonooo...',
      '..ooooo..O.', '.ooOoOoo..O', '.oooooooo.O', '.oooooooooO', '.oo.ooo.oo.'] },
    { id: 'pen', label: 'pen tool · bezier mode', at: [.86, .12], rows: [
      // fountain-pen nib at 45°, same size and palette as the others: metal nib with a shaded side, a hole + slit, pink cap
      '......P...', '.....PPP..', '......PPD.', '...ggg.PPD', '..ggggG.D.',
      '..gggGG...', '.ggKGGG...', '.gKGGG....', '.KGG......', 'g.........'] },
    { id: 'laptop', label: 'laptop · figma open', at: [.26, 0], rows: [
      '..gggggggggg..', '..gllllllllg..', '..glPPPllllg..', '..gllllPPPlg..', '..glPPlllllg..',
      '..gllllllllg..', '..gggggggggg..', 'GGGGGGGGGGGGGG', '.GGGGGGGGGGGG.'] },
    { id: 'coffee', label: 'coffee · fuel +100', at: [.14, .92], rows: [
      '...s..s....', '..s..s.....', '...s..s....', '.wccccccw..', '.wwwwwwwwww',
      '.wwPwwwww.w', '.wwwwwwwwww', '..wwwwwww..', '.GGGGGGGGG.'] },
    { id: 'camera', label: 'film camera · 35mm', at: [.88, .78], rows: [
      '.gg......gg..', 'ggggggggggggg', 'gGGGGGGGGGGGg', 'bbbbbGGGbbbbb', 'bbbbGlllGbbPb',
      'bbbbGlwlGbbbb', 'bbbbGlllGbbbb', 'bbbbbGGGbbbbb', '.bbbbbbbbbbb.'] }
  ];
  // a sprite on its own little canvas, with a 1px soft pink outline
  function itemSprite(rows, flip) {
    const w = rows[0].length, h = rows.length;
    const c = document.createElement('canvas');
    c.width = w + 2; c.height = h + 2;
    const x = c.getContext('2d');
    const solid = (cx, cy) => rows[cy] && rows[cy][cx] && rows[cy][cx] !== '.' && rows[cy][cx] !== 's';
    rows.forEach((row, y) => [...row].forEach((ch, xx) => {
      if (ch === '.') return;
      x.fillStyle = ITEM_COLORS[ch];
      x.fillRect(flip ? w - xx : xx + 1, y + 1, 1, 1);
    }));
    x.fillStyle = 'rgba(255,123,248,.55)';                   // same soft pink outline as hers (steam stays airy)
    for (let y = -1; y <= h; y++) for (let xx = -1; xx <= w; xx++) {
      if (solid(xx, y) || (rows[y] && rows[y][xx] === 's')) continue;
      if (solid(xx - 1, y) || solid(xx + 1, y) || solid(xx, y - 1) || solid(xx, y + 1)) x.fillRect(flip ? w - xx : xx + 1, y + 1, 1, 1);
    }
    return c;
  }

  /* ======================================================================
     HERO — a tiny game board: pixel Shiran walks wherever you click
     ====================================================================== */
  function initPlayer() {
    const cv = $('#player');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const box = cv.parentElement;
    const bubble = $('#playerBubble'), nameTag = $('#playerName');
    const TILE = 8;
    const PINK = '#FF7BF8', SOFT = '#FFD2FD';
    // board, in game pixels: a roomier floor on desktop, the compact one on phones
    let W = 0, HGT = 0, MIN_X, MAX_X, MIN_Y, MAX_Y;              // MIN/MAX: where her feet may go

    function fit() {
      const bw = box.clientWidth;
      const [w, h] = bw >= 560 ? [200, 152] : bw >= 420 ? [160, 128] : [112, 92];
      if (w !== W) {
        if (W) {
          me.x *= w / W; me.y *= h / HGT; if (target) target = null;
          if (pet) { pet.x *= w / W; pet.y *= h / HGT; }
        }
        W = w; HGT = h;
        MIN_X = 14; MAX_X = W - 14; MIN_Y = 40; MAX_Y = HGT - 12;
        cv.width = W; cv.height = HGT;
        buildBoard();
        placeItems();
      }
      const s = Math.max(1, Math.floor(box.clientWidth / W * 2) / 2);   // half steps keep pixels square on retina
      cv.style.width = (W * s) + 'px';
      cv.style.height = (HGT * s) + 'px';
      if (hud) hud.style.top = Math.max(0, cv.offsetTop + cv.offsetHeight * .03) + 'px';
    }

    /* --- sprite sheets (18 × 32). Upper body and legs are separate, so the walk only swaps the legs --- */
    const COLORS = {
      H: '#2E1912', h: '#4A2A1C', r: '#7A3D22',              // curly hair, highlights, sun-kissed ends
      s: '#C98C6A', S: '#A56D50', e: '#1A0A0E', o: '#7A3B33', m: '#FFF4EC',   // skin, eyes, smile
      T: '#3E3530', t: '#2A2320', b: '#0E0A0A',              // brown top + buttons
      j: '#8DB6E0', J: '#6A92C2', w: '#F6ECF2', k: '#B07AA5', // light jeans, white sneakers
      P: PINK                                                 // phone screen
    };
    // idle poses, front view only: [row, col, char] patches on top of the standing sprite
    const POSES = {
      // a big stretch: eyes shut, mouth wide open, arms up past her hair
      yawn: [[6, 6, 'S'], [6, 11, 'S'], [8, 6, 's'], [8, 7, 'o'], [8, 8, 'e'], [8, 9, 'e'], [8, 10, 'o'], [8, 11, 's'], [9, 8, 'e'], [9, 9, 'e'],
        ...[13, 14, 15, 16].flatMap(r => [[r, 3, 'H'], [r, 14, 'H']]), ...[17, 18, 19, 20].flatMap(r => [[r, 3, '.'], [r, 14, '.']]),
        ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].flatMap(r => [[r, 1, 's'], [r, 16, 's']]), [0, 1, 'S'], [1, 1, 's'], [0, 16, 'S'], [1, 16, 's']],
      // eyes down, small mouth, forearms in, phone held at the waist (two frames: the feed scrolls)
      phone: [[6, 6, 's'], [6, 11, 's'], [7, 6, 'e'], [7, 11, 'e'], [8, 6, 's'], [8, 7, 's'], [8, 8, 'o'], [8, 9, 'o'], [8, 10, 's'], [8, 11, 's'],
        ...[16, 17, 18, 19, 20].flatMap(r => [[r, 3, '.'], [r, 14, '.']]),
        [15, 4, 's'], [15, 13, 's'], [16, 5, 's'], [16, 12, 's'], [17, 6, 's'], [17, 11, 's'],
        [15, 7, 'b'], [15, 8, 'b'], [15, 9, 'b'], [15, 10, 'b'], [16, 7, 'b'], [16, 10, 'b'], [17, 7, 'b'], [17, 10, 'b'], [18, 7, 'b'], [18, 8, 'b'], [18, 9, 'b'], [18, 10, 'b'],
        [16, 8, 'P'], [16, 9, 'P'], [17, 8, 'P'], [17, 9, 'P']]
    };
    const PHONE_SCROLL = [[16, 8, 'm'], [16, 9, 'm']];       // second frame: a bright line moves through the feed
    const OUTLINE = 'rgba(255,123,248,.55)';
    const HAIR_TOP = ['.....hhhhhhhh.....', '...hhHHHHHHHHhh...', '..hHHHHHHHHHHHHh..', '.hHHHHHHHHHHHHHHh.'];
    const UPPER = {
      down: [...HAIR_TOP,
        '.HHHHHssssssHHHHH.', 'hHHHHssssssssHHHHh', 'hHHHH' + 'sesssses' + 'HHHHh', 'HHHHHssssssssHHHHH',
        'HHHHH' + 'sommmmos' + 'HHHHH', 'hHHHHHssssssHHHHHh', 'HHHHHHHssssHHHHHHH', 'HHHHssssssssssHHHH',
        'HHHs' + 'ssssssssss' + 'sHHH', 'HHHsTTTTssTTTTsHHH', 'HHHsTTTbTTTTTTsHHH', 'HHrsTTTTTTTTTtsrHH',
        'HrrsTTTbTTTTTtsrrH', 'rr.sTTTTTTTTTts.rr', 'r..stttttttttts..r', '...sjjjjjjjjjjs...', '...SjjjjJjjjjjS...'],
      up: [...HAIR_TOP,
        '.HHHHHHHHHHHHHHHH.', 'hHHHHHHHHHHHHHHHHh', 'hHHHHHHHHHHHHHHHHh', 'hHHHHHHHHHHHHHHHHh',
        'hHHHHHHHHHHHHHHHHh', 'hHHHHHHHHHHHHHHHHh', 'HHHHHHHHHHHHHHHHHH', 'HHHHsHHHHHHHHsHHHH',
        'HHHssHHHHHHHHssHHH', 'HHHsTHHHHHHHHTsHHH', 'HHHsTHHHHHHHHTsHHH', 'HHrsTHHHHHHHHTsrHH',
        'HrrsTrHHHHHHrTsrrH', 'rr.sTrrHrrHrrTs.rr', 'r..sttrtrrtrtts..r', '...sjjjjjjjjjjs...', '...SjJjjjjjjJjS...'],
      side: ['......hhhhhh......', '....hhHHHHHHh.....', '...hHHHHHHHHHh....', '..hHHHHHHHHHHHh...',
        '..HHHHHHHHHssss...', '.hHHHHHHHHssess...', '.HHHHHHHHHssssss..', 'hHHHHHHHHHssso....',
        'hHHHHHHHHHHsss....', 'HHHHHHHHHHHss.....', 'HHHHHHHHHHss......', 'HHHHHHHHsssss.....',
        'HHHHHHHTTssTT.....', 'HHHHHHHTTssTT.....', 'HHHHHHrTTssTb.....', 'rHHHHrrTTssTT.....',
        '.rrHrr.TTssTb.....', '..rr.r.TTssTT.....', '.......ttsstt.....', '.......jjsSjj.....', '.......jjSSjj.....']
    };
    const LEGS_FRONT = ['....jjjjjjjjjj....', '....jjjjjJjjjj....', '....jjjjJJjjjj....',
      ...Array(6).fill('....jjjJ..Jjjj....'), '....wwww..wwww....', '....kkkk..kkkk....'];
    const LEGS_SIDE = [
      ['.......jjjjjj.....', '.......jjjjjj.....', '........jjjj......', ...Array(6).fill('........jjjJ......'),
        '........wwwww.....', '........kkkkk.....'],
      ['.......jjjjjj.....', '.......jjjjjj.....', '......jjjjjjj.....', '......jjj.jjj.....', '......jjj..jjj....',
        '.....jjj...jjj....', '.....jjj....jjj...', '.....jjJ....jjj...', '....jjj.....jjj...',
        '...www......wwww..', '...kkk......kkkk..']
    ];
    // lift one leg (cols 4–7 or 10–13) a pixel for the front/back walk
    const liftLeg = (rows, from) => rows.map((row, i) => {
      if (i < 3) return row;
      const src = rows[i + 1] || '..................';
      return row.slice(0, from) + src.slice(from, from + 4) + row.slice(from + 4);
    });

    const cache = {};
    function sprite(dir, step, blink, pose = '', frame = 0) {
      const key = dir + step + blink + pose + frame;
      if (cache[key]) return cache[key];
      const base = dir === 'left' || dir === 'right' ? 'side' : dir;
      let legs;
      if (base === 'side') legs = LEGS_SIDE[step % 2];
      else legs = step === 0 || step === 2 ? LEGS_FRONT : liftLeg(LEGS_FRONT, step === 1 ? 4 : 10);
      const rows = [...UPPER[base], ...legs];
      if (pose && base === 'down') {
        [...POSES[pose], ...(pose === 'phone' && frame ? PHONE_SCROLL : [])].forEach(([r, c, ch]) => {
          rows[r] = rows[r].slice(0, c) + ch + rows[r].slice(c + 1);
        });
      }
      const c = document.createElement('canvas');
      c.width = 20; c.height = 34;
      const x = c.getContext('2d');
      const solid = (cx, cy) => rows[cy] && rows[cy][cx] && rows[cy][cx] !== '.';
      rows.forEach((row, y) => [...row].forEach((ch, xx) => {
        if (ch === '.') return;
        if (ch === 'H' && (xx * 3 + y * 5) % 11 === 0) ch = 'h';              // a few curls catching the light
        if (blink && ch === 'e') ch = 'S';
        x.fillStyle = COLORS[ch];
        x.fillRect(xx + 1, y + 1, 1, 1);
      }));
      x.fillStyle = OUTLINE;                                                 // soft pink outline, so dark hair reads on the dark board
      for (let y = -1; y <= 32; y++) for (let xx = -1; xx <= 18; xx++) {
        if (solid(xx, y)) continue;
        if (solid(xx - 1, y) || solid(xx + 1, y) || solid(xx, y - 1) || solid(xx, y + 1)) x.fillRect(xx + 1, y + 1, 1, 1);
      }
      if (dir === 'left') {
        const f = document.createElement('canvas');
        f.width = 20; f.height = 34;
        const fx = f.getContext('2d');
        fx.translate(20, 0); fx.scale(-1, 1); fx.drawImage(c, 0, 0);
        return (cache[key] = f);
      }
      return (cache[key] = c);
    }

    /* --- the board --- */
    const board = document.createElement('canvas');
    // the floor's outline: an uneven blob whose radius wobbles with the angle (1 = board edge)
    const blobEdge = a => 1.04 + .09 * Math.sin(2 * a + 1.3) + .06 * Math.sin(3 * a + .4) + .04 * Math.sin(5 * a + 2.1);
    function buildBoard() {
      board.width = W; board.height = HGT;
      const b = board.getContext('2d');
      for (let ty = 0; ty < HGT / TILE; ty++) for (let tx = 0; tx < W / TILE; tx++) {
        b.fillStyle = (tx + ty) % 2 ? 'rgba(255,123,248,.07)' : 'rgba(255,123,248,.03)';
        b.fillRect(tx * TILE, ty * TILE, TILE, TILE);
        b.fillStyle = 'rgba(255,123,248,.32)';
        b.fillRect(tx * TILE, ty * TILE, 1, 1);
      }
      // no edges: the floor melts away into a soft, uneven blob (radius wobbles with the angle)
      const img = b.getImageData(0, 0, W, HGT), d = img.data;
      for (let y = 0; y < HGT; y++) for (let x = 0; x < W; x++) {
        const nx = (x + .5) / W * 2 - 1, ny = (y + .5) / HGT * 2 - 1;
        const t = Math.min(1, Math.max(0, (Math.hypot(nx, ny) / blobEdge(Math.atan2(ny, nx)) - .45) / .55));
        const rim = Math.min(1, (1 - Math.max(Math.abs(nx), Math.abs(ny))) / .12);   // never a hard cut at the canvas edge
        d[(y * W + x) * 4 + 3] *= (1 - t * t * (3 - 2 * t)) * rim * rim * (3 - 2 * rim);   // smoothstep fades
      }
      b.putImageData(img, 0, 0);
    }

    const items = ITEMS.map((it, i) => ({ ...it, img: itemSprite(it.rows), phase: i * .37, got: false, gotT: 0, armed: true, x: 0, y: 0 }));
    const near = it => Math.abs(it.x - me.x) < 9 && Math.abs(it.y - me.y) < 6;
    const catImg = { right: items[0].img, left: itemSprite(ITEMS[0].rows, true) };
    let pet = null, found = 0, clock = 0;
    const sparks = [];

    /* --- state --- */
    const me = { x: 56, y: 70, dir: 'down', step: 0, walkT: 0, moving: false };
    let target = null, markerT = 0, blinkT = 2.5, blinking = 0, said = false, last = performance.now();

    // keep a point on the visible part of the floor
    function onFloor(x, y) {
      let nx = x / W * 2 - 1, ny = y / HGT * 2 - 1;
      const lim = blobEdge(Math.atan2(ny, nx)) * .8, r = Math.hypot(nx, ny);
      if (r > lim) { nx *= lim / r; ny *= lim / r; }
      x = (nx + 1) / 2 * W; y = (ny + 1) / 2 * HGT;
      return { x: Math.max(MIN_X, Math.min(MAX_X, x)), y: Math.max(MIN_Y, Math.min(MAX_Y, y)) };
    }
    function placeItems() {
      items.forEach(it => {
        const p = onFloor(MIN_X + it.at[0] * (MAX_X - MIN_X), MIN_Y + it.at[1] * (MAX_Y - MIN_Y));
        it.x = Math.round(p.x); it.y = Math.round(p.y);
      });
    }

    /* --- HUD: five slots that light up, then the reward --- */
    const hud = document.createElement('div');
    hud.className = 'hero__hud';
    hud.setAttribute('role', 'status');
    hud.setAttribute('aria-live', 'polite');
    box.appendChild(hud);
    hud.addEventListener('click', e => e.stopPropagation());   // its links shouldn't make her walk
    function drawHud() {
      hud.classList.remove('is-win');
      hud.innerHTML = `<span class="hero__hud-label">collect my things</span>` +
        items.map(it => `<img src="${it.img.toDataURL()}" width="${it.img.width * 2}" height="${it.img.height * 2}" alt="" data-item="${it.id}"${it.got ? ' class="is-got"' : ''}>`).join('') +
        `<span class="hero__hud-count">${found}/${items.length}</span>` +
        `<span class="sr-only">${found} of ${items.length} found</span>`;
    }
    function win() {
      hud.classList.add('is-win');
      hud.innerHTML = `<span class="hero__hud-title">achievement unlocked</span>` +
        `<span>you found my whole toolkit</span>` +
        `<span class="hero__hud-links"><a href="projects.html">see my work →</a><button type="button">play again</button></span>`;
      $('button', hud).addEventListener('click', reset);
      Sound.fanfare();
      burst(me.x, me.y - 20, 46, 1.6);
      try { localStorage.setItem('px-toolkit', '1'); } catch (e) { /* ignore */ }
      initTrophy();
    }
    function reset() {
      // whatever she's standing on waits until she steps off, so nothing gets re-collected on the spot
      items.forEach(it => { it.got = false; it.gotT = 0; it.armed = !near(it); });
      found = 0; pet = null;
      drawHud();
    }

    function pop(text, kind = '') {                             // "+1 coffee" floats up from her head
      const el = document.createElement('span');
      el.className = 'hero__pop' + (kind ? ' hero__pop--' + kind : '');
      el.textContent = text;
      box.appendChild(el);
      const bx = cv.offsetLeft + (me.x / W) * cv.offsetWidth;
      el.style.left = Math.max(el.offsetWidth / 2 + 4, Math.min(box.clientWidth - el.offsetWidth / 2 - 4, bx)) + 'px';
      el.style.top = (cv.offsetTop + ((me.y - 40) / HGT) * cv.offsetHeight) + 'px';
      el.addEventListener('animationend', () => el.remove());
      setTimeout(() => el.remove(), 3000);                     // fallback when animations are off
    }
    function burst(x, y, n, power = 1) {
      if (reduceMotion) return;
      const cols = [PINK, SOFT, '#FFE15C'];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = (12 + Math.random() * 26) * power;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 18 * power, life: .5 + Math.random() * .5 * power, c: cols[i % 3] });
      }
    }
    function pickUp(it) {
      it.got = true; it.gotT = 0; found++;
      Sound.pickup();
      pop('+1 ' + it.label);
      burst(it.x, it.y - 5, 10);
      if (it.id === 'cat') pet = { x: it.x, y: it.y, t: 0, moving: false, face: 'right' };
      drawHud();
      const img = $(`img[data-item="${it.id}"]`, hud);
      if (img) img.classList.add('is-new');
      if (found === items.length) setTimeout(win, 650);
    }

    // everything besides her walk: pickups, the cat tagging along, sparks
    function updateWorld(dt) {
      clock += dt;
      items.forEach(it => {
        if (it.got) { it.gotT += dt; return; }
        if (!it.armed) { it.armed = !near(it); return; }
        if (near(it)) pickUp(it);
      });
      if (pet) {
        // trot to a spot just behind her; sit when close
        const side = me.dir === 'left' ? 1 : me.dir === 'right' ? -1 : (pet.x < me.x ? -1 : 1);
        const goal = onFloor(me.x + side * 14, me.y + 1);
        const dx = goal.x - pet.x, dy = goal.y - pet.y, d = Math.hypot(dx, dy);
        pet.moving = d > 2.5;
        if (pet.moving) {
          const m = Math.min(d, (d > 24 ? 64 : 42) * dt);
          pet.x += dx / d * m; pet.y += dy / d * m;
          if (Math.abs(dx) > .5) pet.face = dx > 0 ? 'right' : 'left';
        } else pet.face = pet.x < me.x ? 'right' : 'left';
        pet.t += dt;
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life -= dt;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        p.vy += 70 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      }
    }

    /* --- idle: left alone, she gets bored — a yawn, then out comes the phone --- */
    // one yawn per visit, straight into the phone, and she stays on it until someone plays
    const YAWN_AT = 5, YAWN_FOR = 2.2, PHONE_AT = YAWN_AT + YAWN_FOR;
    let idleT = 0, pose = '', heartT = 0, yawned = false;
    const hearts = [];
    function wake() {
      if (pose === 'phone') pop('!', 'idle');                 // caught scrolling
      if (pose === 'yawn' && bubble && !said) bubble.classList.remove('is-gone');
      idleT = 0; pose = ''; heartT = 0;
    }
    function updateIdle(dt) {
      if (target) { idleT = 0; pose = ''; }
      else idleT += dt;
      const was = pose;
      pose = idleT >= PHONE_AT ? 'phone' : idleT >= YAWN_AT && (!yawned || was === 'yawn') ? 'yawn' : '';
      if (pose === 'yawn') yawned = true;
      if (pose && pose !== was) {
        me.dir = 'down';                                      // turn to face us
        if (pose === 'yawn') pop('*yawn*', 'yawn');
      }
      if (bubble && !said && pose !== was) bubble.classList.toggle('is-gone', pose === 'yawn');   // the yawn takes the hello bubble's spot for a moment
      if (pose === 'phone' && !reduceMotion && (heartT += dt) > 3.2) {   // liking posts now and then
        heartT = 0;
        hearts.push({ x: me.x + (Math.random() < .5 ? -2 : 1), y: me.y - 18, t: 0 });
      }
      for (let i = hearts.length - 1; i >= 0; i--) if ((hearts[i].t += dt) > 1.2) hearts.splice(i, 1);
    }
    // anything the visitor does wakes her up
    ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, wake));
    box.addEventListener('pointermove', wake);

    function moveTo(x, y) {
      target = onFloor(x, y);
      markerT = 0;
      if (reduceMotion) { me.x = target.x; me.y = target.y; target = null; }
      if (!said) { said = true; bubble && bubble.classList.add('is-gone'); nameTag && nameTag.classList.add('is-on'); }
    }

    function update(dt) {
      blinkT -= dt;
      if (blinkT <= 0) { blinking = .14; blinkT = 2.2 + Math.random() * 2.6; }
      if (blinking > 0) blinking -= dt;
      markerT += dt;
      if (!target) { me.moving = false; me.step = 0; return; }
      const dx = target.x - me.x, dy = target.y - me.y, d = Math.hypot(dx, dy);
      const SPEED = 46;
      if (d < 1) { me.x = target.x; me.y = target.y; target = null; me.moving = false; me.step = 0; return; }
      const m = Math.min(d, SPEED * dt);
      me.x += dx / d * m; me.y += dy / d * m;
      me.dir = Math.abs(dx) > Math.abs(dy) * .9 ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      me.moving = true;
      me.walkT += dt;
      me.step = [1, 2, 3, 2][Math.floor(me.walkT / .13) % 4];   // left foot, pass, right foot, pass
    }

    function drawMarker() {
      if (!target) return;
      const x = Math.round(target.x), y = Math.round(target.y);
      const g = 4 - Math.min(2, Math.floor(markerT * 8) % 3);   // brackets pulse inward
      ctx.fillStyle = PINK;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
        ctx.fillRect(x + sx * g - (sx < 0 ? 0 : 1), y + sy * Math.ceil(g / 2) - (sy < 0 ? 0 : 1), 1, 1);
        ctx.fillRect(x + sx * g - (sx < 0 ? 0 : 1) - sx, y + sy * Math.ceil(g / 2) - (sy < 0 ? 0 : 1), 1, 1);
      });
      ctx.fillStyle = SOFT; ctx.fillRect(x, y, 1, 1);
    }

    function render() {
      ctx.clearRect(0, 0, W, HGT);
      ctx.drawImage(board, 0, 0);
      drawMarker();
      const x = Math.round(me.x), y = Math.round(me.y);
      const step = me.dir === 'left' || me.dir === 'right' ? (me.step === 1 || me.step === 3 ? 1 : 0) : me.step;
      const bob = me.moving && (me.step === 1 || me.step === 3) ? 1 : 0;
      const drawMe = () => {
        ctx.fillStyle = 'rgba(0,0,0,.55)';                     // shadow
        ctx.fillRect(x - 6, y - 1, 12, 2); ctx.fillRect(x - 4, y + 1, 8, 1);
        const frame = pose === 'phone' && !reduceMotion ? Math.floor(clock / .7) % 2 : 0;
        ctx.drawImage(sprite(me.dir, step, blinking > 0 && me.dir !== 'up' && pose !== 'yawn', pose, frame), x - 10, y - 33 - bob);
      };
      const drawItem = it => {
        const img = it.img, k = it.got ? it.gotT / .45 : 0;
        if (k >= 1) return;
        const lift = reduceMotion ? 0 : it.got ? Math.round(k * 9) : Math.floor(clock * 1.6 + it.phase) % 2;
        const ix = it.x - (img.width >> 1), iy = it.y - img.height + 1;
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(ix + 2, it.y, img.width - 4, 1);
        ctx.drawImage(img, ix, iy - lift);
        if (!it.got && !reduceMotion && (clock + it.phase * 3) % 2.6 < .18) {   // a glint now and then, so they catch the eye
          ctx.fillStyle = SOFT;
          const gx = ix + img.width - 2, gy = iy - lift - 1;
          ctx.fillRect(gx, gy - 1, 1, 3); ctx.fillRect(gx - 1, gy, 3, 1);
        }
        ctx.globalAlpha = 1;
      };
      const drawPet = () => {
        const hop = pet.moving && !reduceMotion ? Math.floor(pet.t * 9) % 2 : 0;
        const img = catImg[pet.face], px = Math.round(pet.x), py = Math.round(pet.y);
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.fillRect(px - 4, py, 8, 1);
        ctx.drawImage(img, px - (img.width >> 1), py - img.height + 1 - hop);
      };
      // back to front, so whoever stands lower on the floor is drawn on top
      const layers = items.filter(it => !(it.got && it.id === 'cat')).map(it => [it.y, () => drawItem(it)]);
      if (pet) layers.push([pet.y, drawPet]);
      layers.push([y + .5, drawMe]);
      layers.sort((a, b) => a[0] - b[0]).forEach(l => l[1]());
      sparks.forEach(p => { ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); });
      hearts.forEach(h => {                                    // tiny pixel hearts drifting up from the phone
        const hx = Math.round(h.x), hy = Math.round(h.y - h.t * 10);
        ctx.globalAlpha = 1 - h.t / 1.2;
        ctx.fillStyle = PINK;
        [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, 2]].forEach(([dx, dy]) => ctx.fillRect(hx + dx, hy + dy, 1, 1));
        ctx.globalAlpha = 1;
      });

      const at = (el, dy) => {                                 // pin a DOM label above her head
        el.style.left = (cv.offsetLeft + (x / W) * cv.offsetWidth) + 'px';
        el.style.top = (cv.offsetTop + ((y + dy - bob) / HGT) * cv.offsetHeight) + 'px';
      };
      if (bubble && !said) at(bubble, -36);
      if (nameTag && said) at(nameTag, -35);
    }

    fit();
    drawHud();
    me.x = W / 2; me.y = Math.round(HGT * .76);
    addEventListener('resize', fit);

    box.addEventListener('click', e => {
      const rc = cv.getBoundingClientRect();
      moveTo((e.clientX - rc.left) / rc.width * W, (e.clientY - rc.top) / rc.height * HGT);
    });
    // keyboard: focus the board and walk with the arrow keys
    cv.tabIndex = 0;
    cv.addEventListener('keydown', e => {
      const d = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[e.key];
      if (!d) return;
      e.preventDefault();
      moveTo((target ? target.x : me.x) + d[0], (target ? target.y : me.y) + d[1]);
    });

    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);

    function frame(now) {
      const dt = Math.min(.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) { update(dt); updateIdle(dt); updateWorld(dt); render(); }
      requestAnimationFrame(frame);
    }
    render();
    requestAnimationFrame(frame);
  }

  /* ======================================================================
     ABOUT — pixelated portrait, "enhance" on hover
     ====================================================================== */
  function makeAvatar() {
    const c = document.createElement('canvas');
    c.width = 320; c.height = 400;
    const x = c.getContext('2d');
    let g = x.createRadialGradient(150, 140, 10, 160, 200, 260);
    g.addColorStop(0, '#6a6a6a'); g.addColorStop(1, '#262626');
    x.fillStyle = g; x.fillRect(0, 0, 320, 400);
    // hair (back)
    x.fillStyle = '#0c0c0c';
    x.beginPath(); x.ellipse(160, 168, 96, 112, 0, 0, Math.PI * 2); x.fill();
    x.fillRect(64, 168, 192, 150);
    // neck
    x.fillStyle = '#a9a9a9'; x.fillRect(136, 228, 48, 70);
    // shoulders
    g = x.createLinearGradient(0, 300, 0, 400);
    g.addColorStop(0, '#9a9a9a'); g.addColorStop(1, '#3c3c3c');
    x.fillStyle = g;
    x.beginPath(); x.ellipse(160, 430, 156, 118, 0, 0, Math.PI * 2); x.fill();
    // face
    g = x.createRadialGradient(138, 140, 8, 160, 172, 92);
    g.addColorStop(0, '#f4f4f4'); g.addColorStop(1, '#8e8e8e');
    x.fillStyle = g;
    x.beginPath(); x.ellipse(160, 172, 62, 78, 0, 0, Math.PI * 2); x.fill();
    // fringe
    x.fillStyle = '#0c0c0c';
    x.beginPath();
    x.moveTo(92, 150); x.quadraticCurveTo(120, 92, 168, 104); x.quadraticCurveTo(210, 112, 226, 160);
    x.quadraticCurveTo(232, 70, 160, 62); x.quadraticCurveTo(86, 66, 92, 150);
    x.fill();
    // eyes + smile
    x.fillStyle = '#1e1e1e';
    x.fillRect(128, 168, 18, 9); x.fillRect(174, 168, 18, 9);
    x.strokeStyle = '#4a4a4a'; x.lineWidth = 6;
    x.beginPath(); x.arc(160, 196, 22, .22 * Math.PI, .78 * Math.PI); x.stroke();
    return c;
  }

  function initPortrait() {
    const cv = $('#portrait');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const screen = cv.parentElement;
    const grid = $('.portrait__grid', screen);
    const resLabel = $('#portraitRes');
    const stateLabel = $('#portraitState');
    const LEVELS = [10, 16, 24, 36, 54, 80, 120, 170];
    let level = 0, source = null, inView = false, done = false;

    function draw() {
      if (!source) return;
      const cols = LEVELS[level];
      const rows = Math.round(cols * 5 / 4);
      cv.width = cols; cv.height = rows;
      const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
      const s = Math.max(cols / sw, rows / sh);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(source, (cols - sw * s) / 2, (rows - sh * s) / 2, sw * s, sh * s);
      grid.style.setProperty('--cell', (screen.clientWidth / cols) + 'px');
      grid.style.setProperty('--grid-op', cols > 60 ? 0 : 1);
      if (resLabel) resLabel.textContent = `${cols}×${rows}`;
    }

    // one-time "enhance": runs once the About section scrolls into view, then stays sharp
    function enhance() {
      if (done || !source || !inView) return;
      done = true;
      if (stateLabel) stateLabel.textContent = 'Enhancing...';
      const finish = () => { if (stateLabel) stateLabel.textContent = 'Image clear'; };
      if (reduceMotion) { level = LEVELS.length - 1; draw(); finish(); return; }
      setTimeout(() => {
        const timer = setInterval(() => {
          level++;
          draw();
          if (level >= LEVELS.length - 1) { clearInterval(timer); finish(); }
        }, 160);
      }, 500);
    }

    const img = new Image();
    img.onload = () => { source = img; draw(); enhance(); };
    img.onerror = () => { source = makeAvatar(); draw(); enhance(); };
    img.src = CONFIG.portrait;

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      inView = true;
      enhance();
    }, { threshold: .5 });
    io.observe(cv.closest('.portrait'));
    addEventListener('resize', draw);
  }

  /* ======================================================================
     ABOUT — fun facts in a pixel view-master: pull the lever, the reel turns
     ====================================================================== */
  const FACTS = [
    // img: a real photo for the slide (pos = object-position, zoom = crop-in); without one, the sprite gets a pixel scene
    { img: 'assets/img/facts/thilo.jpg', pos: '45% 55%', sprite: 'cat', title: 'I live with two cats', text: 'Thilo, a Scottish Fold, and Kleo, a British Shorthair.' },
    { img: 'assets/img/facts/journal.jpg', pos: '50% 50%', sprite: 'pen', title: 'I make things by hand', text: 'I studied painting and majored in art in high school. I love working with acrylics and oils, mixed media and interactive books.' },
    { img: 'assets/img/facts/wild-at-heart.jpg', pos: '30% 30%', sprite: 'clapper', title: 'Certified movie freak', text: 'Too many favourites to count, but David Lynch’s Wild at Heart is always near the top.' },
    { img: 'assets/img/facts/short-film.jpg', pos: '55% 40%', sprite: 'clapper', title: 'I wrote and directed a short film', text: 'It was my graduation film for my bachelor’s degree in film.' },
    { img: 'assets/img/facts/award.jpg', pos: '50% 40%', sprite: 'clapper', title: 'I won Best Art Direction', text: 'For the set design of the film Paradise Express, at the Cinema South Film Festival, 2022.' },
    { img: 'assets/img/facts/lambert.jpg', pos: '50% 35%', sprite: 'clapper', title: 'I worked with a Hollywood stunt legend', text: 'Steven Lambert, martial artist and stunt double, on a film set in Israel. It turned out to be the last production of his life.' },
    { img: 'assets/img/facts/home.jpg', pos: '50% 60%', sprite: 'laptop', title: 'Home styling is my happy place', text: 'I love interior design and styling spaces. I’m all about atmosphere and that feeling of home.' }
  ];
  const FACT_SPRITES = {
    clapper: ['..bwwbbwwbbw.', '.bwwbbwwbbw..', 'b............', 'bwwbbwwbbwwbb', 'bbbbbbbbbbbbb',
      'bbbbbbbbbbbbb', 'bwwwwwbbwwwwb', 'bbbbbbbbbbbbb', 'bwwwbbbbbPPPb', 'bbbbbbbbbbbbb'],
    gamepad: ['.wwwwwwwwwww.', 'wwwKwwwwwwPww', 'wwKKKwKwKPwPw', 'wwwKwwwwwwPww', 'WWWWWWWWWWWWW',
      'WWWW.....WWWW', '.WW.......WW.']
  };

  function initFacts() {
    const vm = $('#viewer');
    if (!vm) return;
    const disc = $('#vmDisc'), visor = $('#vmVisor'), lever = $('#vmLever'), hint = $('#vmHint');
    const lenses = $$('.vm__lens img', visor);
    const file = $('#factFile'), num = $('#factNum'), title = $('#factTitle'), text = $('#factText'), pager = $('#factPager');
    const N = FACTS.length, LW = 36, LH = 27, HORIZON = 20;
    const sprites = FACTS.map(f => itemSprite(FACT_SPRITES[f.sprite] || ITEMS.find(it => it.id === f.sprite).rows));
    const BAYER = [0, 2, 3, 1];
    const SKY = ['#12060F', '#240B24', '#3B1440'];
    const STARS = [[4, 3], [29, 4], [21, 2], [9, 10], [33, 13], [15, 6]];

    // a pixel slide (until there's a photo): a dithered dusk, a tiled floor, the object standing on it
    function paint(ctx, i) {
      for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) {
        if (y < HORIZON) {
          const lvl = Math.min(2, Math.floor((y / HORIZON) * 2.6 + BAYER[(y % 2) * 2 + x % 2] / 4));
          ctx.fillStyle = SKY[lvl];
        } else ctx.fillStyle = ((x >> 2) + ((y - HORIZON) >> 2)) % 2 ? '#1E0A1D' : '#2A0F28';
        ctx.fillRect(x, y, 1, 1);
      }
      ctx.fillStyle = 'rgba(255,123,248,.45)';
      ctx.fillRect(0, HORIZON, LW, 1);
      ctx.fillStyle = '#FFC4FC';
      STARS.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
      const img = sprites[i], w = img.width * 2, h = img.height * 2;
      const x = Math.round((LW - w) / 2), y = HORIZON + 2 - h;
      ctx.fillStyle = 'rgba(0,0,0,.4)';
      ctx.fillRect(x + 3, HORIZON + 1, w - 6, 2);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, x, y, w, h);
      [.5, .25].forEach((a, r) => {                                     // soft lens vignette, two pixel rings
        ctx.fillStyle = `rgba(11,4,8,${a})`;
        ctx.fillRect(r, r, LW - r * 2, 1); ctx.fillRect(r, LH - 1 - r, LW - r * 2, 1);
        ctx.fillRect(r, r + 1, 1, LH - 2 - r * 2); ctx.fillRect(LW - 1 - r, r + 1, 1, LH - 2 - r * 2);
      });
    }

    // every slide as an image: the real photo, or its pixel scene rendered once
    const slides = FACTS.map((f, i) => {
      if (f.img) return { src: f.img, pixel: false };
      const c = document.createElement('canvas');
      c.width = LW; c.height = LH;
      paint(c.getContext('2d'), i);
      return { src: c.toDataURL(), pixel: true };
    });
    // the right lens shows the same slide a touch shifted, so the pair reads as stereo
    const stereo = (pos = '50% 50%') => pos.replace(/^([\d.]+)%/, (m, x) => `${Math.max(0, x - 3)}%`);
    function show(img, i) {
      img.src = slides[i].src;
      img.classList.toggle('is-pixel', slides[i].pixel);
      img.style.setProperty('--pos', FACTS[i].pos || '50% 50%');
      img.style.setProperty('--pos-r', stereo(FACTS[i].pos));
      img.style.setProperty('--zoom', FACTS[i].zoom || 1);
    }

    // the reel: two windows per fact, opposite each other, numbered like a real reel. The current
    // fact's window sits inside the viewer, its twin peeks out at the top
    const STEP = 180 / N;
    for (let k = 0; k < N * 2; k++) {
      const i = k % N, a = 180 + k * STEP;
      const slot = document.createElement('img');
      slot.className = 'vm__slot';
      slot.alt = '';
      show(slot, i);
      const num = document.createElement('span');
      num.className = 'vm__num';
      num.textContent = i + 1;
      const notch = document.createElement('span');
      notch.className = 'vm__notch';
      [slot, num].forEach(el => el.style.setProperty('--a', `${a}deg`));
      notch.style.setProperty('--a', `${a + STEP / 2}deg`);
      disc.append(slot, num, notch);
    }

    pager.innerHTML = `
      <button class="pager__btn pager__arrow" type="button" data-step="-1" aria-label="Previous fact"><span class="px-ico" data-px="arrowL"></span></button>
      <span class="facts__pips">${FACTS.map((f, i) => `<button class="facts__pip" type="button" data-i="${i}" aria-label="Fact ${i + 1}"></button>`).join('')}</span>
      <button class="pager__btn pager__arrow" type="button" data-step="1" aria-label="Next fact"><span class="px-ico" data-px="arrow"></span></button>`;
    renderIcons(pager);
    $('#factTotal').textContent = pad(N);

    // the eyepiece: press your eyes to the viewer, the current slide fills the screen
    const eye = document.createElement('dialog');
    eye.className = 'eyepiece';
    eye.setAttribute('aria-labelledby', 'eyeFile');
    eye.innerHTML = `
      <div class="window__bar">
        <span id="eyeFile"></span>
        <button class="vmodal__close" type="button" aria-label="Close"><span class="px-ico" data-px="close"></span></button>
      </div>
      <div class="eyepiece__view"><div class="eyepiece__lens"><img alt="" decoding="async"></div></div>
      <div class="eyepiece__foot">
        <button class="pager__btn pager__arrow" type="button" data-step="-1" aria-label="Previous slide"><span class="px-ico" data-px="arrowL"></span></button>
        <p class="eyepiece__cap" aria-live="polite"><b></b><span></span></p>
        <button class="pager__btn pager__arrow" type="button" data-step="1" aria-label="Next slide"><span class="px-ico" data-px="arrow"></span></button>
      </div>`;
    document.body.appendChild(eye);
    renderIcons(eye);
    const eyeLens = $('.eyepiece__lens', eye), eyeImg = $('img', eyeLens);
    function renderEye() {
      show(eyeImg, idx);
      eyeImg.alt = FACTS[idx].title;
      $('#eyeFile').textContent = `slide_${pad(idx + 1)}.view`;
      $('.eyepiece__cap b', eye).textContent = `${pad(idx + 1)}/${pad(N)}`;
      $('.eyepiece__cap span', eye).textContent = FACTS[idx].title;
    }
    function lookIn() {
      renderEye();
      eyeLens.style.animation = 'none';
      void eyeLens.offsetWidth;                                         // replay the "eyes to the lens" zoom
      eyeLens.style.animation = '';
      eye.showModal();
      document.body.style.overflow = 'hidden';
    }
    eye.addEventListener('close', () => { document.body.style.overflow = ''; });
    $('.vmodal__close', eye).addEventListener('click', () => eye.close());
    eye.addEventListener('click', e => {
      if (e.target === eye) { eye.close(); return; }                    // click outside (on the backdrop)
      const b = e.target.closest('[data-step]');
      if (!b) return;
      e.stopPropagation();                                              // only the reel sound, not the generic click
      pull(+b.dataset.step);
    });
    eye.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); pull(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); pull(-1); }
    });
    $$('.vm__lens', visor).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); lookIn(); }));

    let idx = 0, turn = 0, swapT = 0, openT = 0, holdT = 0;
    function render() {
      lenses.forEach(img => show(img, idx));
      if (eye.open) renderEye();
      const f = FACTS[idx];
      file.textContent = `slide_${pad(idx + 1)}.txt`;
      num.textContent = pad(idx + 1);
      title.textContent = f.title;
      text.textContent = f.text;
      $$('.facts__pip', pager).forEach((p, i) => p.setAttribute('aria-current', String(i === idx)));
    }
    function go(step) {
      if (!step) return;
      idx = ((idx + step) % N + N) % N;
      turn += step;
      disc.style.setProperty('--rot', `${-turn * STEP}deg`);
      hint.classList.add('is-gone');
      Sound.reel();
      if (reduceMotion) { render(); return; }
      // shutter: the lenses go dark, the slide swaps, the light comes back
      clearTimeout(swapT); clearTimeout(openT);
      visor.classList.add('is-blink');
      eyeLens.classList.add('is-blink');
      swapT = setTimeout(() => {
        render();
        // the scramble glyphs are wider than letters: hold the title's real height so the card doesn't twitch
        title.style.height = `${title.offsetHeight}px`;
        title.style.overflow = 'hidden';
        delete title.dataset.scrambled;
        scramble(title, 500);
        clearTimeout(holdT);
        holdT = setTimeout(() => { title.style.height = title.style.overflow = ''; }, 560);
      }, 140);
      openT = setTimeout(() => { visor.classList.remove('is-blink'); eyeLens.classList.remove('is-blink'); }, 300);
    }
    function pull(step = 1) {
      lever.classList.remove('is-pull');
      void lever.offsetWidth;                                           // restart the swing
      lever.classList.add('is-pull');
      go(step);
    }

    // the whole viewer is the button; the lever just looks like the reason why
    vm.addEventListener('click', e => { e.stopPropagation(); pull(); });   // (the lenses open the eyepiece instead)
    vm.addEventListener('keydown', e => {
      if (e.target !== vm) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    pager.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      e.stopPropagation();
      if (b.dataset.step) go(+b.dataset.step);
      else {
        let d = +b.dataset.i - idx;                                     // the short way round the reel
        if (d > N / 2) d -= N; else if (d < -N / 2) d += N;
        go(d);
      }
    });
    // one fixed card height: try every fact, keep the tallest, so the window never jumps
    const body = title.closest('.facts__body');
    function fitCard() {
      body.style.minHeight = '';
      let tallest = 0;
      FACTS.forEach(f => {
        title.textContent = f.title;
        text.textContent = f.text;
        tallest = Math.max(tallest, body.offsetHeight);
      });
      body.style.minHeight = `${tallest}px`;
      render();
    }
    fitCard();
    if (document.fonts) document.fonts.ready.then(fitCard);
    let fitT = 0;
    window.addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(fitCard, 150); });
  }

  /* ======================================================================
     PROJECT CARDS + FILTERS
     ====================================================================== */
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const hasPage = p => !!((p.images && p.images.length) || p.hero || p.embed || p.page);
  const pageHref = p => p.page || `project.html?id=${encodeURIComponent(p.id)}`;   // case studies have their own page

  function cardHTML(p, i) {
    if (p.categories.includes('set')) return videoCardHTML(p, i);
    const n = pad(window.PROJECTS.indexOf(p) + 1);
    const tags = p.categories.map(c => window.CATEGORIES[c]).join(' · ');
    const page = hasPage(p);                             // projects with images / an embed open their own page
    const tag = page ? 'a' : 'article';
    const screen = p.cover
      ? `<img class="card__cover" src="${esc(p.cover)}" alt="" loading="lazy">`
      : `<div class="card__empty"><span class="px-ico" data-px="cartridge"></span><span>Insert project ${n}</span></div>`;
    return `
      <${tag} class="card reveal" style="--d:${(i % 4) * .09}s" data-id="${p.id}"${page ? ` href="${esc(pageHref(p))}"` : ''}>
        <div class="card__bar"><span>PROJECT_${n}.FIG</span></div>
        <div class="card__screen">
          ${screen}
          <div class="card__noise"></div>
        </div>
        <div class="card__foot">
          <div><h3 class="card__title">${esc(p.title)}</h3><p class="card__tags">${tags}</p></div>
          <span class="card__go" aria-hidden="true"><span class="px-ico" data-px="arrow"></span></span>
        </div>
      </${tag}>`;
  }

  // set design: a cover that plays its video in a popup instead of opening a project page
  function videoCardHTML(p, i) {
    const n = pad(window.PROJECTS.filter(x => x.categories.includes('set')).indexOf(p) + 1);
    const cover = p.cover || youtubeThumb(p.video);
    const screen = cover
      ? `<img class="card__cover" src="${esc(cover)}" alt="" loading="lazy">`
      : `<div class="card__empty"><span class="px-ico" data-px="cartridge"></span><span>Insert cover ${n}</span></div>`;
    return `
      <article class="card card--video reveal" style="--d:${(i % 4) * .09}s" data-id="${p.id}"
        role="button" tabindex="0" aria-haspopup="dialog" aria-label="Play video: ${esc(p.title)}">
        <div class="card__bar"><span>SET_${n}.MP4</span></div>
        <div class="card__screen">
          ${screen}
          <div class="card__noise"></div>
        </div>
        <div class="card__foot">
          <div><h3 class="card__title">${esc(p.title)}</h3><p class="card__tags">Set Design · Art Direction</p></div>
          <span class="card__go" aria-hidden="true"><span class="px-ico" data-px="play"></span></span>
        </div>
      </article>`;
  }

  /* ---------- video popup ---------- */
  const youtubeId = url => (String(url || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/) || [])[1];
  const youtubeThumb = url => { const id = youtubeId(url); return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : ''; };

  function videoEmbed(url) {
    const yt = youtubeId(url);
    const vm = (url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];
    const ccv = /\/\/www-ccv\.adobe\.io\/v1\/player\/ccv\//.test(url);      // Behance / Adobe video player
    if (ccv) return `<iframe src="${esc(url)}" title="Video player" allow="autoplay; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    // YouTube/Vimeo refuse to embed without a page origin (error 153), which a file opened from disk doesn't have
    if ((yt || vm) && location.protocol === 'file:') {
      return `<p class="vmodal__empty">&gt; offline preview_<br><span>embedded videos play once the site is online (or on a local server)</span><br>
        <a class="btn btn--ghost vmodal__ext" href="${esc(url)}" target="_blank" rel="noopener"><span class="btn__face">Watch on ${yt ? 'YouTube' : 'Vimeo'}<span class="px-ico" data-px="ext"></span></span></a></p>`;
    }
    const frame = src => `<iframe src="${src}" title="Video player" allow="autoplay; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    if (yt) return frame(`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&origin=${encodeURIComponent(location.origin)}`);
    if (vm) return frame(`https://player.vimeo.com/video/${vm}?autoplay=1`);
    return `<video src="${esc(url)}" controls autoplay playsinline></video>`;
  }

  function initVideoModal() {
    if (!window.PROJECTS || !window.PROJECTS.some(p => p.categories.includes('set'))) return;
    const dlg = document.createElement('dialog');
    dlg.className = 'vmodal';
    dlg.setAttribute('aria-labelledby', 'vmodalTitle');
    dlg.innerHTML = `
      <div class="window vmodal__win">
        <div class="window__bar">
          <span id="vmodalTitle"></span>
          <button class="vmodal__close" type="button" aria-label="Close video"><span class="px-ico" data-px="close"></span></button>
        </div>
        <div class="vmodal__screen"></div>
      </div>`;
    document.body.appendChild(dlg);
    renderIcons(dlg);
    const screen = $('.vmodal__screen', dlg), title = $('#vmodalTitle', dlg);

    function open(p) {
      title.textContent = p.title;
      screen.innerHTML = p.video
        ? videoEmbed(p.video)
        : '<p class="vmodal__empty">&gt; no signal_<br><span>video coming soon</span></p>';
      renderIcons(screen);
      dlg.showModal();
      document.body.style.overflow = 'hidden';
    }
    function close() { if (dlg.open) dlg.close(); }

    dlg.addEventListener('close', () => { screen.innerHTML = ''; document.body.style.overflow = ''; });   // stops playback
    $('.vmodal__close', dlg).addEventListener('click', close);
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });                              // click outside

    // a video card, or any link with data-play="<set id>" (e.g. the CV's highlighted project) opens the popup in place
    const fromCard = e => {
      const card = e.target.closest('.card--video, [data-play]');
      return card && window.PROJECTS.find(p => p.id === (card.dataset.play || card.dataset.id));
    };
    document.addEventListener('click', e => { const p = fromCard(e); if (p) { e.preventDefault(); open(p); } });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const p = fromCard(e);
      if (p) { e.preventDefault(); open(p); }
    });
  }

  function renderFeatured() {
    const grid = $('#featuredGrid');
    if (!grid || !window.PROJECTS) return;
    grid.innerHTML = window.PROJECTS.filter(p => p.featured && !p.categories.includes('set')).slice(0, 4).map(cardHTML).join('');
    renderIcons(grid);
  }

  function initFilters() {
    const grid = $('#projectsGrid'), bar = $('#filters'), counter = $('#resultCount');
    if (!grid || !window.PROJECTS) return;
    const { CATEGORIES } = window;

    // set design reels show in "All" too, but always at the very end (after every project, on the last pages)
    const isSet = p => p.categories.includes('set');
    // no empty placeholder cards here (a tab with none of its own disappears); the home page keeps its own list
    const PROJECTS = window.PROJECTS.filter(p => isSet(p) || p.cover || hasPage(p));
    const ALL = [...PROJECTS.filter(p => !isSet(p)), ...PROJECTS.filter(isSet)];
    const counts = { all: ALL.length };
    PROJECTS.forEach(p => p.categories.forEach(c => { counts[c] = (counts[c] || 0) + 1; }));
    const ALWAYS = ['dashboard'];                       // tabs Shiran wants shown even before they have projects
    const keys = ['all', ...Object.keys(CATEGORIES).filter(k => counts[k] || ALWAYS.includes(k))];

    bar.innerHTML = keys.map(k => `
      <button class="chip" type="button" data-filter="${k}" aria-pressed="false">
        ${k === 'all' ? 'All' : CATEGORIES[k]}
      </button>`).join('');

    const PER_PAGE = 9;                                  // 3 full rows of 3
    const pager = $('#pager');
    const params = new URLSearchParams(location.search);
    let current = params.get('filter');
    if (!keys.includes(current)) current = 'all';
    let page = Math.max(1, parseInt(params.get('page'), 10) || 1);

    function pagerHTML(pages) {
      const num = n => `<button class="pager__btn${n === page ? ' is-current' : ''}" type="button" data-page="${n}"
        aria-label="Page ${n}"${n === page ? ' aria-current="page"' : ''}>${pad(n)}</button>`;
      return `
        <button class="pager__btn pager__arrow" type="button" data-page="${page - 1}" aria-label="Previous page"${page === 1 ? ' disabled' : ''}><span class="px-ico" data-px="arrowL"></span></button>
        ${Array.from({ length: pages }, (_, i) => num(i + 1)).join('')}
        <button class="pager__btn pager__arrow" type="button" data-page="${page + 1}" aria-label="Next page"${page === pages ? ' disabled' : ''}><span class="px-ico" data-px="arrow"></span></button>`;
    }

    function render() {
      const list = current === 'all' ? ALL : PROJECTS.filter(p => p.categories.includes(current));
      const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      page = Math.min(page, pages);
      const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      grid.innerHTML = list.length
        ? shown.map(cardHTML).join('')
        : '<p class="empty-state">&gt; no files found_</p>';
      renderIcons(grid);
      requestAnimationFrame(() => $$('.card', grid).forEach(c => c.classList.add('is-in')));

      if (pager) {
        pager.hidden = pages < 2;                         // only when the tab has more than one page
        pager.innerHTML = pages < 2 ? '' : pagerHTML(pages);
        renderIcons(pager);
      }

      const label = current === 'all' ? 'all' : CATEGORIES[current].toLowerCase();
      const where = pages > 1 ? ` · page <b>${pad(page)}</b>/${pad(pages)}` : '';
      counter.innerHTML = `&gt; <b>${pad(list.length)}</b> file${list.length === 1 ? '' : 's'} found in /${label}${where}`;
      $$('.chip', bar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === current)));
      const q = new URLSearchParams();
      if (current !== 'all') q.set('filter', current);
      if (page > 1) q.set('page', page);
      try { history.replaceState(null, '', q.toString() ? `?${q}` : location.pathname); } catch (e) { /* file:// */ }
    }

    function swap(scroll) {
      const go = () => {
        render();
        grid.classList.remove('is-switching');
        if (scroll) $('.filters-bar').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      };
      if (reduceMotion) { go(); return; }
      grid.classList.add('is-switching');
      setTimeout(go, 200);
    }

    bar.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b || b.dataset.filter === current) return;
      current = b.dataset.filter;
      page = 1;                                          // each tab starts on its first page
      swap(false);
    });

    pager?.addEventListener('click', e => {
      const b = e.target.closest('.pager__btn');
      if (!b || b.disabled || +b.dataset.page === page) return;
      page = +b.dataset.page;
      swap(true);
    });

    render();
  }

  /* ======================================================================
     CONTACT
     ====================================================================== */
  function initContact() {
    $$('[data-email]').forEach(el => {
      el.textContent = CONFIG.email;
      if (el.tagName === 'A') el.href = `mailto:${CONFIG.email}`;
    });

    const copyBtn = $('#copyEmail');
    copyBtn?.addEventListener('click', async () => {
      const label = $('.copy-btn__txt', copyBtn);
      try {
        await navigator.clipboard.writeText(CONFIG.email);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = CONFIG.email;
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      copyBtn.classList.add('is-done');
      label.textContent = 'Copied!';
      setTimeout(() => { copyBtn.classList.remove('is-done'); label.textContent = 'Copy'; }, 1800);
    });

    const form = $('#contactForm');
    form?.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const status = $('#formStatus');
      const mailto = () => {
        const subject = `Hello from ${d.get('name')}`;
        const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
        location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      };
      if (!/^https:\/\//.test(CONFIG.formEndpoint)) {      // no endpoint yet: the visitor's own mail app
        status.textContent = '> opening your mail app...';
        mailto();
        return;
      }
      d.append('_subject', `Portfolio message from ${d.get('name')}`);
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      status.textContent = '> sending...';
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: 'POST', body: d, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = '> message sent_ talk soon!';
      } catch (err) {                                     // offline / blocked: fall back to mail
        status.textContent = "> couldn't send. opening your mail app...";
        mailto();
      }
      btn.disabled = false;
    });

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ======================================================================
     PROJECT PAGE — project.html?id=...: title, subtitle, then the images in order
     ====================================================================== */
  function initProject() {
    const root = $('#project');
    if (!root || !window.PROJECTS) return;
    const id = new URLSearchParams(location.search).get('id');
    const p = window.PROJECTS.find(x => x.id === id && hasPage(x));

    if (!p) {
      root.innerHTML = `<p class="empty-state">&gt; file not found_</p>`;
      return;
    }
    if (p.page) { location.replace(p.page); return; }    // a case study lives on its own page

    document.title = `${p.title} — Shiran Revivo`;
    const cat = window.CATEGORIES[p.categories[0]] || 'Work';
    $('#projectEyebrow').lastChild.textContent = `02 / ${cat}`;
    // page heading = the product name + 'type · type' sub-title (like the case studies); the card keeps the long title
    $('#projectTitle').innerHTML = `<span data-scramble>${esc(p.heading || p.title)}</span>`;
    $('#projectSub').textContent = p.sub || p.subtitle || '';

    // related page (e.g. the case study this project is part of) — a quiet text link under the subtitle
    const rel = $('#projectRelated');
    if (rel && p.related && p.related.href) {
      rel.href = p.related.href;
      rel.innerHTML = `${esc(p.related.label || 'See more')}<span class="px-ico" data-px="arrow"></span>`;
      rel.hidden = false;
      renderIcons(rel);
    }

    // live site — a button under the subtitle, opens in a new tab
    const live = $('#projectLink');
    if (live && p.link && /^https:\/\//.test(p.link.href || p.link)) {
      live.innerHTML = `<a class="btn" href="${esc(p.link.href || p.link)}" target="_blank" rel="noopener"><span class="btn__face">${esc(p.link.label || 'Visit live site')}<span class="px-ico" data-px="ext"></span></span></a>`;
      live.hidden = false;
      renderIcons(live);
    }

    // hero, like a case study: details on the left, a transparent mockup on the right (optional)
    const heroBox = $('#projectHero');
    if (heroBox && p.hero && (p.hero.src || p.hero.meta)) {    // no src = details only, on the full width
      const h = p.hero;
      heroBox.className = `cs-hero ${h.src ? 'cs-hero--wide' : 'cs-hero--info'} project-hero`;
      heroBox.innerHTML = `
        <div class="cs-hero__info reveal" style="--d:.2s">
          <dl class="cs-meta">${(h.meta || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        </div>${h.src ? `
        <figure class="cs-media cs-hero__shot reveal" style="--d:.28s">
          <img src="${esc(h.src)}" alt="${esc(h.alt || p.title)}"${h.w ? ` width="${h.w}" height="${h.h}"` : ''} fetchpriority="high">
        </figure>` : ''}`;
      heroBox.hidden = false;
    }

    // embeds (flipbook, prototype…) — one or a list; only the URL is used, the frame is ours, sandboxed.
    // Several embeds (one prototype per device) share one window with a tab each (.cs-proto, initProtoTabs).
    const list = [].concat(p.embed || []).filter(e => /^https:\/\//.test(e.src));
    const frame = (e, attrs = '') => `
        <div class="project__frame${e.screen ? ' project__frame--screen' : ''}${e.mobileRatio ? ' project__frame--m' : ''}" style="--ratio:${esc(e.ratio || '16 / 9')}${e.mobileRatio ? `;--ratio-m:${esc(e.mobileRatio)}` : ''}"${attrs}>
          <iframe ${attrs && !attrs.includes('data-first') ? 'data-src' : 'src'}="${esc(e.src)}" title="${esc(p.title)}${e.tab ? ` — ${esc(e.tab)}` : ''}" loading="lazy" allowfullscreen
            sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
        </div>`;
    const bar = label => `<div class="window__bar"><span>${esc(label)}</span><span class="window__btns" aria-hidden="true"><i></i><i></i><i></i></span></div>`;
    const embeds = list.length > 1
      ? `
      <figure class="window project__embed cs-proto reveal">
        ${bar('prototype.fig')}
        <div class="cs-proto__tabs" role="tablist" aria-label="Prototype">
          ${list.map((e, k) => `<button class="chip" type="button" role="tab" id="pt-${k}" aria-controls="pp-${k}" aria-selected="${!k}"${k ? ' tabindex="-1"' : ''}>${esc(e.tab || `Prototype ${k + 1}`)}</button>`).join('')}
        </div>
        ${list.map((e, k) => frame(e, ` role="tabpanel" id="pp-${k}" aria-labelledby="pt-${k}"${k ? ' hidden' : ' data-first'}`)).join('')}
      </figure>`
      : list.map(e => `
      <figure class="window project__embed reveal">
        ${bar(e.label || 'embed.exe')}${frame(e)}
      </figure>`).join('');

    // images first, then the embeds
    root.classList.toggle('project__gallery--seamless', !!p.seamless);   // one board: the slices don't animate in one by one
    root.innerHTML = (p.images || []).map((im, i) => `
      <figure class="project__shot${im.bare ? ' project__shot--bare' : ''}${p.seamless ? '' : ' reveal'}">
        <img src="${esc(im.src)}" alt="${esc(im.alt || p.title)}"${im.w ? ` width="${im.w}" height="${im.h}"` : ''}
          ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">
      </figure>`).join('') + embeds;
  }

  /* ======================================================================
     MARQUEE — repeat the keywords until one copy covers the screen, then loop two copies
     ====================================================================== */
  /* case study: one prototype window, a tab per device (iframes load on first open) */
  function initProtoTabs() {
    document.querySelectorAll('.cs-proto').forEach(win => {
      const tabs = [...win.querySelectorAll('[role="tab"]')];
      const panels = [...win.querySelectorAll('[role="tabpanel"]')];
      const show = i => {
        tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
        panels.forEach((p, k) => {
          p.hidden = k !== i;
          const f = p.querySelector('iframe[data-src]');
          if (k === i && f) { f.src = f.dataset.src; f.removeAttribute('data-src'); }
        });
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => show(i));
        t.addEventListener('keydown', e => {
          const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          const n = (i + d + tabs.length) % tabs.length;
          show(n); tabs[n].focus();
        });
      });
    });
  }

  /* mobile carousel (.cs-carousel, Double Shesh wireframes): up to 900px the shots become one swipe
     strip with pixel dots under it. The strip takes the height of the shot in view, so a short
     wireframe doesn't leave the gap of the tallest one. Desktop keeps the grid */
  function initCarousel() {
    const mq = matchMedia('(max-width: 900px)');
    $$('.cs-carousel').forEach(strip => {
      const slides = $$('figure', strip);
      if (slides.length < 2) return;
      const dots = document.createElement('div');
      dots.className = 'cs-dots';
      dots.setAttribute('aria-label', strip.dataset.label || 'Slides');
      slides.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `${s.querySelector('figcaption')?.textContent || 'Slide'} (${i + 1} of ${slides.length})`);
        b.addEventListener('click', () => strip.scrollTo({ left: s.offsetLeft - strip.offsetLeft - (strip.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' }));
        dots.append(b);
      });
      strip.after(dots);
      let cur = -1;
      const update = () => {
        if (!mq.matches) { strip.style.height = ''; return; }
        const mid = strip.scrollLeft + strip.clientWidth / 2 + strip.offsetLeft;
        let i = 0, best = Infinity;
        slides.forEach((s, k) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid); if (d < best) { best = d; i = k; } });
        strip.style.height = slides[i].offsetHeight + 'px';
        if (i === cur) return;
        cur = i;
        [...dots.children].forEach((b, k) => b.toggleAttribute('aria-current', k === i));
      };
      strip.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
      addEventListener('resize', () => { cur = -1; update(); });
      mq.addEventListener('change', () => { cur = -1; update(); });
      slides.forEach(s => s.querySelector('img')?.addEventListener('load', update));
      update();
    });
  }

  /* case study IA: every line leaves a box from the middle of its side. Each box's half-width is
     handed to what hangs below it (--mid: a rail, a tree, a row) and to its own column (--head) */
  function initIA() {
    const maps = $$('.ia');
    if (!maps.length) return;
    function mids(ia) {
      $$('.ia__flow, .ia__col, .ia__tree > li', ia).forEach(box => {
        let mid = null;
        [...box.children].forEach(el => {
          if (el.classList.contains('ia__node')) {
            mid = el.offsetWidth / 2 - .5 + 'px';        // the 1px line sits on the centre, not beside it
            if (el === box.firstElementChild) {
              box.style.setProperty('--head', mid);
              box.style.setProperty('--head-h', el.offsetHeight / 2 - .5 + 'px');
            }
          } else if (mid) el.style.setProperty('--mid', mid);
        });
      });
    }
    function measure() {
      maps.forEach(ia => {
        // the wide map only when it fits; otherwise (and on phones) one stacked tree
        ia.classList.remove('ia--stack');
        mids(ia);
        if (innerWidth <= 720 || ia.scrollWidth > ia.clientWidth + 1) { ia.classList.add('ia--stack'); mids(ia); }
      });
    }
    measure();
    document.fonts?.ready.then(measure);                 // widths change once the fonts load
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(measure, 150); });
  }

  function initMarquee() {
    const track = $('.marquee__track');
    if (!track) return;
    const source = $('.marquee__group', track);
    const items = [...source.children].map(el => el.cloneNode(true));
    const SPEED = 55;                                    // px per second, the same at any width

    function build() {
      $$('.marquee__group', track).slice(1).forEach(g => g.remove());
      source.replaceChildren(...items.map(el => el.cloneNode(true)));
      const need = Math.max(innerWidth, screen.width || 0) + 200;
      while (source.scrollWidth < need) items.forEach(el => source.appendChild(el.cloneNode(true)));
      const copy = source.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
      track.style.animationDuration = (source.scrollWidth / SPEED).toFixed(1) + 's';
    }

    build();
    document.fonts?.ready.then(build);                 // pixel font widens the words once it loads
    let w = innerWidth, t;
    addEventListener('resize', () => {
      if (innerWidth <= w) return;                       // a copy that already fits a wider screen still fits
      w = innerWidth;
      clearTimeout(t); t = setTimeout(build, 200);
    });
  }

  /* ======================================================================
     NEXT PROJECT — a quiet text link at the end of every project page
     ====================================================================== */
  function initNextProject() {
    if (!window.PROJECTS) return;
    const list = window.PROJECTS.filter(p => hasPage(p) && !p.categories.includes('set'));
    const file = location.pathname.split('/').pop() || 'index.html';
    const id = new URLSearchParams(location.search).get('id');
    const i = list.findIndex(p => p.page ? p.page.split('?')[0] === file : (file === 'project.html' && p.id === id));
    if (i < 0 || list.length < 2) return;
    const next = list[(i + 1) % list.length];
    const link = document.createElement('a');
    link.className = 'cs-next reveal';
    link.href = pageHref(next);
    const words = next.title.split(' '), last = words.pop();   // the arrow never wraps onto a line of its own
    link.innerHTML = `<span class="cs-next__label">Next project</span>` +
      `<span class="cs-next__title">${esc(words.join(' '))} <span class="cs-next__last">${esc(last)}<span class="px-ico" data-px="arrow"></span></span></span>`;
    const end = $('.cs-end .container');
    if (end) end.appendChild(link);                       // under "Thank you for watching"
    else $('#project')?.after(link);                      // project.html: under the gallery
    renderIcons(link);
  }

  /* ======================================================================
     HUD LEVELS — on a project page the corner HUD follows the section you're reading
     ====================================================================== */
  function initLevels() {
    const out = $('.hud span');
    const secs = $$('main .cs-sec[id]');
    if (!out || out.id === 'hudLevel' || secs.length < 2) return;
    const base = out.innerHTML;
    const name = s => s.id.replace(/-/g, ' ');
    let cur = -2, queued = false;
    const update = () => {
      queued = false;
      const line = innerHeight * .45;
      let i = -1;
      secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) i = k; });
      if (i === cur) return;
      cur = i;
      out.innerHTML = i < 0 ? base : `LVL <b>${pad(i + 1)}</b> — ${esc(name(secs[i]))}`;
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ======================================================================
     SKIP LINK — first tab stop on every page, visible only on keyboard focus
     ====================================================================== */
  function initSkipLink() {
    const main = $('main');
    if (!main) return;
    if (!main.id) main.id = 'main';
    main.tabIndex = -1;
    const a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#' + main.id;
    a.textContent = 'Skip to content';
    a.addEventListener('click', e => { e.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView(); });
    document.body.prepend(a);
  }

  /* ======================================================================
     BACK TO TOP — a small floating icon button, on every page, once you're a screen down
     ====================================================================== */
  function initToTop() {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon-btn to-top';
    b.setAttribute('aria-label', 'Back to top');
    b.innerHTML = '<span class="px-ico" data-px="up"></span>';
    document.body.appendChild(b);
    renderIcons(b);
    b.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
    const sync = () => b.classList.toggle('is-on', scrollY > innerHeight);
    addEventListener('scroll', sync, { passive: true });
    sync();
  }

  /* ======================================================================
     TROPHY — whoever collected all five things in the hero keeps a small trophy in the footer
     ====================================================================== */
  function initTrophy() {
    let got = false;
    try { got = localStorage.getItem('px-toolkit') === '1'; } catch (e) { /* storage unavailable */ }
    const made = $('.footer__made');
    if (!got || !made || $('.footer__trophy')) return;
    const t = document.createElement('span');
    t.className = 'footer__trophy';
    t.title = 'Achievement unlocked: you found my whole toolkit';
    t.innerHTML = `<span class="px-ico" data-px="trophy"></span>5/5<span class="sr-only"> things collected</span>`;
    made.appendChild(t);
    renderIcons(t);
  }

  /* ======================================================================
     CHEAT CODE — ↑ ↑ ↓ ↓ ← → ← → B A: confetti, the fanfare and a line in the HUD
     ====================================================================== */
  function initKonami() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let at = 0, busy = false;
    addEventListener('keydown', e => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      at = k === code[at] ? at + 1 : (k === code[0] ? 1 : 0);
      if (at < code.length) return;
      at = 0;
      if (busy) return;
      busy = true;
      Sound.fanfare();
      const out = $('.hud span');
      const was = out && out.innerHTML;
      if (out) out.innerHTML = 'Cheat code <b>accepted</b> — +30 lives';
      const box = document.createElement('div');
      box.className = 'confetti';
      box.setAttribute('aria-hidden', 'true');
      if (!reduceMotion) {
        const cols = ['var(--pink)', 'var(--pink-soft)', '#FFE15C'];
        for (let i = 0; i < 70; i++) {
          const b = document.createElement('i');
          b.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % 3]};--s:${3 + Math.round(Math.random() * 2) * 3}px;` +
            `--t:${(1.4 + Math.random() * 1.4).toFixed(2)}s;--w:${(Math.random() * .7).toFixed(2)}s;--x:${Math.round(Math.random() * 120 - 60)}px`;
          box.appendChild(b);
        }
        document.body.appendChild(box);
      }
      setTimeout(() => {
        box.remove();
        if (out && out.innerHTML.startsWith('Cheat code')) out.innerHTML = was;
        busy = false;
      }, 3600);
    });
  }

  /* ======================================================================
     UNDER THE HOOD — a hello for whoever opens the console
     ====================================================================== */
  function consoleHello() {
    try {
      const pink = 'color:#FF7BF8;font-family:monospace;';
      console.log('%c  ███  \n █     \n  ███     s.design\n     █ \n  ███  ', pink + 'font-size:14px;line-height:1.1;');
      console.log(`%c> looking under the hood? let's talk_\n%c${CONFIG.email}`, pink + 'font-size:13px;', 'color:#F7C4EE;font-family:monospace;font-size:13px;');
    } catch (e) { /* no console */ }
  }

  /* ======================================================================
     PREFETCH — warm up an in-site page as soon as its link is hovered or focused
     ====================================================================== */
  function initPrefetch() {
    if (!/^https?:$/.test(location.protocol)) return;
    if (navigator.connection && navigator.connection.saveData) return;
    const seen = new Set([location.pathname + location.search]);
    const warm = e => {
      const a = e.target instanceof Element && e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      const key = url.pathname + url.search;
      if (url.origin !== location.origin || seen.has(key)) return;
      seen.add(key);
      const l = document.createElement('link');
      l.rel = 'prefetch'; l.href = url.href;
      document.head.appendChild(l);
    };
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('focusin', warm);
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  renderIcons();
  initMarquee();
  initCursor();
  Sound.init();
  trackPointer();
  initDotField();
  initNav();
  renderFeatured();
  initFilters();
  initProject();
  initContact();
  initVideoModal();
  initPlayer();
  initPortrait();
  initFacts();
  initProtoTabs();
  initCarousel();
  initIA();
  initNextProject();
  initLevels();
  initSkipLink();
  initToTop();
  initTrophy();
  initKonami();
  initPrefetch();
  consoleHello();

  // remember in-site page changes so the loader only plays on a fresh visit or a refresh
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin === location.origin && url.pathname !== location.pathname) {
      try { sessionStorage.setItem('px-internal', '1'); } catch (err) { /* ignore */ }
    }
  });

  const loader = $('#loader');
  if (loader && document.documentElement.classList.contains('skip-loader')) {
    loader.remove();
    document.body.classList.remove('is-loading');
    startReveals();
  } else if (loader) {
    runLoader(() => {
      document.body.classList.remove('is-loading');
      startReveals();
    });
  } else {
    startReveals();
  }
})();
