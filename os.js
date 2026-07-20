/* ============================================================
   🖥️ SHBM-OS v10 — window manager, real-ish shell & apps
   ============================================================ */

/* ---------- BOOT → LOGIN → DESKTOP ---------- */
const splash = document.getElementById('splash');
const login = document.getElementById('login');
const loginForm = document.getElementById('loginForm');

setTimeout(() => {
  splash.classList.add('done');
  setTimeout(() => splash.remove(), 700);
  login.hidden = false;
  setTimeout(() => document.getElementById('loginPass').focus(), 150);
}, 1400);

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login.classList.add('done');
  setTimeout(() => login.remove(), 600);
  playChime([523, 659, 784]);   // startup chime (user gesture unlocks audio)
  openWin('win-about');
  setTimeout(() => toast('✅', 'Signed in as guest', 'Any password works. We don\'t gatekeep here.'), 900);
});

/* ---------- SOUNDS (Web Audio, no files) ---------- */
let soundOn = true, audioCtx = null;
function playChime(freqs, dur = 0.14, gap = 0.09) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.frequency.value = f;
      osc.type = 'sine';
      const t0 = audioCtx.currentTime + i * gap;
      g.gain.setValueAtTime(0.001, t0);
      g.gain.exponentialRampToValueAtTime(0.09, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      osc.connect(g).connect(audioCtx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    });
  } catch (e) { /* audio unavailable — stay silent */ }
}
const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? '🔊' : '🔇';
  if (soundOn) playChime([659]);
});

/* ---------- WINDOW MANAGER ---------- */
const windows = [...document.querySelectorAll('.window')];
const tasksEl = document.getElementById('tasks');
let zTop = 10;

function focusWin(win) {
  windows.forEach(w => w.classList.remove('focus'));
  win.classList.add('focus');
  win.style.zIndex = ++zTop;
  syncTaskbar();
}

function openWin(id) {
  const win = document.getElementById(id);
  if (!win) return;
  // lazy-load iframe apps on first open
  const frame = win.querySelector('.app-frame');
  if (frame && !frame.getAttribute('src')) frame.src = frame.dataset.src;
  win.classList.add('open');
  win.style.display = 'flex';
  focusWin(win);
  if (id === 'win-skills') animateTaskman();
  if (id === 'win-snake') snakeStart();
  if (id === 'win-terminal') setTimeout(() => termIn.focus(), 60);
  trackExplorer(id);
}

function closeWin(win) {
  win.classList.remove('open', 'focus', 'max');
  win.style.display = '';   // clear inline display so CSS can hide it
  if (win.id === 'win-snake') snakePause();
  syncTaskbar();
}

function syncTaskbar() {
  tasksEl.innerHTML = '';
  windows.filter(w => w.classList.contains('open')).forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'task-chip' + (w.classList.contains('focus') ? ' active' : '');
    chip.textContent = w.dataset.title;
    chip.onclick = () => {
      if (w.classList.contains('focus') && w.style.display !== 'none') {
        w.style.display = 'none';           // minimize
        w.classList.remove('focus');
        syncTaskbar();
      } else {
        w.style.display = 'flex';           // restore
        focusWin(w);
      }
    };
    tasksEl.appendChild(chip);
  });
}

document.querySelectorAll('[data-open]').forEach(el =>
  el.addEventListener('click', () => {
    openWin(el.dataset.open);
    startmenu.hidden = true;
  })
);

