/* ============================================================
   ⚡ SHBM TERMINAL — all interactive logic
   ============================================================ */

/* ---------- BOOT SEQUENCE ---------- */
const BOOT_LINES = [
  'SHBM-OS v9.07  (build 2026.07.19)',
  '> INITIALIZING TRADING TERMINAL ................ OK',
  '> LOADING MODULE: KAFKA_PIPELINE  [##########]  OK',
  '> LOADING MODULE: GENAI_CORE      [##########]  OK',
  '> LOADING MODULE: FRONTEND_ENGINE [##########]  OK',
  '> AUTHENTICATING USER: RECRUITER ......... VERIFIED',
  '> RUNNING RISK CHECK ..... NONE. CANDIDATE IS A SURE BET.',
  '> MARKET STATUS: OPEN FOR OPPORTUNITIES',
  '',
  '> ACCESS GRANTED. WELCOME TO $SHBM. ▮',
];

const boot = document.getElementById('boot');
const bootLog = document.getElementById('bootLog');
let bootDone = false;

function finishBoot() {
  if (bootDone) return;
  bootDone = true;
  boot.classList.add('done');
  setTimeout(() => boot.remove(), 600);
}

(function typeBoot(line, ch) {
  if (bootDone) return;
  if (line >= BOOT_LINES.length) return setTimeout(finishBoot, 700);
  const text = BOOT_LINES[line];
  if (ch === 0 && line > 0) bootLog.textContent += '\n';
  bootLog.textContent += text.slice(ch, ch + 3);
  if (ch + 3 < text.length) setTimeout(typeBoot, 8, line, ch + 3);
  else setTimeout(typeBoot, text === '' ? 30 : 110, line + 1, 0);
})(0, 0);

window.addEventListener('keydown', finishBoot, { once: true });
boot.addEventListener('click', finishBoot);

/* ---------- CLOCK (IST) ---------- */
const clockEl = document.getElementById('clock');
function tickClock() {
  const now = new Date().toLocaleTimeString('en-IN', {
    hour12: false, timeZone: 'Asia/Kolkata',
  });
  clockEl.textContent = now + ' IST';
}
tickClock();
setInterval(tickClock, 1000);

/* ---------- TICKER TAPE ---------- */
const TICKS = [
  ['C++', '+99.2', 'u'], ['REACT', '+120.6', 'u'], ['KAFKA', '+28.0x', 'u'],
  ['TYPESCRIPT', '+88.1', 'u'], ['NEXTJS', '+64.3', 'u'], ['GO', '+41.7', 'u'],
  ['GENAI', '+240.9', 'u'], ['AWS', '+73.5', 'u'], ['K8S', '+52.2', 'u'],
  ['NODEJS', '+91.4', 'u'], ['POSTGRES', '+67.8', 'u'], ['MONGODB', '+58.3', 'u'],
  ['SLEEP', '-42.0', 'd'], ['CYPRESS', '+50.1', 'u'], ['OTEL', '+37.9', 'u'],
  ['JAVA', '+61.0', 'u'], ['COFFEE', '+9000', 'u'], ['BUGS', '-96.5', 'd'],
];
const track = document.getElementById('tickerTrack');
const tapeHTML = TICKS.map(
  ([sym, chg, dir]) =>
    `<span>${sym} <b class="${dir}">${dir === 'u' ? '▲' : '▼'} ${chg}%</b></span>`
).join('');
track.innerHTML = tapeHTML + tapeHTML; // duplicated for seamless loop

