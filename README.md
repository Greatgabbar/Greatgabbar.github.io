# 🖥️ SHBM-OS — Shubham Trivedi's Portfolio

**One URL. One operating system. The entire portfolio lives inside it.**

`index.html` boots **SHBM-OS**: splash → login screen ("Recruiter (guest)" — any password works) → a desktop where every part of the portfolio is an app. Pure HTML/CSS/JS, no frameworks, no build step.

## 🚀 The apps

| App | What it is |
|-----|-----------|
| 📕 `resume.pdf` | Real PDF viewer window with a download button |
| 📄 `about_me.txt` | Bio in a Notepad window |
| 🗒️ `experience.log` | Work history as a log file |
| 📁 `projects` | File Explorer of side projects (links to GitHub) |
| 📊 `skills.sys` | Task Manager — skills as processes with animated bars |
| ✉️ `contact.eml` | Mail compose that opens a real email |
| 💻 `cmd.exe` | **Real shell**: fake filesystem (`ls`/`cd`/`cat`/`pwd`), ↑↓ history, TAB completion, `neofetch`, `open <app>`, `sudo hire`, easter eggs |
| 📈 `trading_terminal.exe` | The full Bloomberg-style trading terminal design, as an app ([terminal.html](terminal.html)) |
| 🌐 `browser.exe` | Fake browser chrome showing the classic portfolio design ([classic.html](classic.html)) |
| 🐍 `snake.exe` | Playable Snake (eat the ☕) |
| 🗑️ Recycle Bin | `imposter_syndrome.exe`, `rejected_offers/` (empty, kept out of optimism) |

## ✨ System features

- **Ctrl+K command palette** — search and launch anything (also the 🔍 taskbar button)
- **Window manager** — drag, minimize, maximize, close, z-order stacking, taskbar chips
- **🏆 5 achievements** with toast notifications + completionist bonus
- **📎 Hiry** — Clippy-parody hiring assistant
- **🌧️ Matrix screensaver** — after 90s idle, or `matrix` in the terminal
- **Right-click context menu** — 3 wallpaper themes, screensaver, "sort by vibes"
- Start menu, live IST clock, shutdown that refuses (*candidate still hireable*)
- Mobile: OS works, plus a banner suggesting the comfier classic view

## 📁 Files

- `index.html` + `os.css` + `os.js` — the OS (entry point)
- `terminal.html` + `terminal.css` + `terminal.js` — trading terminal (app + standalone)
- `classic.html` + `style.css` + `script.js` — classic design (app + standalone + mobile fallback)
- `resume.pdf` — the actual resume
- `os.html` — legacy redirect to index.html

## ✏️ Customize

- **Theme**: `:root` vars at top of each CSS file
- **Shell**: `FS` (filesystem), `TERM_CMDS` (commands), `NEOFETCH` in [os.js](os.js)
- **Palette actions**: `PAL_ACTIONS` in [os.js](os.js)
- **Achievements / toasts / Hiry lines**: all near the top of [os.js](os.js)
- **Content**: directly in the HTML — every window is comment-marked

## 🌍 Deploy

Live at **https://greatgabbar.github.io** (GitHub Pages, repo `Greatgabbar/Greatgabbar.github.io`).
To update: edit files → `git add . && git commit -m "update" && git push` — redeploys in ~1 minute.
