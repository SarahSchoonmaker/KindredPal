require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(async () => {
    console.log('Connected!');
    const Meetup = require('./models/Meetup');
    const meetups = await Meetup.find({ isActive: true })
      .populate('creator', 'name email')
      .populate('invitedUsers', 'name email');
    console.log('Total meetups:', meetups.length);
    meetups.forEach(m => {
      console.log('---');
      console.log('Title:', m.title);
      console.log('Creator:', m.creator?.name, m.creator?.email);
      console.log('Invited:', m.invitedUsers.map(u => u.email).join(', '));
    });
    mongoose.disconnect();
  })
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); });
