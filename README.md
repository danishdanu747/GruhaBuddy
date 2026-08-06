# 🏠 GruhaBuddy

**AI-powered interior design assistant** — chat with an AI to design your room, generate styled room previews, preview furniture in AR, and manage saved designs. Built with a vanilla JS frontend and a Flask backend, now connected to **Google Gemini** for real conversational AI.

---

## ✨ Features

- 💬 **AI Chat Assistant** — ask design questions and get real, Gemini-powered answers
- 🎨 **Structured Design Plans** — generates furniture lists, color themes, budget splits, layout tips, and before/after comparisons
- 📸 **Room Upload & Restyling** — upload a photo of your room and get AI-styled variations (modern, boho, minimalist, luxury, etc.)
- 🖼️ **Generate-from-scratch** — create styled room concepts without uploading a photo
- 📱 **AR Preview** — preview furniture overlays on a live camera feed
- 💾 **Saved Designs** — bookmark and revisit past designs
- 🔐 **Auth** — signup / login / guest mode
- 🌱 **Sustainability tips** baked into every design

---

## 🧱 Tech Stack

| Layer      | Tech                                                |
|------------|------------------------------------------------------|
| Frontend   | Vanilla JavaScript (SPA router), HTML5, CSS3          |
| Backend    | Python, Flask, Flask-CORS                            |
| Imaging    | Pillow (PIL)                                          |
| AI         | Google Gemini API (`gemini-3.5-flash`)                |
| Storage    | In-memory (demo) — swap in a real DB for production   |

---

## 📂 Project Structure

```
GruhaBuddy/
├── server.py              # Flask backend — auth, uploads, image styling, Gemini chat
├── requirements.txt       # Python dependencies
├── .env                   # <-- put your GEMINI_API_KEY here (not committed)
├── .env.example            # template for the above
├── index.html
├── css/                     # variables, base, components, chat, dashboard, etc.
├── js/
│   ├── api.js               # frontend API client (incl. API.chat())
│   ├── ai-engine.js          # local/deterministic design generator
│   ├── store.js              # app state (localStorage-persisted)
│   ├── router.js             # SPA router
│   ├── app.js                # entry point
│   └── pages/                 # chat, dashboard, onboarding, upload, camera, ar-view, etc.
├── uploads/                 # user-uploaded room photos
└── generated/                # AI-styled generated room images
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/GruhaBuddy.git
cd GruhaBuddy
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

> If your system requires it: `pip install -r requirements.txt --break-system-packages`

### 3. Add your Gemini API key

1. Get a free key at **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**
2. Copy `.env.example` to `.env` (or edit the existing `.env`)
3. Fill it in:

   ```
   GEMINI_API_KEY=AIzaSy...your_real_key...
   GEMINI_MODEL=gemini-3.5-flash
   ```

> ⚠️ Never commit your real `.env` file. It's already listed in `.gitignore`.

### 4. Run the server

```bash
python server.py
```

Then open **http://localhost:5000** in your browser — the frontend is served by the same Flask app.

---

## 🤖 How the Gemini Integration Works

- The chat page sends open-ended questions to `POST /api/chat`, which calls Gemini's `generateContent` API with a GruhaBuddy-specific system prompt (budget-conscious, renter-friendly interior design assistant persona) and your onboarding preferences (room type, size, budget, style) as context.
- Structured **design cards** (furniture list, budget split, layout tips, before/after) are generated **locally and deterministically** — fast, free, and always reliable, no API key needed.
- If `GEMINI_API_KEY` is missing or a Gemini call fails (no internet, invalid key, rate limit, etc.), the backend returns a friendly fallback message and the frontend silently falls back to built-in assistant logic — the app never breaks.
- Check `GET /api/health` — it returns `"geminiConnected": true/false` so you can confirm your key is working.

---

## 🔌 API Overview

| Method | Endpoint                        | Description                              |
|--------|----------------------------------|-------------------------------------------|
| POST   | `/api/auth/signup`               | Create an account                         |
| POST   | `/api/auth/login`                | Log in                                    |
| POST   | `/api/auth/guest`                | Guest login                               |
| GET/POST | `/api/preferences`             | Get/save user design preferences          |
| POST   | `/api/upload-room`               | Upload a room photo, get AI-styled versions |
| POST   | `/api/generate-room`             | Generate styled room concepts from scratch |
| POST   | `/api/chat`                      | Gemini-powered chat assistant             |
| POST   | `/api/camera/process-frame`      | AR-style furniture overlay on a frame     |
| GET/POST/DELETE | `/api/designs`           | Manage saved designs                      |
| GET    | `/api/health`                    | Server + Gemini connection status         |

---

## 🛠️ Environment Variables

| Variable          | Required | Default              | Description                          |
|--------------------|----------|------------------------|----------------------------------------|
| `GEMINI_API_KEY`    | Yes*     | —                       | Your Gemini API key (chat falls back to local logic if unset) |
| `GEMINI_MODEL`      | No       | `gemini-3.5-flash`     | Gemini model to use                    |

---

## 🗺️ Roadmap Ideas

- [ ] Persistent database (Postgres/SQLite) instead of in-memory storage
- [ ] Password hashing for real production auth
- [ ] Gemini-generated design cards (structured JSON) as an optional mode
- [ ] Real image-generation model for room restyling
- [ ] Deploy guide (Docker / Render / Railway)

---

## 📄 License

This project is provided as-is for educational/hackathon purposes. Add a license of your choice (MIT recommended) before publishing publicly.

---

## 🙌 Acknowledgements

Built with Flask, Pillow, and the Google Gemini API.
