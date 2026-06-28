# 🚀 Anthropic Claude LaunchPad

An immersive, premium digital cockpit designed for aspiring Claude Certified Architects. This Interactive Learning Environment consolidates all official study paths, reference guides, exam telemetry, and timed mock tests into a single, high-fidelity experience.

🔗 **GitHub Repository:** [rk-int/Architect-Launchpad](https://github.com/rk-int/Architect-Launchpad)

---

## 🌟 Key Features

### 🎬 Immersive Multiplex Cockpit
Switch between three visual environments on-the-fly using the HUD cycle interface:
- **Cinematic Video View:** An HD cinematic video loop with an auto-fading, gesture-triggered ambient sound overlay (built with standard-compliant, non-blocking media hooks).
- **Interactive Roadmap View:** An SVG-driven graphical path of all certification nodes with pulsing beacons and hover telemetries.
- **Classic 3D Orbit View:** A Three.js-powered interactive neural network particle field and orbiting core.

### 📅 Timezone-Safe Dynamic Scheduler
Configure your preparation target date (validated strictly between 3 and 9 weeks from start). The system automatically compresses or scales the full syllabus dynamically:
- **Zero-loss curriculum consolidation:** Aggregates all weekly tasks, core concepts, and reading materials into the custom duration without omitting a single exam topic.
- **True Date Alignment:** Employs a custom timezone-safe date-delta calculator to prevent offset mismatches between UTC local dates.
- **Custom Date Picker:** A completely tailored React calendar dropdown styled natively to match the dark theme and avoid native browser pop-up blocks.

### 🧪 Advanced Mock Tests
Validate your understanding with timed mock exams targeting the 5 official domains:
- **Agentic Loops & Orchestration** (Domain 1 · 27%)
- **Tool Design & MCP Integration** (Domain 2 · 20%)
- **Claude Code & Workspace Configurations** (Domain 3 · 20%)
- **Prompt Engineering & Evaluations** (Domain 4 · 20%)
- **Context Management & Reliability** (Domain 5 · 15%)
- Features detailed explanation slide-outs for every correct/incorrect answer and anti-pattern warning.

### 📚 Official References Repository
A consolidated repository of primary certification materials opening directly in a new tab:
- Official foundations certification exam guide.
- Playbook for constructing tools and skills.
- Financial and legal industry practical deployment guides.
- Traps & Anti-patterns cheatsheet console.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework:** React 19 & Vite 6 (Fast Refresh + Hot Module Replacement)
- **Styling:** Tailwind CSS v4 & custom variables (with fully inverted, high-contrast premium theme profiles for Dark & Light modes)
- **3D Graphics:** Three.js / React Three Fiber (interactive particle systems)
- **Icons:** Lucide React
- **Persistence:** LocalStorage-backed state machine with built-in JSON data backup export & import functions.
- **PWA Capabilities:** Service worker configuration via `vite-plugin-pwa` for offline accessibility.

---

## 📂 Directory Structure

```
├── public/                  # Static assets & media
│   ├── assets/              # Roadmap canvas & cinematic video loops
│   └── favicon.svg          # Platform logo
├── src/
│   ├── components/
│   │   ├── 3d/              # Canvas, particle shader, and orb components
│   │   ├── DatePicker.jsx   # Custom calendar selection interface
│   │   ├── Layout.jsx       # Side navbar, streak metrics, and master theme frame
│   │   └── ProgressRing.jsx # Dashboard telemetry visualizer
│   ├── lib/
│   │   ├── data.js          # Curriculum definitions, questions, and scheduling logic
│   │   ├── storage.js       # Local state persistence & JSON I/O
│   │   └── useProgress.js   # Master stats and progress calculation hook
│   ├── pages/               # Routed pages (Dashboard, Learning Plan, Mock Tests, etc.)
│   ├── App.jsx              # Routing table & guards
│   ├── index.css            # Stylesheet overrides & animations
│   └── main.jsx             # Entrypoint
├── vercel.json              # Single Page Application rewrite rules
└── vite.config.js           # Build configurations
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed.

### 1. Local Development Setup
Clone the repository and install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the Vite development server:

```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Local Production Build
Verify the production build output:

```bash
npm run build
```

---

## ☁️ Deployment (Vercel)

This application is fully optimized for one-click deployment on **Vercel**:

1. Push this clean codebase to your GitHub repository.
2. Link the repository to your Vercel Account.
3. Configure the framework preset to **Vite**.
4. Deploy! 

The provided [vercel.json](vercel.json) rewrite rule handles React SPA routes automatically, preventing `404 Not Found` errors when refreshing subpages (like `/plan` or `/quiz`) directly in the browser address bar.

---

## 🧑‍💻 Credits

**Crafted by:** Ravi Kiran
