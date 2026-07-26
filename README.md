# 🥗 EatWise — AI-Powered Nutrition Tracking App

EatWise is a full-stack nutrition tracking app with AI-powered food label analysis (OCR + Groq LLaMA), calorie tracking, personalized health insights, and user profiles.

---

## 📁 Project Structure

```
eatwise-app/
├── backend/
│   ├── config/
│   │   └── .env                  # Environment variables (NOT committed to git)
│   ├── services/
│   │   ├── ai.service.js         # Groq AI integration
│   │   ├── image.service.js      # Image handling
│   │   └── ocr.service.js        # Tesseract OCR
│   ├── server.js                 # Main Express server
│   ├── eng.traineddata           # Tesseract English model
│   └── package.json
├── frontend/
│   ├── public/                   # HTML pages served statically
│   │   ├── index.html            # Signup page
│   │   ├── login.html
│   │   ├── details.html          # Profile setup
│   │   ├── dashboard.html        # Main app dashboard
│   │   └── profile/
│   │       └── profile.html
│   ├── scripts/                  # Client-side JavaScript
│   └── styles/                   # CSS stylesheets
├── assets/                       # Static assets
├── .gitignore
├── package.json                  # Root-level scripts
└── README.md
```

---

## 🔧 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Backend    | Node.js + Express.js          |
| Database   | MongoDB Atlas (via Mongoose)  |
| AI         | Groq API (LLaMA 3.1-8B)      |
| OCR        | Tesseract.js                  |
| File Upload| Multer                        |
| Auth       | bcryptjs                      |
| Frontend   | Vanilla HTML + CSS + JS       |
| Charts     | Chart.js                      |

---

## ⚙️ Prerequisites

Before setting up the project, make sure you have:

- [Node.js](https://nodejs.org/) v16 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and cluster
- A [Groq API Key](https://console.groq.com/) (free tier available)

---

## 🛠️ Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/eatwise-app.git
cd eatwise-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Set up environment variables

Create/edit the file at `backend/config/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/eatwise?retryWrites=true&w=majority
PORT=5000
```

> ⚠️ **Never commit this file to GitHub.** It is already excluded via `.gitignore`.

### 4. Start the development server

From the **root** of the project:

```bash
npm start
```

Or, for auto-restart on code changes:

```bash
cd backend
npm run dev
```

### 5. Open in browser

```
http://localhost:5000/public/index.html
```

---

## 🌐 API Endpoints

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/signup`        | Register a new user                |
| POST   | `/login`         | Authenticate user                  |
| POST   | `/save-profile`  | Save/update user health profile    |
| POST   | `/get-profile`   | Retrieve user profile              |
| POST   | `/ask-ai`        | Chat with AI nutrition assistant   |
| POST   | `/analyze-image` | Upload food label image for OCR+AI |

---

## 🚀 Deployment Guide

### Option A — Deploy to Render (Recommended, Free Tier)

1. **Push your code to GitHub** (make sure `.gitignore` is committed first):

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [https://render.com](https://render.com) and create a new **Web Service**.

3. Connect your GitHub repository.

4. Configure the service:
   - **Root Directory:** `backend` (or leave empty if using root `package.json`)
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`
   - **Environment:** `Node`

5. Add **Environment Variables** in the Render dashboard:
   ```
   GROQ_API_KEY     = your_groq_api_key
   MONGO_URI        = your_mongodb_atlas_connection_string
   PORT             = 10000   (Render assigns this automatically)
   ```

6. Click **Deploy**. Render will build and host your app.

7. Your app URL will be something like:
   ```
   https://eatwise-app.onrender.com/public/index.html
   ```

---

### Option B — Deploy to Railway

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.

2. Click **New Project → Deploy from GitHub repo**.

3. Select your repository.

4. Add environment variables under the **Variables** tab:
   ```
   GROQ_API_KEY
   MONGO_URI
   ```

5. Set the start command to:
   ```
   node backend/server.js
   ```

6. Railway will auto-detect the Node.js runtime and deploy.

---

### Option C — Deploy to a VPS (e.g. AWS EC2 / DigitalOcean)

1. SSH into your server and clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/eatwise-app.git
   cd eatwise-app
   ```

2. Install dependencies:
   ```bash
   cd backend && npm install
   ```

3. Create the `.env` file manually:
   ```bash
   nano backend/config/.env
   ```

4. Install PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name eatwise
   pm2 save
   pm2 startup
   ```

5. (Optional) Set up **Nginx** as a reverse proxy to forward port 80 to `5000`.

---

## 🔐 Environment Variables Reference

| Variable     | Required | Description                             |
|--------------|----------|-----------------------------------------|
| `GROQ_API_KEY` | ✅ Yes  | Your Groq API key for AI analysis       |
| `MONGO_URI`  | ✅ Yes   | MongoDB Atlas connection string         |
| `PORT`       | Optional | Port to run the server (default: 5000)  |

---

## 🗃️ MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 — always free)
3. Create a database user under **Database Access**
4. Whitelist your IP (or use `0.0.0.0/0` for all IPs in production)
5. Click **Connect → Connect your application** and copy the connection string
6. Replace `<password>` with your user's password and paste it into `MONGO_URI`

---

## 🔑 Groq API Key Setup

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys → Create API Key**
4. Copy the key and add it as `GROQ_API_KEY` in your `.env`

---

## 📦 Building for Production

This project serves the frontend statically from the Express backend. No build step is required. Just ensure the backend `server.js` is running and it will serve all pages from `frontend/`.

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| `MongoDB error ❌` on startup | Check your `MONGO_URI` in `.env` and whitelist your IP in Atlas |
| `Groq API Key Loaded: false` | Make sure `.env` has `GROQ_API_KEY` and dotenv path is correct |
| Port `5000` already in use | Set `PORT=5001` before starting: `PORT=5001 npm start` |
| Food label OCR not working | Ensure `eng.traineddata` file exists in the `backend/` directory |
| CORS errors in browser | Confirm frontend requests use the same origin or update CORS config |

---

## 🤝 Contributing

This is a personal project. Feel free to fork and customize it for your own use.

---

## 📄 License

ISC
