const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL, credentials: true }));
app.use(cookieParser())

app.use(async (req, res, next) => {
  if (req.path.endsWith('/ping')) return next()
  if (req.path.endsWith('favicon.ico')) return next()
  if (['/auth/signup', '/auth/signin'].includes(req.path)) return next()

  const token = req.cookies[process.env.JWT_NAME];
  if (!token) return res.status(400).send({ message: 'No token present. Sign in' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch (error) {
    console.log(error)
    // res.clearCookie(process.env.JWT_NAME);
    res.cookie(process.env.JWT_NAME, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      // expires: new Date(0),  // ✅ better than maxAge: 0
    });
    res.status(400).send({ message: 'Invalid or expired token. Sign in again.' });
  }
})

app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
app.use('/scores', require('./routes/scores'))

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/ping', async (req, res) => {
  res.send({ message: 'index/ping:invoked' })
})

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;