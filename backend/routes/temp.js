const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jose = require('jose')

const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.use((req, res, next) => {
  if (['/signup', '/signin'].includes(req.path)) return next();

  // check jwt validation
  res.status(500).send({ message: 'invalid jwt. try again later.' })
  res.send({ message: 'getting to middleware of temp.js' })
});


router.get('/ping', async (req, res) => {
  const user = { id: 'user123', username: 'johndoe' };

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: process.env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(`${parseInt(process.env.JWT_DURATION)}s`)
    .sign(secret);

  res.cookie(process.env.JWT_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: parseInt(process.env.JWT_DURATION) * 1000,
  });

  res.send({ message: '/temp/ping:invoked' })
})

router.get('/verify', async (req, res) => {
  const token = req.cookies['token-2048'];
  if (!token) return res.status(401).send({ message: 'no token present. sign in.' });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token, secret);
    res.send({ ok: true });
  } catch (err) {
    res.status(401).send({ ok: false, message: 'Invalid or expired token' });
  }
});

router.get('/decode', async (req, res) => {
  const token = req.cookies['token-2048'];
  if (!token) return res.status(400).send({ message: 'No token' });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret);
    res.send({ payload });
  } catch (err) {
    res.status(400).send({ message: 'failed to decode token' });
  }
});

router.get('/demoin', (req, res) => {
  res.send({ message: '/temp/demoin:invoked' })
})

module.exports = router;