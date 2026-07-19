/* ============================================================
   🖥️ SHBM-OS — window manager & apps
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
  focusWin(win);
  if (id === 'win-skills') animateTaskman();
}

function closeWin(win) {
  win.classList.remove('open', 'focus');
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

// per-window controls & focus
windows.forEach(win => {
  win.addEventListener('pointerdown', () => focusWin(win));
  win.querySelector('[data-close]').addEventListener('click', () => closeWin(win));
  win.querySelector('[data-min]').addEventListener('click', () => {
    win.style.display = 'none';
    win.classList.remove('focus');
    syncTaskbar();
  });

  /* ---------- DRAGGING ---------- */
  const head = win.querySelector('.win-head');
  head.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.lights')) return;
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
  window.location.href = `mailto:shubham072001@gmail.com?subject=${subject}&body=${body}`;
});

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
