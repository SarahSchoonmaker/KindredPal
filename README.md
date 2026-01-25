# KindredPal - Value-Based Connection Platform

A full-stack web and mobile application that connects people based on shared values, beliefs, and life stages in their local community.

## Features

### User Features

- **Value-Based Matching**: Smart algorithm matches users based on values (religion, politics, environment, animals, fitness, learning)
- **Life Stage Filtering**: Connect with people in similar life stages (single, married, retired, student, etc.)
- **Swipe Discovery**: Tinder-style interface to discover potential matches
- **Real-Time Messaging**: Chat with matches using Socket.io
- **Profile Management**: Create and edit comprehensive profiles
- **Match Notifications**: Get notified when you have a mutual match

### Technical Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- Real-time messaging with Socket.io
- React frontend with React Router
- Responsive design for mobile and desktop
- Password hashing with bcrypt

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io-client** - Real-time client
- **Lucide React** - Icons

## Project Structure

```
kindred-circle/
├── backend/
│   ├── models/
│   │   ├── User.js           # User model with matching algorithm
│   │   └── Message.js        # Message model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User discovery & matching
│   │   └── messages.js       # Messaging routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Express server with Socket.io
│   ├── seedData.js           # Database seeding script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js     # App layout with navigation
│   │   ├── pages/
│   │   │   ├── Landing.js    # Landing page
│   │   │   ├── Login.js      # Login page
│   │   │   ├── Signup.js     # Multi-step signup
│   │   │   ├── Discover.js   # Swipe discovery
│   │   │   ├── Matches.js    # View all matches
│   │   │   ├── Messages.js   # Real-time chat
│   │   │   └── Profile.js    # Profile view/edit
│   │   ├── context/
│   │   │   └── AuthContext.js # Global auth state
│   │   ├── services/
│   │   │   ├── api.js        # API service
│   │   │   └── socket.js     # Socket.io service
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kindred-circle
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

5. (Optional) Seed the database with sample users:

```bash
npm run seed
```

6. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your configuration:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Test Accounts (after seeding)

```
Email: sarah@example.com
Password: password123

Email: marcus@example.com
Password: password123

Email: elena@example.com
Password: password123

Email: david@example.com
Password: password123
```

### Creating a New Account

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Complete the 4-step signup process:
   - Step 1: Account credentials
   - Step 2: Personal information
   - Step 3: Life stage and goals
   - Step 4: Value importance ratings

### Using the App

1. **Discover**: Swipe through potential matches. Like or pass on profiles.
2. **Matches**: View all your mutual matches.
3. **Messages**: Chat in real-time with your matches.
4. **Profile**: View and edit your profile information.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

### Users

- `GET /api/users/discover` - Get potential matches
- `POST /api/users/like/:userId` - Like a user
- `POST /api/users/pass/:userId` - Pass on a user
- `GET /api/users/matches` - Get all matches
- `GET /api/users/:userId` - Get user by ID

### Messages

- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:userId` - Get messages with a user
- `POST /api/messages/:userId` - Send a message
- `PUT /api/messages/:messageId/read` - Mark message as read

## Matching Algorithm

The app uses a weighted scoring system to calculate match compatibility:

- **Values** (40%): Matches based on importance ratings of 6 core values
- **Life Stage** (40%): Matches based on current life circumstances
- **Looking For** (20%): Matches based on connection goals

Match scores range from 0-100%, with higher scores indicating better compatibility.

## Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm start  # React development server with hot reload
```

## Building for Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kindred-circle
JWT_SECRET=your_secure_secret
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

### Frontend (.env)

```
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## Deployment Considerations

### Backend Deployment

- Use environment variables for sensitive data
- Set up MongoDB Atlas for cloud database
- Use a process manager like PM2
- Configure CORS for your frontend domain
- Use HTTPS in production
- Set up rate limiting for API endpoints

### Frontend Deployment

- Build the production bundle
- Deploy to services like Vercel, Netlify, or AWS S3
- Configure environment variables
- Set up custom domain

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Photo upload and management
- [ ] Advanced filters (age range, distance)
- [ ] Block and report users
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Video chat integration
- [ ] Event creation and RSVP
- [ ] Admin dashboard

## License

MIT License - feel free to use this project for learning or as a foundation for your own application.

## Support

For issues or questions, please open an issue in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
