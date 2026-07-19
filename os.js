/* ============================================================
   🖥️ SHBM-OS — window manager, apps & extraordinary features
   ============================================================ */

/* ---------- BOOT SPLASH ---------- */
const splash = document.getElementById('splash');
setTimeout(() => {
  splash.classList.add('done');
  setTimeout(() => splash.remove(), 700);
  openWin('win-about'); // greet visitors with the About window
}, 1600);

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
  win.classList.add('open');
  win.style.display = 'flex';
  focusWin(win);
  if (id === 'win-skills') animateTaskman();
  if (id === 'win-snake') snakeStart();
  if (id === 'win-terminal') setTimeout(() => termIn.focus(), 60);
  trackExplorer(id);
}

function closeWin(win) {
  win.classList.remove('open', 'focus');
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

// openers (desktop icons + start menu items)
document.querySelectorAll('[data-open]').forEach(el =>
  el.addEventListener('click', () => {
    openWin(el.dataset.open);
    startmenu.hidden = true;
  })
);

// per-window controls, focus, drag, maximize
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
    if (e.target.closest('.lights') || win.classList.contains('max')) return;
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
const TOTAL_ACH = 5;
const trophiesEl = document.getElementById('trophies');
function unlock(key, title, msg) {
  if (unlocked.has(key)) return;
  unlocked.add(key);
  trophiesEl.textContent = `🏆 ${unlocked.size}/${TOTAL_ACH}`;
  toast('🏆', `Achievement: ${title}`, msg);
  if (unlocked.size === TOTAL_ACH) {
    setTimeout(() => toast('👑', 'COMPLETIONIST', 'You explored everything. Shubham would review your PR any day.'), 1200);
  }
}

// explorer achievement — open 5 different windows
const openedSet = new Set();
function trackExplorer(id) {
  openedSet.add(id);
  if (openedSet.size >= 5) unlock('explorer', 'Explorer', 'Opened 5 apps. Curiosity: confirmed.');
}

// welcome + fake update toasts
setTimeout(() => toast('✅', 'System ready', 'All career processes running normally.'), 3200);
setTimeout(() => toast('⬆️', 'Update available', 'shubham_v10 ships when you hire him.'), 26000);

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

/* ---------- TERMINAL APP (CMD.EXE) ---------- */
const termOut = document.getElementById('termOut');
const termIn = document.getElementById('termIn');
document.getElementById('termScreen').addEventListener('click', () => termIn.focus());

const NEOFETCH = `<span class="t-cyan">   _____ __ ______  __  ___
  / ___// // / __ )/  |/  /
  \\__ \\/ _  / __  / /|_/ /
 ___/ / // / /_/ / /  / /
/____/_//_/_____/_/  /_/</span>
 <span class="t-warn">shubham</span>@<span class="t-warn">shbm-os</span>
 ─────────────────────────
 OS:       SHBM-OS v9.07
 Kernel:   caffeine-5.4-stable
 Uptime:   7 years in tech
 Shell:    recruiter-sh
 CPU:      Brain @ 9.07GHz (Thapar edition)
 GPU:      Imagination RTX
 Memory:   40M users served / ∞
 Employer: Goldman Sachs (SWE)
 Packages: react, kafka, genai, k8s +16
 Theme:    Hireable Dark`;

const TERM_CMDS = {
  help: () => `commands: about · experience · projects · skills · contact
          open <app> · neofetch · snake · matrix · whoami
          hire · sudo hire · ls · clear · exit`,
  neofetch: () => NEOFETCH,
  ls: () => `about_me.txt  experience.log  projects/  skills.sys
contact.eml  snake.exe  recycle_bin/  no_bugs_here/`,
  whoami: () => 'recruiter — clearance FULL — bias hopefully favorable',
  about: () => { openWin('win-about'); return 'opening about_me.txt...'; },
  experience: () => { openWin('win-exp'); return 'tailing experience.log...'; },
  projects: () => { openWin('win-projects'); return 'mounting projects/...'; },
  skills: () => { openWin('win-skills'); return 'launching task manager...'; },
  contact: () => { openWin('win-contact'); return 'composing mail...'; },
  snake: () => { openWin('win-snake'); return 'ssssssure. launching snake.exe'; },
  matrix: () => { startSaver(); return 'entering the matrix...'; },
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
  gpa: () => '9.07/10 — also this OS version number. everything connects.',
  vim: () => ':q! — nice try. nobody escapes vim that easily.',
  rm: () => 'rm: permission denied. this career is write-protected.',
};

function termEcho(cmdline, result) {
  termOut.innerHTML += `<span class="t-dim">C:\\Users\\recruiter&gt; ${cmdline}</span>\n`;
  if (result != null) termOut.innerHTML += result + '\n';
  termOut.parentElement.scrollTop = termOut.parentElement.scrollHeight;
}

termIn.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = termIn.value.trim();
  termIn.value = '';
  if (!raw) return;
  unlock('hacker', 'Hacker', 'Used the terminal. Respect.');
  let [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
  if (cmd === 'open' && rest.length) { cmd = rest[0]; rest = []; }
  const fn = TERM_CMDS[cmd];
  termEcho(raw, fn ? fn(rest.join(' ')) : `'${cmd}' is not recognized. but Shubham learns fast — try 'help'.`);
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
  // grid
  sCtx.strokeStyle = 'rgba(139,124,255,0.07)';
  for (let i = 1; i < GRID; i++) {
    sCtx.beginPath(); sCtx.moveTo(i * CELL, 0); sCtx.lineTo(i * CELL, 320); sCtx.stroke();
    sCtx.beginPath(); sCtx.moveTo(0, i * CELL); sCtx.lineTo(320, i * CELL); sCtx.stroke();
  }
  // food = coffee
  sCtx.font = '13px serif';
  sCtx.fillText('☕', food.x * CELL + 1, food.y * CELL + 13);
  // snake
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

/* ---------- CLIPPY (HIRY 📎) ---------- */
const clippy = document.getElementById('clippy');
const clippyText = document.getElementById('clippyText');
const CLIPPY_LINES = [
  "It looks like you're trying to evaluate a candidate. Would you like help?",
  'Fun fact: this entire OS is vanilla JavaScript. No frameworks were harmed.',
  'Tip: he reduced trade latency 28x. Your hiring process could be next.',
  'I found 0 red flags and 1 strong hire. Want me to draft the offer?',
];
let clippyIdx = 0;
setTimeout(() => { clippy.hidden = false; }, 12000);
document.getElementById('clippyClose').addEventListener('click', () => { clippy.hidden = true; });
document.getElementById('clippyChar').addEventListener('click', () => {
  clippyIdx = (clippyIdx + 1) % CLIPPY_LINES.length;
  clippyText.textContent = CLIPPY_LINES[clippyIdx];
  unlock('friend', 'Made a Friend', 'You clicked Hiry. He gets lonely.');
});
document.getElementById('clippyHighlights').addEventListener('click', () => openWin('win-exp'));
document.getElementById('clippyHire').addEventListener('click', () => {
  location.href = 'mailto:shubham072001@gmail.com?subject=Hiry%20sent%20me%20%F0%9F%93%8E';
});

/* ---------- CONTEXT MENU ---------- */
const ctxmenu = document.getElementById('ctxmenu');
let wallIdx = 1;
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
  if (e.target.closest('.window, .taskbar, .startmenu, .clippy')) return;
  e.preventDefault();
  ctxmenu.hidden = false;
  ctxmenu.style.left = Math.min(e.clientX, innerWidth - 220) + 'px';
  ctxmenu.style.top = Math.min(e.clientY, innerHeight - 240) + 'px';
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.ctxmenu')) ctxmenu.hidden = true;
});
ctxmenu.addEventListener('click', (e) => {
  const act = e.target.dataset.ctx;
  ctxmenu.hidden = true;
  if (act === 'terminal') openWin('win-terminal');
  if (act === 'wallpaper') {
    wallIdx = (wallIdx % 3) + 1;
    document.body.dataset.wall = wallIdx;
    toast('🖼️', 'Wallpaper changed', `Theme ${wallIdx}/3 applied. Interior design: also a skill.`);
  }
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

// idle detection → screensaver after 75s
function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (saver.hidden) startSaver(); }, 75000);
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

/* ---------- CLOCK ---------- */
const osClock = document.getElementById('osClock');
function tickClock() {
  osClock.textContent = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
}
tickClock();
setInterval(tickClock, 15000);