windows.forEach(win => {
  win.addEventListener('pointerdown', () => focusWin(win));
  win.querySelector('[data-close]').addEventListener('click', () => closeWin(win));
  win.querySelector('[data-min]').addEventListener('click', () => {
    win.style.display = 'none';
    win.classList.remove('focus');
    syncTaskbar();
  });
  win.querySelector('[data-max]').addEventListener('click', () => {
    win.classList.toggle('max');
    focusWin(win);
  });

  const head = win.querySelector('.win-head');
  head.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.lights, .win-action') || win.classList.contains('max')) return;
    e.preventDefault();
    const rect = win.getBoundingClientRect();
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;
    head.setPointerCapture(e.pointerId);

    function move(ev) {
      const x = Math.min(Math.max(ev.clientX - offX, -rect.width * 0.6), innerWidth - 60);
      const y = Math.min(Math.max(ev.clientY - offY, 0), innerHeight - 100);
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    }
    function up() {
      head.removeEventListener('pointermove', move);
      head.removeEventListener('pointerup', up);
    }
    head.addEventListener('pointermove', move);
    head.addEventListener('pointerup', up);
  });
});

/* ---------- TOASTS & ACHIEVEMENTS ---------- */
const toastsEl = document.getElementById('toasts');
function toast(ico, title, msg, ms = 5200) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="t-ico">${ico}</span><div><b>${title}</b><p>${msg}</p></div>`;
  toastsEl.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, ms);
}

const unlocked = new Set();
const TOTAL_ACH = 6;   // 5 findable + 1 secret (konami)
const trophiesEl = document.getElementById('trophies');
function unlock(key, title, msg) {
  if (unlocked.has(key)) return;
  unlocked.add(key);
  trophiesEl.textContent = `🏆 ${unlocked.size}/${TOTAL_ACH}`;
  playChime([880, 1175]);
  toast('🏆', `Achievement: ${title}`, msg);
  if (unlocked.size === TOTAL_ACH) {
    setTimeout(() => {
      toast('👑', 'COMPLETIONIST', 'You found everything — even the secret. Shubham would review your PR any day.');
      confetti();
    }, 1200);
  }
}

const openedSet = new Set();
function trackExplorer(id) {
  openedSet.add(id);
  if (openedSet.size >= 5) unlock('explorer', 'Explorer', 'Opened 5 apps. Curiosity: confirmed.');
}

setTimeout(() => toast('⬆️', 'Update available', 'shubham_v11 ships when you hire him.'), 32000);

/* ---------- TASK MANAGER (SKILLS) ---------- */
const PROCS = [
  ['react.exe', 95], ['typescript.exe', 93], ['kafka.service', 94],
  ['node.exe', 92], ['genai.core', 93], ['nextjs.exe', 90],
  ['sql.daemon', 90], ['java.exe', 86], ['docker+k8s.sys', 88],
  ['aws.cloud', 87], ['golang.exe', 84], ['cypress.test', 88],
  ['cpp_dsa.dll', 96], ['git.vcs', 91], ['angular.exe', 82],
  ['mongodb.db', 85], ['otel.tracer', 86], ['dotnet.clr', 80],
  ['redux.store', 86], ['coffee.sys', 99],
];
const taskman = document.getElementById('taskman');
taskman.innerHTML = PROCS.map(
  ([nm, pc]) =>
    `<div class="tm-row">
       <span class="nm">${nm}</span>
       <span class="tm-bar"><i data-pc="${pc}"></i></span>
       <span class="pc">${pc}%</span>
     </div>`
).join('');

function animateTaskman() {
  taskman.querySelectorAll('.tm-bar i').forEach((bar, i) => {
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = bar.dataset.pc + '%'; }, 60 + i * 45);
  });
}

/* ---------- MAIL ---------- */
document.getElementById('sendMail').addEventListener('click', () => {
  const subject = encodeURIComponent(document.getElementById('mailSubject').value);
  const body = encodeURIComponent(document.getElementById('mailBody').value);
  unlock('hr', 'HR Material', 'Hit SEND. Shubham likes you already.');
  window.location.href = `mailto:shubham072001@gmail.com?subject=${subject}&body=${body}`;
});

/* ============================================================
   💻 CMD.EXE — a shell with a filesystem, history & completion
   ============================================================ */
const termOut = document.getElementById('termOut');
const termIn = document.getElementById('termIn');
const termPrompt = document.getElementById('termPrompt');
document.getElementById('termScreen').addEventListener('click', () => termIn.focus());

/* --- fake filesystem (matches what File Explorer shows) --- */
const FS = {
  '~': {
    'about_me.txt': `SHUBHAM TRIVEDI — Software Engineer @ Goldman Sachs, Hyderabad.
