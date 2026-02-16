# KindredPal - Value-Based Connection Platform

Connect with people in your local community based on shared values, beliefs, and life stages.

## Features

- **Smart Matching**: Algorithm matches users based on values (religion, politics, environment, animals, fitness, learning), life stage, and connection goals
- **Swipe Discovery**: Tinder-style interface to find matches
- **Real-Time Messaging**: Chat with matches using Socket.io
- **Meetups**: Create and join local events with RSVP
- **Cross-Platform**: Web app and React Native mobile app

## Tech Stack

**Backend**: Node.js, Express, MongoDB Atlas, Socket.io, JWT auth  
**Frontend**: React, React Router, Axios  
**Mobile**: React Native, Expo  
**Security**: Helmet, rate limiting, NoSQL injection protection

## Quick Start

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kindredpal?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

```bash
npm start
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

## MongoDB Atlas Setup

1. **Network Access**: Add `0.0.0.0/0` to IP whitelist
2. **Database User**: Create user with "Read and write" privileges
3. **Connection String**: Use in `MONGODB_URI`

**VPN Note**: Disconnect VPN for local development or configure split tunneling for `*.mongodb.net`

## API Endpoints

**Auth**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`  
**Users**: `/api/users/discover`, `/api/users/like/:userId`, `/api/users/matches`  
**Messages**: `/api/messages/:userId`, `/api/messages/conversations`  
**Meetups**: `/api/meetups`, `/api/meetups/:meetupId/rsvp`

## Deployment

**Frontend**: https://www.kindredpal.com (Vercel)  
**Backend**: https://kindredpal-production.up.railway.app (Railway)  
**Database**: MongoDB Atlas

## Roadmap Ahead

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Admin dashboard
