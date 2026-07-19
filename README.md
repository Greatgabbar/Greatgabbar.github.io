# 🖥️ Shubham Trivedi — A Portfolio in Three Acts

One portfolio, **three completely different experiences**, all pure HTML/CSS/JS — no frameworks, no build step. Every page cross-links to the others.

| File | Design | Vibe |
|------|--------|------|
| [index.html](index.html) | 📈 **SHBM Terminal** | Bloomberg-style trading terminal — *he is the stock* |
| [os.html](os.html) | 🖥️ **SHBM-OS** | A desktop operating system — draggable windows, taskbar, start menu |
| [classic.html](classic.html) | 🎨 **Classic** | Polished modern dark portfolio with animations |

## 📈 SHBM Terminal (`index.html` + `terminal.css` + `terminal.js`)

- Boot sequence (`ACCESS GRANTED`), skills ticker tape, live IST clock, CRT scanlines
- **Working command line**: `help`, `about`, `experience`, `projects`, `skills`, `hire`, `whoami`, `clear` + easter eggs (`sudo hire`, `coffee`, `matrix`, `gpa`, `vim`)
- Canvas candlestick career chart (IPO: Thapar '19 → Goldman '25, ATH)
- Trade blotter (experience), order book (skills), holdings (projects), news wire (achievements)
- Keyboard nav: `/` focuses the command line, keys `0–6` jump to panels

## 🖥️ SHBM-OS (`os.html` + `os.css` + `os.js`)

- Boot splash, glassmorphism windows you can **drag, minimize, maximize, close, and stack**
- Desktop apps: `about_me.txt` (Notepad), `experience.log` (LogViewer), `projects` (File Explorer), `skills.sys` (Task Manager with animated process bars — `coffee.sys 99%`), `contact.eml` (Mail compose that opens a real email)
- **💻 cmd.exe** — a real shell inside the OS: `help`, `neofetch` (ASCII system info), `open <app>`, `matrix`, `sudo hire`, `vim`, `rm`…
- **🐍 snake.exe** — fully playable Snake (arrows/WASD, eat the ☕, R to restart)
- **📎 Hiry** — a Clippy-parody hiring assistant with rotating tips and action buttons
- **🌧️ Matrix screensaver** — auto-starts after 75s idle, or via `matrix` / right-click
- **🏆 Achievements** — 5 unlockable achievements with toast notifications (Hacker, Certified Gamer, Explorer, HR Material, Made a Friend) + completionist bonus
- **🖱️ Right-click context menu** — 3 wallpaper themes, screensaver, refresh, "sort by vibes"
- **🗑️ Recycle Bin** — `imposter_syndrome.exe`, `rejected_offers/` (empty, kept out of optimism)
- Taskbar with running-app chips, achievement counter, live clock, and a Start menu
- "Shut Down" refuses: *candidate still hireable* 😄

## 🎨 Classic (`classic.html` + `style.css` + `script.js`)

- Typing-effect hero, animated stat counters, scroll reveals, timeline, project cards

## ✏️ How to customize

| What | Where |
|------|-------|
| Terminal theme | `:root` vars at top of [terminal.css](terminal.css) (`--green`, `--amber`…) |
| Terminal data (ticker, order book, milestones, boot lines, commands) | Arrays/objects at top of [terminal.js](terminal.js) |
| OS wallpaper & glass theme | `:root` vars at top of [os.css](os.css) |
| OS window content | Each `<section class="window">` in [os.html](os.html) |
| Skills "processes" | `PROCS` array in [os.js](os.js) |
| Classic theme | `:root` vars in [style.css](style.css); `ROLES` typing array in [script.js](script.js) |
| All text | Directly in the HTML — sections are comment-marked |

## 🚀 Deploy free (GitHub Pages)

```bash
git init
git add .
git commit -m "Portfolio: terminal + OS + classic"
# create a repo named  Greatgabbar.github.io  on GitHub, then:
git remote add origin https://github.com/Greatgabbar/Greatgabbar.github.io.git
git push -u origin main
```

Live at **https://greatgabbar.github.io** — `/` is the terminal, `/os.html` the OS, `/classic.html` the classic. Netlify/Vercel drag-and-drop also works.