Kafka pipelines @ 5M metrics/day · 28x latency win · GenAI frameworks.
Thapar '23, GPA 9.07. Hackathon winner x2. Status: hireable.`,
    'experience.log': `[2025-06→now]  GOLDMAN SACHS — SWE. 5M metrics/day, 1M reports/day, 200ms→7ms.
[2023-01→25]   GEP WORLDWIDE — SWE. GenAI prompt→UI (−60% build), recsys +40%.
[2022-04→23]   GAMEZOP — intern. Admin portal +63%, portals @ 40M users.
[2019→2023]    THAPAR — BE Computer Engg, GPA 9.07.`,
    'resume.pdf': '[binary — 47.9 KB] use: open resume',
    'contact.eml': 'to: shubham072001@gmail.com · tel: +91 81782 61858 · use: open contact',
    'skills.sys': '[system file] use: top',
    'projects': {
      'pansari': 'https://github.com/Greatgabbar',
      'huihui-bot': 'https://discord.com/oauth2/authorize?client_id=816994233557844039&scope=bot',
      'cert-generator': 'https://github.com/Greatgabbar/Certificate-Generator',
      'dino-game': 'https://github.com/Greatgabbar/Chrome-dinosaur-game',
      'court-ledger': 'https://github.com/Greatgabbar/Legal-Court-Ledger',
      'ts-prediction': 'https://github.com/Greatgabbar/TimeSeriesPrediction',
      'gophercises': 'https://github.com/Greatgabbar/gophercises',
      'web-scraper': 'https://github.com/Greatgabbar/Web-scrapper',
    },
  },
};
let cwd = ['~'];
const cwdDir = () => cwd.slice(1).reduce((d, p) => d[p], FS['~']);
const cwdPath = () => cwd.join('/');

const NEOFETCH = `<span class="t-cyan">   _____ __ ______  __  ___
  / ___// // / __ )/  |/  /
  \\__ \\/ _  / __  / /|_/ /
 ___/ / // / /_/ / /  / /
/____/_//_/_____/_/  /_/</span>
 <span class="t-warn">shubham</span>@<span class="t-warn">shbm-os</span>
 ─────────────────────────
 OS:       SHBM-OS v10 (merged edition)
 Kernel:   caffeine-5.4-stable
 Uptime:   7 years in tech
 Shell:    recruiter-sh
 CPU:      Brain @ 9.07GHz (Thapar edition)
 GPU:      Imagination RTX
 Memory:   40M users served / ∞
 Employer: Goldman Sachs (SWE)
 Packages: react, kafka, genai, k8s +16
 Theme:    Hireable Dark`;

const OPEN_TARGETS = {
  about: 'win-about', resume: 'win-resume', experience: 'win-exp',
  projects: 'win-projects', skills: 'win-skills', contact: 'win-contact',
  snake: 'win-snake', trading: 'win-trading', pc: 'win-aboutpc',
  bin: 'win-recycle',
};

const TERM_CMDS = {
  help: () => `filesystem:  ls · cd <dir> · cd .. · cat <file> · pwd
apps:        open <about|resume|experience|projects|skills|contact|trading|browser|snake>
             top (task manager) · snake · matrix (screensaver)
info:        neofetch · whoami · date · history · echo <text>
career:      hire · sudo hire
misc:        clear · exit · and a few undocumented ones`,
  neofetch: () => NEOFETCH,
  pwd: () => cwdPath(),
  ls: () => {
    const d = cwdDir();
    return Object.keys(d).map(k => typeof d[k] === 'object' ? k + '/' : k).join('   ');
  },
  cd: (arg) => {
    if (!arg || arg === '~') { cwd = ['~']; return null; }
    if (arg === '..') { if (cwd.length > 1) cwd.pop(); return null; }
    const clean = arg.replace(/\/$/, '');
    const d = cwdDir();
    if (typeof d[clean] === 'object') { cwd.push(clean); return null; }
    return `cd: no such directory: ${arg}`;
  },
  cat: (arg) => {
    if (!arg) return 'cat: which file?';
    const d = cwdDir();
    const v = d[arg];
    if (v === undefined) return `cat: ${arg}: no such file`;
    if (typeof v === 'object') return `cat: ${arg}: is a directory`;
    if (v.startsWith('http')) return `${arg} → ${v}\n(use: open ${arg})`;
    return v;
  },
  open: (arg) => {
    if (!arg) return 'open: what? try: open resume';
    const key = arg.replace(/\.\w+$/, '').replace(/\/$/, '');
    if (OPEN_TARGETS[key]) { openWin(OPEN_TARGETS[key]); return `opening ${arg}...`; }
    const d = cwdDir();
    const v = d[key] || (FS['~'].projects || {})[key];
    if (typeof v === 'string' && v.startsWith('http')) { window.open(v, '_blank'); return `launching ${key} ↗`; }
    return `open: nothing called '${arg}' here`;
  },
  top: () => { openWin('win-skills'); return 'launching task manager...'; },
  snake: () => { openWin('win-snake'); return 'ssssssure. launching snake.exe'; },
  matrix: () => { startSaver(); return 'entering the matrix...'; },
  whoami: () => 'recruiter — clearance FULL — bias hopefully favorable',
  date: () => new Date().toString(),
  echo: (a) => a || '',
  history: () => termHistory.map((h, i) => ` ${i + 1}  ${h}`).join('\n') || '(empty)',
  hire: () => {
    location.href = 'mailto:shubham072001@gmail.com?subject=BUY%20ORDER%3A%20SHBM';
    return 'opening mail client... good choice.';
  },
  sudo: (a) => a.trim() === 'hire'
    ? 'PERMISSION GRANTED. offer letter drafted. awaiting signature. ✍'
    : 'sudo: only "sudo hire" is authorized here.',
  coffee: () => '☕ brewing... productivity +47%',
  clear: () => { termOut.innerHTML = ''; return null; },
  exit: () => { closeWin(document.getElementById('win-terminal')); return null; },
  gpa: () => '9.07/10 — also this CPU\'s clock speed. everything connects.',
  vim: () => ':q! — nice try. nobody escapes vim that easily.',
  rm: () => 'rm: permission denied. this career is write-protected.',
};

const termHistory = [];
let histIdx = -1;

function termEcho(cmdline, result, promptPath) {
  termOut.innerHTML += `<span class="t-dim">${promptPath || cwdPath()}$ ${cmdline}</span>\n`;
  if (result != null && result !== '') termOut.innerHTML += result + '\n';
  termOut.parentElement.scrollTop = termOut.parentElement.scrollHeight;
  termPrompt.textContent = cwdPath() + '$';
}

termIn.addEventListener('keydown', (e) => {
  /* history ↑ ↓ */
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (termHistory.length && histIdx < termHistory.length - 1) {
      histIdx++;
      termIn.value = termHistory[termHistory.length - 1 - histIdx];
    }
    return;
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) {
      histIdx--;
      termIn.value = termHistory[termHistory.length - 1 - histIdx];
    } else { histIdx = -1; termIn.value = ''; }
    return;
  }
  /* tab completion */
  if (e.key === 'Tab') {
    e.preventDefault();
    const parts = termIn.value.split(/\s+/);
    const last = parts[parts.length - 1];
    if (!last) return;
    const pool = parts.length === 1
      ? Object.keys(TERM_CMDS)
      : [...Object.keys(cwdDir()), ...Object.keys(OPEN_TARGETS)];
    const hits = pool.filter(p => p.startsWith(last.toLowerCase()));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      termIn.value = parts.join(' ');
    } else if (hits.length > 1) {
      termEcho(termIn.value, hits.join('   '));
    }
    return;
  }
  if (e.key !== 'Enter') return;
  const raw = termIn.value.trim();
  termIn.value = '';
  histIdx = -1;
  if (!raw) return;
  termHistory.push(raw);
  unlock('hacker', 'Hacker', 'Used the terminal. Respect.');
  const [cmd, ...rest] = raw.split(/\s+/);
  const fn = TERM_CMDS[cmd.toLowerCase()];
  const promptPath = cwdPath();
  termEcho(raw, fn ? fn(rest.join(' ')) : `'${cmd}' is not recognized. but Shubham learns fast — try 'help'.`, promptPath);
});

/* ---------- SNAKE.EXE ---------- */
const sCan = document.getElementById('snakeCanvas');
const sCtx = sCan.getContext('2d');
const sScoreEl = document.getElementById('snakeScore');
const CELL = 16, GRID = 20;
let snake, sdir, nextDir, food, sScore, sTimer = null, sDead = false, sWaiting = true;

function snakeReset() {
  snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
  sdir = { x: 1, y: 0 }; nextDir = sdir;
  sScore = 0; sDead = false; sWaiting = true;
  sScoreEl.textContent = '0';
  snakeFood();
}
function snakeFood() {
  do {
    food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}
function snakeStart() {
  if (!snake) snakeReset();
  if (!sTimer) sTimer = setInterval(snakeTick, 130);
  snakeDraw();
}
function snakePause() { clearInterval(sTimer); sTimer = null; }

function snakeTick() {
  if (sDead || sWaiting) return;
  sdir = nextDir;
  const head = { x: snake[0].x + sdir.x, y: snake[0].y + sdir.y };
  if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID ||
      snake.some(s => s.x === head.x && s.y === head.y)) {
    sDead = true;
    snakeDraw();
    return;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    sScore++;
    sScoreEl.textContent = sScore;
    if (sScore >= 5) unlock('gamer', 'Certified Gamer', '5 coffees eaten. Shubham approves the work ethic.');
    snakeFood();
  } else {
    snake.pop();
  }
  snakeDraw();
}

function snakeDraw() {
  sCtx.clearRect(0, 0, 320, 320);
  sCtx.strokeStyle = 'rgba(139,124,255,0.07)';
  for (let i = 1; i < GRID; i++) {
    sCtx.beginPath(); sCtx.moveTo(i * CELL, 0); sCtx.lineTo(i * CELL, 320); sCtx.stroke();
    sCtx.beginPath(); sCtx.moveTo(0, i * CELL); sCtx.lineTo(320, i * CELL); sCtx.stroke();
  }
  sCtx.font = '13px serif';
  sCtx.fillText('☕', food.x * CELL + 1, food.y * CELL + 13);
  snake.forEach((s, i) => {
    const t = i / snake.length;
    sCtx.fillStyle = i === 0 ? '#4fd8ff' : `rgba(139, 124, 255, ${1 - t * 0.6})`;
    sCtx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });
  if (sWaiting) {
    sCtx.fillStyle = 'rgba(0,0,0,0.55)';
    sCtx.fillRect(0, 0, 320, 320);
    sCtx.fillStyle = '#4fd8ff';
    sCtx.font = 'bold 15px "JetBrains Mono", monospace';
    sCtx.textAlign = 'center';
    sCtx.fillText('PRESS ANY ARROW', 160, 152);
    sCtx.fillStyle = '#8b90b5';
    sCtx.font = '11px "JetBrains Mono", monospace';
    sCtx.fillText('(or WASD) to start', 160, 176);
    sCtx.textAlign = 'left';
  }
  if (sDead) {
    sCtx.fillStyle = 'rgba(0,0,0,0.65)';
    sCtx.fillRect(0, 0, 320, 320);
    sCtx.fillStyle = '#ff5f57';
    sCtx.font = 'bold 22px "JetBrains Mono", monospace';
    sCtx.textAlign = 'center';
    sCtx.fillText('GAME OVER', 160, 148);
    sCtx.fillStyle = '#e8eaf6';
    sCtx.font = '12px "JetBrains Mono", monospace';
    sCtx.fillText(`score: ${sScore} — press R to retry`, 160, 176);
    sCtx.textAlign = 'left';
  }
}

