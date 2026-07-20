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
| 🤖 `ask_shubham.ai` | Scripted chatbot — ask "why hire him?", "salary?", "tech stack?" (0 tokens harmed) |
| 🧙 `setup_wizard.exe` | "Install Shubham on your team" — license agreement ☑ "I agree this candidate is excellent", progress bar installing `talent.dll`, ends in your mail client |
| 📡 `live_metrics.exe` | Simulated prod dashboard — live-updating latency & Kafka throughput charts |
| 🐍 `snake.exe` | Playable Snake (eat the ☕) |
| 🗑️ Recycle Bin | `imposter_syndrome.exe`, `rejected_offers/` — and `bugs.zip`, which triggers a full Blue Screen of Death 💙 |

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

## 📈 Visitor analytics (optional, 2 minutes)

A privacy-friendly, cookie-free analytics snippet is ready in [index.html](index.html) (commented out in `<head>`):
1. Sign up free at **https://www.goatcounter.com**
2. Pick a site code (e.g. `shbm`) — your dashboard becomes `https://shbm.goatcounter.com`
3. In `index.html`, replace `MYCODE` with your code and remove the comment markers `<!--` / `-->` around the script
4. Push — from then on you can see how many people visit and which pages they open

## 🌍 Deploy

Live at **https://greatgabbar.github.io** (GitHub Pages, repo `Greatgabbar/Greatgabbar.github.io`).
To update: edit files → `git add . && git commit -m "update" && git push` — redeploys in ~1 minute.
