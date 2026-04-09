# 🔥 BurnAware

**BurnAware** is a burnout prediction and prevention web application that helps users monitor their mental wellness, track mood and stress, set wellbeing goals, and chat with an AI wellness assistant.

---

## ✨ Features

- 🧠 **Burnout Risk Prediction** — ML-powered model scores your burnout risk based on sleep, stress, workload, and more
- 💬 **AI Chatbot (Ember)** — Empathetic wellness assistant powered by Google Gemini 2.0 Flash
- 📊 **Dashboard** — Visual charts for burnout scores, sleep/stress trends, and history
- 😊 **Mood Tracker** — Log your daily mood with emoji-based input
- 🎯 **Goal Tracker** — Set and track personal wellbeing goals
- 🏆 **Gamification** — Earn points and level up as you engage with your wellness
- 🌟 **Landing Page** — Onboarding flow with stress questionnaire

---

## 🛠 Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Landing Page | React + Vite + Tailwind CSS            |
| Frontend     | Next.js 16 + TypeScript + Tailwind CSS |
| Backend      | FastAPI + SQLAlchemy + SQLite          |
| ML Model     | scikit-learn (burnout classifier)      |
| AI Chatbot   | Google Gemini API (`gemini-2.0-flash`) |
| Animations   | Framer Motion                          |
| Charts       | Recharts                               |

---

## 📁 Project Structure

```
burnaware/
├── landing/          # Vite + React landing page & onboarding questionnaire
├── frontend/         # Next.js dashboard application
└── backend/          # FastAPI REST API
    ├── routes/       # API route handlers
    ├── models/       # SQLAlchemy database models
    ├── schemas/      # Pydantic request/response schemas
    ├── services/     # Business logic & database service layer
    ├── chatbot/      # Gemini-powered chatbot engine + memory
    ├── ml/           # ML prediction utilities
    ├── training.py   # Model training script
    └── main.py       # FastAPI app entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

**`.env` configuration:**

```env
DATABASE_URL=sqlite:///./burnaware.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=your-gemini-api-key-here
```

```bash
# Start the backend server
uvicorn main:app --reload --port 10000
```

API will be available at `http://localhost:10000`  
Interactive docs: `http://localhost:10000/docs`

---

### 2. Frontend Setup (Dashboard)

```bash
cd frontend

npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:10000
```

```bash
npm run dev
```

Dashboard available at `http://localhost:3000`

---

### 3. Landing Page Setup

```bash
cd landing

npm install
npm run dev
```

Landing page available at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| `POST` | `/api/users/register`      | Register a new user          |
| `POST` | `/api/users/login`         | Login and get JWT token      |
| `POST` | `/api/predictions/predict` | Submit burnout prediction    |
| `GET`  | `/api/predictions/history` | Get prediction history       |
| `POST` | `/api/chatbot/chat`        | Send a message to Ember      |
| `POST` | `/api/mood/log`            | Log a mood entry             |
| `GET`  | `/api/mood/history`        | Get mood history             |
| `GET`  | `/api/gamification/score`  | Get current score & level    |
| `POST` | `/api/gamification/award`  | Award points for an activity |

---

## 🤖 Chatbot — Ember

Ember is the empathetic wellness assistant powered by **Google Gemini 2.0 Flash**. It adapts its tone based on the user's current mood and stress level, providing warm, concise, human-like support.

- Context-aware: knows the user's name, mood, and stress level
- Keeps responses to 2–3 sentences for a natural feel
- Prioritises emotional validation over advice when stress is high
- Falls back gracefully if the API is unavailable

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
python -m pytest

# Individual test files
python test_api.py
python test_chatbot.py
python test_prediction.py
```

---

## 📦 Deployment

- **Backend** → [Render](https://render.com) (see `RENDER_COLD_START_FIX.md`)
- **Frontend** → [Vercel](https://vercel.com) (see `VERCEL_DEPLOYMENT.md`)
- **Landing** → Vercel or any static host

---

## 📄 License

This project is for educational and personal use.