document.addEventListener('keydown', (e) => {
  const snakeOpen = document.getElementById('win-snake').classList.contains('open');
  if (!snakeOpen || e.target === termIn || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const k = e.key.toLowerCase();
  const dirs = {
    arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
  };
  if (dirs[k]) {
    e.preventDefault();
    const d = dirs[k];
    if (d.x !== -sdir.x || d.y !== -sdir.y) nextDir = d;
    if (sWaiting) { sWaiting = false; snakeDraw(); }
  }
  if (k === 'r' && sDead) { snakeReset(); snakeDraw(); }
});

/* ---------- COMMAND PALETTE (CTRL+K) ---------- */
const palette = document.getElementById('palette');
const paletteIn = document.getElementById('paletteIn');
const paletteList = document.getElementById('paletteList');
let palSel = 0;

const PAL_ACTIONS = [
  ['📕', 'Resume', 'open pdf', () => openWin('win-resume')],
  ['📄', 'About Me', 'notepad', () => openWin('win-about')],
  ['🗒️', 'Experience', 'log viewer', () => openWin('win-exp')],
  ['📁', 'Projects', 'file explorer', () => openWin('win-projects')],
  ['📊', 'Skills', 'task manager', () => openWin('win-skills')],
  ['✉️', 'Contact', 'mail', () => openWin('win-contact')],
  ['💻', 'Terminal', 'cmd.exe', () => openWin('win-terminal')],
  ['📈', 'Trading Terminal', 'markets app', () => openWin('win-trading')],
  ['🖥️', 'About This PC', 'system properties', () => openWin('win-aboutpc')],
  ['🎨', 'Classic View', 'external ↗', () => window.open('classic.html', '_blank')],
  ['🐍', 'Snake', 'game', () => openWin('win-snake')],
  ['🗑️', 'Recycle Bin', 'the past', () => openWin('win-recycle')],
  ['🖼️', 'Change Wallpaper', 'cycle themes', () => cycleWallpaper()],
  ['🌧️', 'Screensaver', 'matrix rain', () => startSaver()],
  ['🐙', 'GitHub', 'external ↗', () => window.open('https://github.com/Greatgabbar', '_blank')],
  ['💼', 'LinkedIn', 'external ↗', () => window.open('https://www.linkedin.com/in/shubhamtrivedi07/', '_blank')],
  ['🤝', 'Hire Shubham', 'send email', () => { location.href = 'mailto:shubham072001@gmail.com?subject=Found%20you%20via%20Ctrl%2BK'; }],
];

function palRender() {
  const q = paletteIn.value.toLowerCase();
  const hits = PAL_ACTIONS.filter(([, label, sub]) =>
    label.toLowerCase().includes(q) || sub.toLowerCase().includes(q));
  palSel = Math.min(palSel, Math.max(0, hits.length - 1));
  paletteList.innerHTML = hits.map(([ico, label, sub], i) =>
    `<button class="pal-item${i === palSel ? ' sel' : ''}" data-i="${PAL_ACTIONS.findIndex(a => a[1] === label)}">
       <span>${ico}</span> ${label} <small>${sub}</small>
     </button>`).join('') || '<p class="palette-hint mono">no results — he\'s good, but not that good</p>';
}
function palOpen() {
  palette.hidden = false;
  paletteIn.value = '';
  palSel = 0;
  palRender();
  setTimeout(() => paletteIn.focus(), 40);
}
function palClose() { palette.hidden = true; }
function palRun() {
  const sel = paletteList.querySelector('.pal-item.sel');
  if (!sel) return;
  palClose();
  PAL_ACTIONS[+sel.dataset.i][3]();
}
paletteIn.addEventListener('input', () => { palSel = 0; palRender(); });
paletteIn.addEventListener('keydown', (e) => {
  const count = paletteList.querySelectorAll('.pal-item').length;
  if (e.key === 'ArrowDown') { e.preventDefault(); palSel = (palSel + 1) % count; palRender(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); palSel = (palSel - 1 + count) % count; palRender(); }
  if (e.key === 'Enter') palRun();
  if (e.key === 'Escape') palClose();
});
paletteList.addEventListener('click', (e) => {
  const item = e.target.closest('.pal-item');
  if (!item) return;
  palClose();
  PAL_ACTIONS[+item.dataset.i][3]();
});
palette.addEventListener('click', (e) => { if (e.target === palette) palClose(); });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    palette.hidden ? palOpen() : palClose();
  }
});
document.getElementById('tbSearch').addEventListener('click', palOpen);

