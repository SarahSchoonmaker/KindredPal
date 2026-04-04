# KindredPal

**Community-centered peer support platform connecting people through shared life experiences.**

KindredPal helps people find their people — through support groups, local meetups, and genuine connections built on common values, life stages, and challenges. Available on web and iOS.

---

## 📱 Platform Overview

| Surface | Technology | Hosting |
|---|---|---|
| iOS Mobile | React Native (Expo) | TestFlight |
| Web App | React 18, React Router | Vercel |
| Backend API | Node.js, Express | Railway |
| Database | MongoDB Atlas, Mongoose | Atlas Cloud |
| Real-time | Socket.IO | Railway |
| Media | Cloudinary | Cloud |
| Email | Resend | Cloud |

---

## ✨ Features

### 👥 Community Groups
- **Discover** — Browse public groups by category, keyword, city, state, or distance
- **Create** — Start a group with name, category, location, and privacy setting
- **My Groups** — Dedicated tab showing groups you've joined or created
- **Group Chat** — Real-time messaging for group members via Socket.IO
- **Members** — View all members, send connection requests, or message directly
- **Invitations** — Admins can invite connections to private groups
- **Edit & Delete** — Group admins can edit details; creators can delete

### 🤝 Connections
- Send connection requests to people you share a group with
- Accept, decline, or ignore incoming requests
- View your connections list with profile photos and bios
- Message any connection directly
- Navigate to a connection's full profile

### 📅 Meetups
- Create in-person or virtual meetups and invite your connections
- RSVP Going / Maybe / Not Going
- Guest list with organizer shown first
- Email and push notifications for new invites
- My Groups widget on Meetups tab refreshes on every focus

### 💬 Messaging
- Real-time direct messages between connected users
- Group chat per community group
- Unread badge counts updated every 30 seconds and on app foreground

### 👤 Profiles
- Profile photo (Cloudinary upload)
- Life stage, family situation, core values (up to 3)
- Faith, political beliefs, bio, location
- Push notification preferences

### 🔔 Notifications
- Expo push notifications for meetup invites and new connections
- Email notifications via Resend for group invites, meetup invites, password reset
- Tab bar badges for messages, meetup invites, group invites, connection requests

---

## 🗂 Group Categories

| | | |
|---|---|---|
| 🤲 Caregiver Support | 🌿 Grief & Loss | 🍃 Sober & Clean Living |
| 👶 New Parent Support | 🎗️ Chronic Illness Support | 🧘 Anxiety & Mental Wellness |
| 🎖️ Veteran Support | 🌻 Senior Wellness | 💙 Loneliness & Social Connection |
| 🌱 Divorce Recovery | 🙏 Faith & Spiritual Support | 🔄 Life Transitions |
| 🕊️ Trauma Recovery | 💛 Cancer Support | 👨‍👧 Single Parent Support |
| ⭐ Addiction Recovery | 🦋 Autism & Special Needs Families | 🌟 Singles Social Support |
| 💑 Married No Kids | 💼 Career Change Support | 💰 Financial Recovery |
| 🏃 Sports & Fitness | 🎯 Local Activity Groups | |

---

## 🏗 Architecture

### Navigation Structure (Mobile)

```
Root Stack Navigator
├── Login / Signup
├── MainTabs (Bottom Tab Navigator)
│   ├── Groups        ← Discover + My Groups tabs
│   ├── Connections   ← My connections + pending requests
│   ├── Messages      ← Direct message conversations
│   ├── Meetups       ← Upcoming meetups + My Groups widget
│   └── Profile       ← Edit profile, settings
├── GroupDetail
├── CreateGroup
├── MemberProfile
├── UserProfile
├── Chat
├── MeetupDetails
├── EditProfile
├── Preferences
├── BlockedUsers
└── WebView
```

### State Management Pattern

KindredPal uses local React state with an **optimistic-update + route params** pattern:

- **Optimistic updates** — UI updates instantly from local data, then a delayed server fetch confirms after 1–1.5s
- **Route params for cross-screen updates** — after create/edit/delete, screens navigate back with `newGroup` / `updatedGroup` / `deletedGroupId` params; `GroupsScreen` patches both Discover and My Groups lists immediately
- **`useFocusEffect`** — every tab screen re-fetches on focus so data stays current
- **`filtersRef` pattern** — filter state lives in a `useRef` so `fetchGroups` has stable `[]` deps and never recreates

### Key Navigation Note

Screens inside `MainTabs` cannot directly reach root stack screens with plain `navigation.navigate()`. Use either:

```js
// From a tab screen → root stack screen
navigation.getParent()?.navigate("MemberProfile", { userId });

// From a root stack screen → back to a tab with params
navigation.navigate("MainTabs", {
  screen: "Groups",
  params: { updatedGroup: {...}, timestamp: Date.now() },
});
```

---

## 🛠 Tech Stack

```
Mobile      React Native (Expo SDK)
            React Navigation v6 (native stack + bottom tabs)
            React Native Paper, Lucide React Native
            Expo SecureStore, Expo Notifications

Web         React 18, React Router
            CSS Modules, Lucide React

Backend     Node.js, Express
            Mongoose (MongoDB ODM)
            Socket.IO (real-time messaging)
            JWT authentication
            Helmet, express-rate-limit, express-mongo-sanitize

Services    MongoDB Atlas
            Cloudinary (media storage)
            Resend (transactional email)
            Railway (backend hosting)
            Vercel (web hosting)
            EAS Build (iOS builds)
```

---

## 📡 API Reference

All routes require `Authorization: Bearer <token>` except `/api/auth/*`.

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `POST` | `/api/auth/forgot-password` | Send reset email |
| `POST` | `/api/auth/reset-password` | Reset with token |
| `GET` | `/api/groups` | Discover public groups (filterable) |
| `GET` | `/api/groups/my` | Groups current user has joined/created |
| `GET` | `/api/groups/my-invites` | Pending group invitations |
| `GET` | `/api/groups/:id` | Single group detail |
| `POST` | `/api/groups` | Create a group |
| `PUT` | `/api/groups/:id` | Edit group (admin only) |
| `DELETE` | `/api/groups/:id` | Soft-delete group (creator only) |
| `POST` | `/api/groups/:id/join` | Join or request to join |
| `POST` | `/api/groups/:id/leave` | Leave a group |
| `POST` | `/api/groups/:id/invite/:userId` | Invite a connection |
| `POST` | `/api/groups/:id/rsvp-invite` | Accept/maybe/decline invite |
| `GET` | `/api/groups/:id/members` | List group members |
| `GET` | `/api/connections` | My accepted connections |
| `GET` | `/api/connections/requests` | Pending requests received |
| `POST` | `/api/connections/request/:userId` | Send connection request |
| `POST` | `/api/connections/accept/:id` | Accept a request |
| `POST` | `/api/connections/decline/:id` | Decline a request |
| `DELETE` | `/api/connections/:id` | Remove a connection |
| `GET` | `/api/connections/status/:userId` | Check connection status |
| `GET` | `/api/meetups` | My meetups |
| `POST` | `/api/meetups` | Create a meetup |
| `PUT` | `/api/meetups/:id` | Edit meetup |
| `DELETE` | `/api/meetups/:id` | Delete meetup |
| `POST` | `/api/meetups/:id/rsvp` | RSVP to a meetup |
| `GET` | `/api/users/profile/:userId` | Get any user's profile |
| `PUT` | `/api/users/profile` | Update current user's profile |
| `GET` | `/api/users/counts` | Badge counts (messages, invites, requests) |
| `GET` | `/api/messages/conversations` | All direct message conversations |
| `GET` | `/api/messages/:userId` | Messages with a specific user |
| `POST` | `/api/messages` | Send a direct message |
| `GET` | `/api/groups/:groupId/messages` | Group chat messages |
| `POST` | `/api/groups/:groupId/messages` | Send group chat message |