/* ---------- ORDER BOOK ---------- */
const BIDS = [
  ['KAFKA', 9.4], ['NODE.JS', 9.2], ['SQL/POSTGRES', 9.0], ['GO', 8.4],
  ['JAVA', 8.6], ['DOCKER/K8S', 8.8], ['AWS', 8.7], ['GENAI', 9.3],
];
const ASKS = [
  ['REACT', 9.5], ['TYPESCRIPT', 9.3], ['NEXT.JS', 9.0], ['ANGULAR', 8.2],
  ['REDUX', 8.6], ['CYPRESS', 8.8], ['GIT/CI-CD', 9.1], ['TAILWIND', 8.5],
];
function renderBook(rows, el, cls) {
  el.innerHTML = rows
    .map(
      ([name, depth]) =>
        `<div class="book-row ${cls}">
           <div class="bar" style="transform: scaleX(${depth / 10})"></div>
           <span>${name}</span><span class="px">${depth.toFixed(1)} / 10</span>
         </div>`
    )
    .join('');
}
renderBook(BIDS, document.getElementById('bidRows'), 'bid');
renderBook(ASKS, document.getElementById('askRows'), 'ask');

/* ---------- CAREER CANDLESTICK CHART ---------- */
const canvas = document.getElementById('careerChart');
const MILESTONES = [
  { at: 0.02, label: 'IPO: THAPAR \'19' },
  { at: 0.42, label: 'GAMEZOP \'22' },
  { at: 0.58, label: 'GEP \'23' },
  { at: 0.86, label: 'GOLDMAN \'25' },
];

function drawChart() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.parentElement.clientWidth - 24;
  const h = 270;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const padL = 8, padR = 8, padT = 18, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;

  // grid
  ctx.strokeStyle = 'rgba(43,255,136,0.07)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke();
  }

  // deterministic pseudo-random walk, strongly upward
  const N = 46;
  let seed = 907; // GPA easter egg
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const candles = [];
  let price = 12;
  for (let i = 0; i < N; i++) {
    const drift = 1.6 + rand() * 2.2;
    const dip = rand() < 0.24 ? -(rand() * 2.4) : 0;
    const open = price;
    const close = Math.max(6, price + drift + dip);
    const hi = Math.max(open, close) + rand() * 1.6;
    const lo = Math.min(open, close) - rand() * 1.6;
    candles.push({ open, close, hi, lo });
    price = close;
  }
  const maxP = Math.max(...candles.map(c => c.hi)) * 1.06;
  const minP = Math.min(...candles.map(c => c.lo)) * 0.9;
  const y = p => padT + plotH - ((p - minP) / (maxP - minP)) * plotH;
  const cw = plotW / N;

  // area glow under closes
  ctx.beginPath();
  ctx.moveTo(padL, y(candles[0].close));
  candles.forEach((c, i) => ctx.lineTo(padL + cw * i + cw / 2, y(c.close)));
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.lineTo(padL, padT + plotH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
  grad.addColorStop(0, 'rgba(43,255,136,0.18)');
  grad.addColorStop(1, 'rgba(43,255,136,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // candles
  candles.forEach((c, i) => {
    const x = padL + cw * i + cw / 2;
    const up = c.close >= c.open;
    ctx.strokeStyle = up ? '#2bff88' : '#ff4d5e';
    ctx.fillStyle = up ? 'rgba(43,255,136,0.85)' : 'rgba(255,77,94,0.85)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y(c.hi)); ctx.lineTo(x, y(c.lo)); ctx.stroke();
    const bw = Math.max(2, cw * 0.5);
    const top = y(Math.max(c.open, c.close));
    const bh = Math.max(1.5, Math.abs(y(c.open) - y(c.close)));
    ctx.fillRect(x - bw / 2, top, bw, bh);
  });

  // milestones
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  MILESTONES.forEach(m => {
    const i = Math.floor(m.at * (N - 1));
    const x = padL + cw * i + cw / 2;
    const cy = y(candles[i].close);
    ctx.fillStyle = '#ffb300';
    ctx.beginPath(); ctx.arc(x, cy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,179,0,0.35)';
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, h - padB + 4); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffb300';
    ctx.fillText(m.label, Math.min(Math.max(x, 40), w - 45), h - padB + 14);
  });

  // last price tag
  const last = candles[N - 1].close;
  ctx.fillStyle = '#2bff88';
  ctx.textAlign = 'right';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('ATH ▲', w - padR - 2, y(last) - 6);
}
drawChart();
window.addEventListener('resize', drawChart);