/* ---------- CLIPPY (HIRY 📎) ---------- */
const clippy = document.getElementById('clippy');
const clippyText = document.getElementById('clippyText');
const CLIPPY_LINES = [
  "It looks like you're trying to evaluate a candidate. Would you like help?",
  'Fun fact: this entire OS is vanilla JavaScript. No frameworks were harmed.',
  'Tip: he reduced trade latency 28x. Your hiring process could be next.',
  'I found 0 red flags and 1 strong hire. Want me to draft the offer?',
  'Press Ctrl+K. All good engineers love a command palette.',
];
let clippyIdx = 0;
setTimeout(() => { clippy.hidden = false; }, 14000);
document.getElementById('clippyClose').addEventListener('click', () => { clippy.hidden = true; });
document.getElementById('clippyChar').addEventListener('click', () => {
  clippyIdx = (clippyIdx + 1) % CLIPPY_LINES.length;
  clippyText.textContent = CLIPPY_LINES[clippyIdx];
  unlock('friend', 'Made a Friend', 'You clicked Hiry. He gets lonely.');
});
document.getElementById('clippyHighlights').addEventListener('click', () => openWin('win-resume'));
document.getElementById('clippyHire').addEventListener('click', () => {
  location.href = 'mailto:shubham072001@gmail.com?subject=Hiry%20sent%20me%20%F0%9F%93%8E';
});

/* ---------- CONTEXT MENU ---------- */
const ctxmenu = document.getElementById('ctxmenu');
let wallIdx = 1;
function cycleWallpaper() {
  wallIdx = (wallIdx % 3) + 1;
  document.body.dataset.wall = wallIdx;
  toast('🖼️', 'Wallpaper changed', `Theme ${wallIdx}/3 applied. Interior design: also a skill.`);
}
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
  if (e.target.closest('.window, .taskbar, .startmenu, .clippy, .palette')) return;
  e.preventDefault();
  ctxmenu.hidden = false;
  ctxmenu.style.left = Math.min(e.clientX, innerWidth - 220) + 'px';
  ctxmenu.style.top = Math.min(e.clientY, innerHeight - 260) + 'px';
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.ctxmenu')) ctxmenu.hidden = true;
});
ctxmenu.addEventListener('click', (e) => {
  const act = e.target.dataset.ctx;
  ctxmenu.hidden = true;
  if (act === 'palette') palOpen();
  if (act === 'terminal') openWin('win-terminal');
  if (act === 'wallpaper') cycleWallpaper();
  if (act === 'screensaver') startSaver();
  if (act === 'refresh') toast('🔄', 'Desktop refreshed', 'Still fast. Still hireable.');
  if (act === 'sort') toast('🌀', 'Sorted by vibes', 'The vibes were already immaculate.');
});

