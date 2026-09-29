# CrisisPilot — AI-Powered Sales Crisis Decision Platform
> *"Turn Sales Challenges Into Smart Decisions"*

CrisisPilot helps businesses make tactical decisions during sales and inventory crises by analyzing the current situation and learning from historical organizational decisions and their outcomes using **HindSight Persistent Memory**.

---

## 📁 Repository Structure

```
CrisisPilot/
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS v4 Frontend
│   ├── public/assets/            # AI Mascot & Pastel Landscape Graphics
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai-chat/          # Floating PilotBot conversational assistant
│   │   │   ├── common/           # ToastContainer, MascotBadge
│   │   │   ├── dashboard/        # Home dashboard widgets (Cards, Donut, Impact chart)
│   │   │   ├── decision-memory/  # Decision Memory flow visualization modal
│   │   │   ├── inventory/        # Inventory analytics & regional imbalance
│   │   │   ├── layout/           # Sidebar & Header components
│   │   │   ├── new-crisis/       # 5-step guided crisis creation wizard
│   │   │   ├── past-cases/       # Organizational Memory & post-mortems
│   │   │   ├── recommendations/  # 6-pillar transparent AI rationale
│   │   │   ├── reports/          # Executive printable analysis report
│   │   │   ├── settings/         # HindSight memory sensitivity configuration
│   │   │   └── simulations/      # Dynamic Strategy Simulator sandbox
│   │   ├── context/              # CrisisContext state management
│   │   ├── data/                 # Realistic enterprise mock scenarios
│   │   ├── types/                # TypeScript models
│   │   ├── App.tsx               # Main layout and routing
│   │   └── index.css             # Tailwind CSS v4 & custom pastel design system
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── data/                 # HindSight cases & crises database
│   │   ├── routes/               # API routes (crises, cases, simulate, chat)
│   │   ├── services/             # Simulator elasticity & HindSight retrieval engines
│   │   └── server.ts             # Express server setup & middleware
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                  # Root workspace configuration
└── README.md
```

---

## 🚀 Getting Started

### 1. Run Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be live at: `http://localhost:5173/`*

### 2. Run Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```
*Backend API will be live at: `http://localhost:5000/`*
*Health Check: `http://localhost:5000/api/health`*

---

## 🌐 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & indexed memory count |
| `GET` | `/api/crises` | List all active commercial crises |
| `GET` | `/api/crises/:id` | Fetch specific crisis details and breakdown |
| `POST` | `/api/crises` | Register new crisis and auto-generate HindSight strategy |
| `GET` | `/api/cases` | Search and filter 142 historical cases |
| `GET` | `/api/cases/:id` | Fetch complete post-mortem for a case |
| `POST` | `/api/simulate/run` | Run real-time price elasticity simulation |
| `POST` | `/api/chat` | Query PilotBot assistant with memory retrieval |

---

## 🎨 Visual Aesthetics & Design System
- **Pastel Color Palette**: Soft lavender, baby blue, peach, mint, and pink accents.
- **Typography**: Plus Jakarta Sans & Outfit.
- **Glass Cards**: Soft rounded corners, subtle shadows, gentle gradients, and micro-interactions.
- **Mascot Companion**: Custom 3D companion robot ("PilotBot") with conversational memory.