/* ---------- COMMAND LINE ---------- */
const cmdInput = document.getElementById('cmd');
const cmdOutput = document.getElementById('cmdOutput');

const PANELS = {
  profile: 'panel-profile', chart: 'panel-chart', experience: 'panel-blotter',
  skills: 'panel-book', projects: 'panel-holdings', news: 'panel-news',
  contact: 'panel-execute',
};

function say(text) {
  cmdOutput.hidden = false;
  cmdOutput.textContent = text;
}
function jump(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const COMMANDS = {
  help: () => say(
    'AVAILABLE COMMANDS:\n' +
    '  about        — who is $SHBM\n' +
    '  experience   — jump to trade blotter\n' +
    '  projects     — jump to holdings\n' +
    '  skills       — jump to order book\n' +
    '  news         — jump to headlines\n' +
    '  contact      — jump to execute order\n' +
    '  hire         — place a buy order (opens email)\n' +
    '  whoami       — identify yourself\n' +
    '  clear        — clear this output\n' +
    '  ...and maybe a few undocumented ones. try your luck.'),
  about: () => {
    jump('panel-profile');
    say('SHUBHAM TRIVEDI — Software Engineer @ Goldman Sachs.\nBuilds trading pipelines by day, GenAI & side projects by night.\nListed 2019. All-time high and still climbing.');
  },
  experience: () => { jump('panel-blotter'); say('TRADE BLOTTER LOADED. All fills profitable.'); },
  exp: () => COMMANDS.experience(),
  projects: () => { jump('panel-holdings'); say('HOLDINGS LOADED. Diversified across web, bots & ML.'); },
  skills: () => { jump('panel-book'); say('ORDER BOOK LOADED. Deep liquidity both sides.'); },
  news: () => { jump('panel-news'); say('NEWS WIRE LOADED.'); },
  contact: () => { jump('panel-execute'); say('MARKET OPEN. Place your order.'); },
  hire: () => {
    say('EXECUTING BUY ORDER... opening mail client.');
    window.location.href = 'mailto:shubham072001@gmail.com?subject=BUY%20ORDER%3A%20SHBM';
  },
  whoami: () => say('recruiter (probably). clearance: FULL. bias: hopefully in my favor.'),
  clear: () => { cmdOutput.hidden = true; cmdOutput.textContent = ''; },
  ls: () => say('about/  experience/  projects/  skills/  news/  contact/  hire*'),
  sudo: (args) => say(args.trim() === 'hire'
    ? 'PERMISSION GRANTED.\nDrafting offer letter... done.\nAwaiting your signature. ✍'
    : 'sudo: only "sudo hire" is authorized on this terminal.'),
  coffee: () => say('☕ brewing... productivity +47%. deploy window: OPEN.'),
  matrix: () => say('wake up, recruiter... the resume has you. follow the green candles. 🐇'),
  gpa: () => say('9.07 / 10 — the chart\'s random seed, by the way.'),
  vim: () => say(':q! — nice try. nobody escapes vim that easily.'),
};

cmdInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = cmdInput.value.trim();
  cmdInput.value = '';
  if (!raw) return;
  const [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
  const fn = COMMANDS[cmd];
  if (fn) fn(rest.join(' '));
  else say(`command not found: ${cmd}\nORDER REJECTED — type 'help' for the rulebook.`);
});

/* ---------- KEYBOARD SHORTCUTS ---------- */
const KEYMAP = {
  0: 'panel-profile', 1: 'panel-chart', 2: 'panel-blotter', 3: 'panel-book',
  4: 'panel-holdings', 5: 'panel-news', 6: 'panel-execute',
};
window.addEventListener('keydown', (e) => {
  if (e.target === cmdInput) return;
  if (e.key === '/') { e.preventDefault(); cmdInput.focus(); return; }
  if (KEYMAP[e.key]) jump(KEYMAP[e.key]);
});