/* ---------- MATRIX SCREENSAVER ---------- */
const saver = document.getElementById('screensaver');
const saverCtx = saver.getContext('2d');
let saverTimer = null, idleTimer = null;
const GLYPHS = 'アイウエオカキクケコサシスセソ0123456789SHBM<>/{}=+*';

function startSaver() {
  saver.hidden = false;
  saver.width = innerWidth;
  saver.height = innerHeight;
  const cols = Math.floor(innerWidth / 16);
  const drops = Array(cols).fill(1).map(() => Math.random() * -50);
  clearInterval(saverTimer);
  saverTimer = setInterval(() => {
    saverCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    saverCtx.fillRect(0, 0, saver.width, saver.height);
    saverCtx.font = '14px "JetBrains Mono", monospace';
    drops.forEach((y, i) => {
      const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      saverCtx.fillStyle = Math.random() < 0.08 ? '#d9ffe8' : '#2bff88';
      saverCtx.fillText(ch, i * 16, y * 16);
      drops[i] = y * 16 > saver.height && Math.random() > 0.975 ? 0 : y + 1;
    });
  }, 50);
  unlock('zen', 'Screensaver Zen', 'Watched the rain. The rain watched back.');
}
function stopSaver() {
  if (saver.hidden) return;
  saver.hidden = true;
  clearInterval(saverTimer);
  saverTimer = null;
}
saver.addEventListener('pointerdown', stopSaver);
saver.addEventListener('pointermove', () => { if (!saver.hidden) stopSaver(); });
document.addEventListener('keydown', () => stopSaver());

function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (saver.hidden) startSaver(); }, 90000);
}
['pointermove', 'pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, resetIdle));
resetIdle();

/* ---------- START MENU ---------- */
const startmenu = document.getElementById('startmenu');
const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startmenu.hidden = !startmenu.hidden;
});
document.addEventListener('click', (e) => {
  if (!startmenu.hidden && !e.target.closest('.startmenu, .start')) startmenu.hidden = true;
});

/* ---------- SHUTDOWN ---------- */
const shutdown = document.getElementById('shutdown');
document.getElementById('shutdownBtn').addEventListener('click', () => {
  startmenu.hidden = true;
  shutdown.hidden = false;
});
document.getElementById('rebootBtn').addEventListener('click', () => {
  shutdown.hidden = true;
});

/* ---------- MOBILE BANNER ---------- */
document.getElementById('mobileDismiss').addEventListener('click', () => {
  document.getElementById('mobileBanner').remove();
});

/* ---------- GITHUB LIVE WIDGET ---------- */
fetch('https://api.github.com/users/Greatgabbar')
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(u => {
    document.getElementById('ghStats').textContent =
      `${u.public_repos} repos · ${u.followers} followers`;
    document.getElementById('ghWidget').hidden = false;
  })
  .catch(() => { /* offline or rate-limited — widget stays hidden */ });

/* ---------- KONAMI CODE (secret achievement) ---------- */
const KONAMI = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
let konamiPos = 0;
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  konamiPos = e.key.toLowerCase() === KONAMI[konamiPos] ? konamiPos + 1 : 0;
  if (konamiPos === KONAMI.length) {
    konamiPos = 0;
    confetti();
    playChime([523, 659, 784, 1047]);
    unlock('konami', 'Old School', '↑↑↓↓←→←→BA — you absolute legend.');
  }
});

/* ---------- CONFETTI ---------- */
function confetti() {
  const wrap = document.createElement('div');
  wrap.className = 'confetti';
  const EMOJI = ['🎉', '⚡', '☕', '📈', '🏆', '💾'];
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('span');
    s.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDuration = 2 + Math.random() * 2 + 's';
    s.style.animationDelay = Math.random() * 0.8 + 's';
    s.style.fontSize = 14 + Math.random() * 16 + 'px';
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 5000);
}

/* ---------- CLOCK ---------- */
const osClock = document.getElementById('osClock');
function tickClock() {
  osClock.textContent = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}
tickClock();
setInterval(tickClock, 15000);