---

## 🗃 Data Models

### User
```
name, email, password (bcrypt)
age, bio, profilePhoto, additionalPhotos
city, state, latitude, longitude
religion (String), politicalBeliefs (String)
lifeStage ([String]), familySituation ([String]), coreValues ([String], max 3)
causes ([String])
likes, passed, matches, blockedUsers (ObjectId refs)
pushTokens, emailNotifications
isVerified, onboardingComplete, isActive, isDeleted
```

### Group
```
name, description, category
city, state, isNationwide, isPrivate
coverPhoto, tags
createdBy, members, admins (User refs)
pendingRequests, invitedUsers, maybeUsers
isActive (soft delete), isSeeded, memberCount
```

### Connection
```
from, to (User refs — unique pair)
status: 'pending' | 'accepted' | 'declined'
message (optional), sharedGroupId
```

### Meetup
```
title, description, dateTime
location: { address, city, state, zipCode }
creator, invitedUsers (User refs)
rsvps: [{ user, status: 'going' | 'maybe' | 'not-going' }]
maxAttendees, isActive
```

---

## 🚀 Deployment

### Backend (Railway)
Auto-deploys from GitHub `main`. Set environment variables in Railway dashboard.

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
CLIENT_URL=
NODE_ENV=production
PORT=                   # set automatically by Railway
```

### Web (Vercel)
Auto-deploys from GitHub `main`. Set `REACT_APP_API_URL` in Vercel dashboard.

### Mobile (EAS)
```bash
npx eas build --platform ios --profile preview
```
Submit to TestFlight after build completes.

---

## 💻 Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your env vars
npm run dev            # runs on :5000

# Web
cd web
npm install
npm start              # runs on :3000

# Mobile (phone on same WiFi)
cd mobile
npm install
npx expo start --lan

# Mobile (different network)
npx expo start --tunnel
```

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| Authentication | JWT, 7-day expiry, verified on every protected route |
| Passwords | bcrypt, 12 salt rounds |
| Rate limiting | 500 req/15min general · 10 req/15min auth · 20 req/15min profile |
| NoSQL injection | `express-mongo-sanitize` strips `$` and `.` from request bodies |
| HTTP hardening | Helmet — CSP, X-Frame-Options, HSTS, and more |
| CORS | Explicit allowlist — kindredpal.com, Vercel preview URLs, localhost |
| Soft deletes | Users and groups use `isDeleted`/`isActive` flags, never hard-deleted |
| Connection gating | Users must share an active group before sending a connection request |

---

## 📁 Project Structure

```
KindredPal/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Group.js
│   │   ├── Connection.js
│   │   ├── Meetup.js
│   │   ├── Message.js
│   │   └── GroupMessage.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── groups.js
│   │   ├── connections.js
│   │   ├── meetups.js
│   │   ├── messages.js
│   │   └── group-messages.js
│   ├── services/
│   │   └── notificationService.js
│   └── server.js
├── mobile/
│   └── src/
│       ├── screens/
│       │   ├── GroupsScreen.js
│       │   ├── GroupDetailScreen.js
│       │   ├── CreateGroupScreen.js
│       │   ├── ConnectionsScreen.js
│       │   ├── MemberProfileScreen.js
│       │   ├── MeetupsScreen.js
│       │   ├── MeetupDetailsScreen.js
│       │   ├── MessagesScreen.js
│       │   ├── ChatScreen.js
│       │   ├── ProfileScreen.js
│       │   ├── EditProfileScreen.js
│       │   └── ...
│       ├── services/
│       │   └── api.js
│       └── context/
│           └── SocketContext.js
└── web/
    └── src/
        ├── pages/
        └── services/
            └── api.js
```

---

