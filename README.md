# KindredPal — Value-Based Connection Platform

Connect with people in your local community based on shared values, beliefs, and life stages.

## Features

- **Smart Matching** — Algorithm matches users based on values (religion, politics, environment, animals, fitness, learning), life stage, and connection goals
- **Swipe Discovery** — Card-based interface to find and connect with people nearby
- **Filters** — Filter discover results by location range, political beliefs, religion, and life stage
- **Real-Time Messaging** — Chat with matches using Socket.IO
- **Meetups** — Create and join local events with RSVP
- **Push Notifications** — Native push notifications via Expo + APNs
- **Cross-Platform** — Web app (React) + iOS mobile app (React Native / Expo)

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Backend  | Node.js, Express, MongoDB Atlas, Socket.IO, JWT   |
| Frontend | React, React Router, Axios                        |
| Mobile   | React Native, Expo SDK 54, EAS Build              |
| Email    | Resend API                                        |
| Security | Helmet, rate limiting, NoSQL injection protection |
| Hosting  | Railway (backend), Vercel (frontend)              |
| Database | MongoDB Atlas (M10 Dedicated, Cluster0)           |

---

## Option 1: Docker (Recommended — works on any machine)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Setup

```bash
git clone https://github.com/SarahSchoonmaker/KindredPal.git
cd KindredPal
```

Create `backend/.env` (see Environment Variables section below).

Then start everything:

```bash
docker-compose up --build
```

Open **http://localhost:3000** — backend runs on port 5000, frontend on port 3000.

### Docker Commands

| Command                           | Description                     |
| --------------------------------- | ------------------------------- |
| `docker-compose up --build`       | First run or after code changes |
| `docker-compose up`               | Start (already built)           |
| `docker-compose down`             | Stop all containers             |
| `docker-compose logs -f backend`  | Watch backend logs              |
| `docker-compose logs -f frontend` | Watch frontend logs             |

> **Note**: Mobile (Expo) is not Dockerized — run it natively (see Mobile section below).

---

## Option 2: Manual Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## Environment Variables

### `backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://user:pass@shard-00-00.xxx.mongodb.net:27017,shard-00-01.xxx.mongodb.net:27017,shard-00-02.xxx.mongodb.net:27017/kindred_db?ssl=true&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_here
CLIENT_URL=http://localhost:3000
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=KindredPal <noreply@kindredpal.com>
```

> **Local dev MongoDB note**: Some networks block SRV DNS (`mongodb+srv://`). Use the direct shard URI format above as a fallback. Railway uses `+srv` fine.

### `frontend/.env.local` (local dev — points to Railway)

```env
REACT_APP_API_URL=https://kindredpal-production.up.railway.app/api
REACT_APP_SOCKET_URL=https://kindredpal-production.up.railway.app
```

### `frontend/.env.production`

```env
REACT_APP_API_URL=https://kindredpal-production.up.railway.app/api
REACT_APP_SOCKET_URL=https://kindredpal-production.up.railway.app
```

---

## Deployment

### Backend — Railway

1. Connect GitHub repo to [Railway](https://railway.app)
2. Set root directory to `backend/`
3. Add all environment variables in Railway dashboard (use `mongodb+srv://` URI here)
4. Railway auto-deploys on every push to `main`

**Railway environment variables required:**

```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxx.mongodb.net/kindred_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=...
NODE_ENV=production
PORT=5000
CLIENT_URL=https://www.kindredpal.com
RESEND_API_KEY=re_...
FROM_EMAIL=KindredPal <noreply@kindredpal.com>
```

### Frontend — Vercel

1. Connect GitHub repo to [Vercel](https://vercel.com)
2. Set root directory to `frontend/`
3. Add production environment variables in Vercel dashboard
4. Vercel auto-deploys on every push to `main`

### Mobile — EAS + TestFlight

```bash
cd mobile

# Build for App Store
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios
```

---

## Email — Resend

Transactional email (password reset, welcome emails) uses [Resend](https://resend.com).

1. Create account at resend.com
2. Add and verify your domain (`kindredpal.com`)
3. Add DKIM records to your DNS (IONOS)
4. Copy API key → `RESEND_API_KEY` in environment variables

---

## API Reference

| Group    | Endpoint                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Auth     | `POST /api/auth/signup` `POST /api/auth/login` `GET /api/auth/profile`                                   |
| Users    | `GET /api/users/discover` `POST /api/users/like/:id` `POST /api/users/pass/:id` `GET /api/users/matches` |
| Messages | `GET /api/messages/conversations` `GET /api/messages/:userId` `POST /api/messages`                       |
| Meetups  | `GET /api/meetups` `POST /api/meetups` `POST /api/meetups/:id/rsvp`                                      |

---

---
