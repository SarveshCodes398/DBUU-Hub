# DBUU HUB (NEXUS) 🚀

> **The All-In-One Unified Student Hub & Digital Nerve Center for Dev Bhoomi Uttarakhand University (DBUU)**  
> Inspired by the sleek, cyberpunk glassmorphic aesthetic of **IIT Bombay E-Summit** (`ecell.in/esummit/events`). Built with modern open-source web technologies for instant zero-config deployment on **Vercel Edge**.

---

## ⚡ Key Highlights & Core Portals

### 1. 🎮 Mind Games & Multiplayer Arcade
- **Grandmaster Chess (`/games/chess`)**:
  - Full FIDE chess rules with `chess.js` legal move validation, castling, en passant, pawn promotion.
  - **Vs Computer AI**: 3 difficulty levels (Novice, Club, and Minimax material/tactical evaluation).
  - **2-Player Pass & Play**: Local turn-based multiplayer.
  - Live algebraic move notation, captured pieces tray, undo move, Web Audio sounds.
- **Campus Ludo Royale (`/games/ludo`)**:
  - 4-color board (Red, Green, Yellow, Blue).
  - Play with 2 to 4 players or smart AI bots with automated tactical turns.
  - 3D-styled animated dice rolls, roll-6 release mechanics, safe squares, home run paths, and opponent knockouts!
- **Quantum Sudoku (`/games/sudoku`)**:
  - 3 difficulty levels (Easy, Medium, Hard).
  - 9x9 matrix with 3x3 box borders, pencil notes mode, hints, timer, error strike counter, and instant validation.
- **Speed Math Blitz (`/games/maths`)**:
  - 45-second arithmetic speed trial against the clock or against the **Quantum Cortex AI Rival**.
  - Addition, Subtraction, Multiplication, Division, and Mixed operations.
  - Flame streak multipliers ($2\times, 5\times, 10\times$), live score tracking, and confetti celebrations.

---

### 2. 🤝 Volunteering & Event Recruitment Portal (`/recruitment`)
- **DBUU Dance Ikon 2026 Core Volunteer Squad**:
  - Direct application flow for Uttarakhand's premier collegiate dance battle!
  - Roles available: Stage Operations & Green Room Manager, VIP Celebrity Escort, Sound & Console Crew, Media & Photography.
  - Official perks: **Approved Duty Leave (Attendance credit)**, verified leadership certificates, backstage VIP passes.
- **Organizer Desk (`/recruitment/post` & `/recruitment/manage`)**:
  - Student clubs and coordinators can post new volunteer requirements.
  - Review candidates, shortlist applicants, grant official duty leave approvals, and manage rosters.

---

### 3. 🎭 Cryptographic Anonymous Confession Wall (`/confessions`)
- **Zero Identity Leaks Guarantee**:
  - Personal student data (names, emails, roll numbers, IP addresses) are **strictly stripped** before database storage.
  - Inspect network requests in DevTools: author identity never exists in client or server JSON payloads.
  - Randomized Phantom Aliases (*e.g., Shivalik Falcon #42, Cipher Raven #88*).
- **Interactive Community Reactions**:
  - ❤️ Love, 😂 Laugh, ☕ Spilled Tea, 🫂 Support.
  - Anonymous threaded comments & whispers under each confession.

---

### 4. 📅 Campus Mega Events (`/events`)
- Detailed schedules, prize pools, and 1-click seat pass registrations for:
  - **DBUU Dance Ikon 2026** (Amphitheatre Battle)
  - **PINAK Techno-Cultural Fest 2026** (3-Day Hackathon & EDM Night)
  - **SPARDHA Olympic Sports League 2026**
  - **TEDxDBUU**

---

### 5. 📚 Academic Study Vault (`/vault`)
- Question papers (PYQs), solved lab manuals, syllabus handouts, and master revision notes.
- Categorized by **School of Engineering & Computing (SOEC)**, **School of Management & Commerce**, **School of Pharmacy**, and **School of Architecture & Design**.

---

### 6. 🪪 Student Digital Passport & Profile (`/profile`)
- DBUU Student ID card with level, XP ranking, unlocked badges (*Chess Grandmaster, Dance Ikon Volunteer, Speed Math Scribe*).
- Active event application status tracking and gameplay statistics.

---

### 7. 🧪 Vercel Concurrency & Load Stress Simulator (`/benchmark`)
- Built specifically to test student interactivity and how much concurrent load Vercel can handle during flash events (e.g., fest voting or audition openings).
- Configure concurrency workers (5 to 100 threads) and total request batches.
- Measures real-time latency (P50, max ms), throughput (req/sec), and serverless edge health.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom cyberpunk neon & glassmorphic themes
- **Icons**: [Lucide React](https://lucide.dev/)
- **Chess Engine**: `chess.js` for legal FIDE rule calculation
- **Audio Effects**: Native Web Audio API synthesizer (no external audio assets required)
- **Animations**: CSS keyframe glows, transitions, and `canvas-confetti`
- **Database / Storage**: Resilient hybrid architecture with in-memory persistence & MongoDB connector ready (`MONGODB_URI`).

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/DBUU-hub.git
cd DBUU-hub

# Install dependencies
npm install

# Start development server
npm run dev
# or run the production build
npm run build
npm run start
```
Visit `http://localhost:3000` in your browser.

---

## ☁️ One-Click Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset: **Next.js** (auto-detected).
4. *(Optional)* Add `MONGODB_URI` in Environment Variables if connecting to an external MongoDB Atlas cluster.
5. Click **Deploy** — your DBUU Hub will be live across Vercel Edge globally in ~60 seconds!
