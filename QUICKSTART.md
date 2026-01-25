# KindredPal - Quick Start Guide

Get your KindredPal app running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js installed (v14+) - Check with: `node --version`
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ npm installed - Check with: `npm --version`

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install MongoDB (if needed)

**Option A: Local MongoDB**

- macOS: `brew install mongodb-community`
- Ubuntu: `sudo apt-get install mongodb`
- Windows: Download from mongodb.com

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at mongodb.com/atlas
2. Create a cluster
3. Get connection string

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (takes ~1 minute)
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your MongoDB URI
# For local: MONGODB_URI=mongodb://localhost:27017/kindred-circle
# For Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kindred-circle

# Seed database with sample users
npm run seed

# Start backend server
npm run dev
```

✅ Backend should now be running on http://localhost:5000

### Step 3: Frontend Setup (New Terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (takes ~1 minute)
npm install

# Create environment file
cp .env.example .env

# Start frontend
npm start
```

✅ Frontend should now open automatically at http://localhost:3000

## 🎉 You're Ready!

### Test Login Credentials:

```
Email: sarah@example.com
Password: password123
```

OR create your own account by clicking "Sign Up"

## 📱 Using the App

1. **Landing Page** → Click "Sign Up" or "Log In"
2. **Discover** → Swipe through profiles (❤️ Like or ✕ Pass)
3. **Matches** → View mutual matches
4. **Messages** → Chat in real-time with matches
5. **Profile** → Edit your profile anytime

## 🔧 Common Issues

### Backend won't start

- ✅ Check MongoDB is running: `mongosh` or check Atlas connection
- ✅ Verify .env file has correct MONGODB_URI
- ✅ Check port 5000 is not in use: `lsof -i :5000`

### Frontend won't start

- ✅ Check backend is running first
- ✅ Verify .env has correct API URLs
- ✅ Clear cache: `npm start -- --reset-cache`

### Can't login

- ✅ Make sure you ran `npm run seed` in backend
- ✅ Check browser console for errors (F12)
- ✅ Verify backend logs show successful API calls

### No profiles showing

- ✅ Run seed script to add sample users: `npm run seed`
- ✅ Make sure you're logged in
- ✅ Check you haven't liked/passed all users already

## 📚 Next Steps

### Development Mode

Both servers will auto-reload on file changes:

- Backend: Edit files in `backend/` folder
- Frontend: Edit files in `frontend/src/` folder

### Testing Real-Time Chat

1. Open two browser windows
2. Login as different users in each
3. Like each other to create a match
4. Go to Messages and start chatting!

### Adding More Users

Create new accounts or modify `backend/seedData.js` to add more sample users.

## 🎯 Features to Try

1. **Smart Matching**: Notice how match scores are calculated
2. **Daily Limits**: Try liking more than 10 users in one day
3. **Real-Time Chat**: Messages appear instantly without refresh
4. **Profile Editing**: Update your values and see match scores change
5. **Typing Indicators**: See when someone is typing

## 🚀 Production Deployment

Ready to deploy? Check the main README.md for:

- MongoDB Atlas setup
- Heroku/DigitalOcean deployment
- Frontend hosting on Vercel/Netlify
- Environment variable configuration
- Security best practices

## 💡 Pro Tips

- Keep both terminal windows open to see logs
- Use Chrome DevTools (F12) to debug issues
- Check Network tab for API request/response
- MongoDB Compass is great for viewing database

## 📞 Need Help?

- Check console logs in both terminals
- Review the main README.md for detailed docs
- Check the API endpoints in Postman/Insomnia
- Look at browser console (F12) for frontend errors

---

**Happy connecting! 🎉**

Built with ❤️ for meaningful connections.
