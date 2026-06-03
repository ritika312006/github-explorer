# GitExplorer 🔍

A full-stack GitHub profile and repository explorer built with React + Node.js.
Search any GitHub username to explore their profile, repositories, language breakdown, and trending repos.

## 🔗 Live Demo
https://github-explorer-eight-beige.vercel.app

---

## ✨ Features

- 🔍 Search any GitHub username
- 👤 Profile card — avatar, bio, followers, following, repos count
- 🥧 Language pie chart across all repos
- 📊 Top repos bar chart by stars
- 📋 Repo list with sort (stars, name, forks, updated) and filter
- 📌 Pin favourite repos (saved to localStorage)
- 🔥 Trending repos on homepage (most starred this week)
- ⚡ Server-side caching — same username within 60s returns instantly
- 💾 Recently searched users (saved to localStorage)
- ⚠️ Graceful error handling — rate limit, user not found, network errors
- 💀 Skeleton loading states

---

## 🛠️ Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | React + Vite | Fast, modern, functional components with hooks |
| Backend | Node.js + Express | Simple REST API proxy |
| Charts | Recharts | Easy, beautiful React charts |
| HTTP Client | Axios | Clean API calls with error handling |
| Cache | In-memory (Map) | Avoid GitHub rate limits, fast responses |
| Styling | Plain CSS with CSS variables | No extra dependencies, full control |

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js v18+ installed
- A GitHub Personal Access Token (free, takes 2 minutes)

### Step 1 — Get a GitHub Token
1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Give it a name e.g. `git-explorer`
4. Set expiry to **90 days**
5. **Do not select any scopes** — scroll straight to bottom
6. Click **Generate token**
7. Copy the token (starts with `ghp_...`)

> Without a token you get 60 requests/hour. With a token you get 5000/hour.

### Step 2 — Clone & Install

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/github-explorer.git
cd github-explorer

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Step 3 — Configure Environment

```bash
# Inside the server folder create a .env file
cd server
cp .env.example .env
```

Open `server/.env` and add your token:
