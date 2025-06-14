const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const User = require('../models/User');

const router = express.Router();
router.use(cookieParser());

router.get('/ping', async (req, res) => {
  res.send({ message: '/auth/ping:invoked' })
})

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(500).send({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).send({ message: 'Sign up success! Please Sign in' })
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong at server. Try again later.' });
    console.log(error)
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(500).send({ message: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(500).send({ message: 'Invalid credentials' });

    const payload = { id: user._id.toString(), username: user.username, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM, expiresIn: `2h` })

    res.cookie(process.env.JWT_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: parseInt(process.env.JWT_DURATION) * 60 * 60 * 1000,
    });
    res.status(200).send({ payload });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Something went wrong at our server. Try again later.' });
  }
});

router.get('/signout', async (req, res) => {
  try {
    res.clearCookie(process.env.JWT_NAME);
    res.send({ message: "You've been signed out" })
  } catch (error) {
    res.status(500).send({ message: 'Sign out failed. Try again later.' })
  }
})

router.get('/me', async (req, res) => {
  res.send({ ...req.user })
})

module.exports = router;