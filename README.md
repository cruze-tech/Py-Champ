# PyChamp 🐍🏆

**Learn Python Programming Through Interactive Browser-Based Challenges**

### [🚀 Play PyChamp Live!](https://cruze-tech.github.io/Py-Champ/)

![PyChamp Gameplay Screenshot](PyChamp.png)

---

## Table of Contents
1. [About the Project](#-about-the-project)
2. [Live Demo](#-play-pychamp-live)
3. [Features](#-key-features)
4. [Gameplay Overview](#-gameplay-overview)
5. [Rules & Mechanics](#-rules--mechanics)
6. [Controls](#-controls)
7. [Tech Stack](#%EF%B8%8F-tech-stack)
8. [Project Structure](#-project-structure)
9. [Getting Started (Local Development)](#-getting-started-local-development)
10. [Architecture & Design Notes](#-architecture--design-notes)
11. [Data & State Management](#-data--state-management)
12. [Performance Considerations](#-performance-considerations)
13. [Accessibility](#-accessibility)
14. [Deployment (GitHub Pages)](#-deployment-github-pages)
15. [Roadmap](#%EF%B8%8F-roadmap)
16. [Contributing](#-contributing)
17. [Troubleshooting](#%EF%B8%8F-troubleshooting)
18. [FAQ](#-faq)
19. [License](#-license)
20. [Acknowledgments](#-acknowledgments)

---

## 📖 About The Project

PyChamp is an educational web game that teaches Python programming fundamentals through interactive coding challenges. Players write real Python code directly in their browser to solve puzzles, complete levels, and master programming concepts from basic syntax to variables and conditionals.

**Why PyChamp?**
- **Zero Setup**: No Python installation required - everything runs in your browser
- **Hands-On Learning**: Write real Python code, not multiple choice questions  
- **Gamified Experience**: Star ratings, level progression, and achievement tracking
- **Instant Feedback**: See your code run immediately with detailed console output

---

## ✨ Key Features

- 🎯 **6 Progressive Levels** - From "Hello World" to conditional statements
- ⚡ **Real Python Execution** - Powered by Pyodide (Python in WebAssembly)
- 📝 **Professional Code Editor** - Syntax highlighting with CodeMirror
- 💡 **Smart Hint System** - Get help when stuck, view solutions when needed
- ⭐ **Star Rating System** - Perfect (3⭐), Good (2⭐), Okay (1⭐) based on hints used
- 💾 **Progress Tracking** - Automatic save to localStorage with detailed statistics
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, dark theme with professional game aesthetics
- 🔧 **Modular Architecture** - Clean separation of concerns for maintainability

---

## 🎮 Gameplay Overview

**Objective**: Complete Python coding challenges by writing real code that produces the expected output.

**Win Condition**: Your code output matches the level's expected result exactly.

**Progression**: Linear level progression - complete Level N to unlock Level N+1.

### How to Play
1. **Start the Game** - Visit the live link and click "🚀 Start Game"
2. **Choose a Level** - Select from unlocked levels on the level map
3. **Read the Challenge** - Each level has a guide NPC and clear instructions
4. **Write Python Code** - Use the built-in editor with syntax highlighting
5. **Run & Test** - Execute your code and see real-time output
6. **Complete Levels** - Match expected output to earn stars and unlock new levels

### Level Progression
- **Level 1**: Hello World - Basic print statements
- **Level 2**: Math Operations - Arithmetic and calculations  
- **Level 3**: Variables - Storing and using data
- **Level 4**: String Operations - Working with text
- **Level 5**: User Input - Interactive programs
- **Level 6**: Conditionals - If statements and logic

---

## 🎯 Rules & Mechanics

| Element | Description |
|---------|-------------|
| **Code Editor** | Write Python code with syntax highlighting and auto-indentation |
| **Console Output** | Real-time execution results and error messages |
| **Hints** | Progressive help system (5 hints max, then solution revealed) |
| **Star Rating** | 3⭐ (no hints), 2⭐ (1-2 hints), 1⭐ (3+ hints) |
| **Progress Tracking** | Completed levels, attempts, best times, total hints used |
| **Level Unlocking** | Sequential unlock system - complete previous to access next |

---

## 🎮 Controls

| Action | Input Method |
|--------|-------------|
| **Code Writing** | Keyboard typing in code editor |
| **Execute Code** | Click "▶️ Run" button |
| **Get Hint** | Click "💡 Hint" button |
| **Navigate Levels** | Click level cards on level map |
| **Menu Navigation** | Click navigation buttons |
| **Modal Actions** | Click modal buttons (Retry, Next Level, Level Map) |

**Mobile Controls:**
- Touch typing with virtual keyboard
- Tap buttons for all actions
- Swipe-friendly modal interactions

---

## 🛠️ Tech Stack

**Frontend Technologies:**
- HTML5, CSS3, JavaScript (ES6+)
- CSS Grid & Flexbox for responsive layouts
- CSS Custom Properties for theming

**Core Libraries:**
- **[Pyodide](https://pyodide.org/)** - Python scientific stack in WebAssembly
- **[CodeMirror 5](https://codemirror.net/)** - In-browser code editor with Python syntax highlighting

**No Backend Required** - Entirely client-side application

---

## 3. Screenshots / Media
| Gameplay | Menu | Mobile |
|----------|------|--------|
| (Add Image) | (Add Image) | (Add Image) |

Add images to a folder like: `assets/screenshots/` and reference them:

```
![Gameplay](assets/screenshots/gameplay.png)
```

If you have an animated GIF, include it near the top for visual appeal.

---

## 9. Project Structure
Example (replace with actual tree):
```
Py-Champ/
├─ index.html
├─ assets/
│  ├─ images/
│  ├─ audio/
│  └─ screenshots/
├─ src/
│  ├─ main.js
│  ├─ game/
│  │  ├─ engine.js
│  │  ├─ entities/
│  │  │  ├─ player.js
│  │  │  └─ enemy.js
│  │  ├─ systems/
│  │  └─ utils/
├─ styles/
│  └─ main.css
├─ tests/
│  ├─ game.test.js
│  └─ utils.test.js
├─ README.md
└─ package.json (if using Node tooling)
```

---

## 10. Getting Started (Local Development)

### Prerequisites
If pure static JS:
- Any modern browser

If using Node (for tooling):
```
node >= 18
npm >= 9
```

If Python (for build or PyScript experiments):
```
python >= 3.10
```

### Clone
```
git clone https://github.com/cruze-tech/Py-Champ.git
cd Py-Champ
```

### Install (optional, if dependencies exist)
```
npm install
```

### Run Locally
If purely static:
- Open `index.html` directly OR
- Serve for cleaner module loading:
```
# Simple Python server
python -m http.server 8000
# or
npx serve .
```
Visit: http://localhost:8000

### Build (if bundling)
```
npm run build
```

---

## 11. Running Tests (If Implemented)
```
npm test
```
or
```
pytest
```
Describe coverage thresholds or snapshot tests if used.

---

## 12. Architecture & Design Notes
- Rendering Loop: (requestAnimationFrame / interval)
- Separation of concerns:
  - Game state vs rendering
  - Input handling module
  - Collision detection logic
- Extensibility: Add new entities by extending `BaseEntity`
- Performance hooks: Object pooling for sprites (if applicable)

Add diagrams if useful (e.g., state machine, update cycle):
```
Input → Update State → Detect Collisions → Apply Effects → Render Frame
```

---

## 13. Data & State Management
- Central `gameState` object (lives, score, level, flags)
- Persistence: localStorage key `pychamp_highscore`
- Serialization: JSON export (planned / implemented)

---

## 14. Performance Considerations
- Minimized reflows
- Batched rendering
- Asset preloading
- Avoided large GC churn (pooled arrays for particles)

Add Lighthouse / FPS benchmarks if available.

---

## 15. Accessibility
Planned / Implemented:
- Keyboard-only navigation
- High-contrast mode toggle
- Reduced motion mode
- ARIA labels for menus

---

## 16. Deployment (GitHub Pages)
Deployed from branch: `gh-pages` (or `main` if using root)

Typical workflow:
1. Build (if needed)
2. Commit compiled assets
3. Push to branch
4. GitHub Pages settings: Source = (branch)/(root or /docs)

If using an action:
Add example workflow file `.github/workflows/deploy.yml` (not shown here; can be added later).

---

## 17. Roadmap
- [ ] Sound effects & music toggle
- [ ] Mobile-friendly on-screen controls
- [ ] Difficulty selector
- [ ] Online leaderboard (server / Supabase / Firebase)
- [ ] Skins / Themes
- [ ] Accessibility improvements
- [ ] Pause menu enhancements

---

## 18. Contributing

1. Fork the repo
2. Create a feature branch:
   ```
   git checkout -b feature/amazing-improvement
   ```
3. Commit changes:
   ```
   git commit -m "feat: add amazing improvement"
   ```
4. Push:
   ```
   git push origin feature/amazing-improvement
   ```
5. Open a Pull Request with a clear description & screenshots if UI-related

Coding Style:
- Follow ESLint rules (if configured)
- Prefer pure functions for logic modules
- Keep functions under N lines where possible

Commit Convention (suggested):
- feat:, fix:, chore:, refactor:, docs:, test:, perf:

---

## 19. Troubleshooting
| Issue | Cause | Solution |
|-------|-------|----------|
| Blank screen | JS error | Check DevTools console |
| Assets 404 | Wrong path | Verify relative paths |
| Controls lag | Multiple loops running | Ensure only one game loop instance |
| Highscore not saved | localStorage blocked | Check browser privacy settings |

---

## 20. FAQ
Q: Does it work offline?  
A: (Add answer—consider a service worker for offline support.)

Q: Can I add my own levels?  
A: Yes—add JSON to `src/levels/` and register it in `levelIndex.js`.

Q: Will there be mobile support?  
A: Planned (see Roadmap).

---

## 21. License
Add your chosen license. If MIT, include:
```
MIT License © YEAR AUTHOR
```
(Place the full text in a `LICENSE` file.)

---

## 22. Acknowledgments
- Inspiration: (List influences)
- Assets:
  - Sprites: (Source / Author)
  - Sounds: (Source / License)
- Libraries: (If any)
- Contributors: Thanks to everyone who tested and reported issues!

---

## ⭐ Support
If you like the project:
- Star the repository
- Share feedback via issues
- Suggest features

---

Happy playing! 🕹️
