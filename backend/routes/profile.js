const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Score = require('../models/Score');
const bcrypt = require('bcrypt');
const { formatDateTime } = require('../utils');

router.get('/ping', async (req, res) => {
  res.send({ message: '/profile/ping:invoked' })
})

router.get('/', async (req, res) => {
  try {
    let { _id: id, username, email, createdAt, updatedAt } = await User.findById(req.user.id)
      .select('_id username email createdAt updatedAt')
      .lean();

    createdAt = formatDateTime(createdAt)
    updatedAt = formatDateTime(updatedAt)

    const user = { id, username, email, createdAt, updatedAt }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

router.put('/', async (req, res) => {
  const { username, email } = req.body;
  try {
    let updatedUser = await User
      .findByIdAndUpdate(
        req.user.id,
        { $set: { username, email } },
        { new: true, runValidators: true }
      )
      .select('username email createdAt updatedAt');

    let createdAt = formatDateTime(updatedUser.createdAt)
    let updatedAt = formatDateTime(updatedUser.updatedAt)

    res.send({ username: updatedUser.username, email: updatedUser.email, createdAt, updatedAt });
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).send({ message: 'Email already in use' });
    } else {
      res.status(500).send({ message: 'Server error' });
    }
  }
});

router.put('/password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Incorrect password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    // res.clearCookie(process.env.JWT_NAME);
    return res.status(200).send({ message: 'Password updated successfully' });

  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'server error. try again later.' });
  }
})

router.delete('/', async (req, res) => {
  try {
    await Score.deleteMany({ userid: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie(process.env.JWT_NAME);
    res.send({ message: 'Account deleted successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: 'Server error' });
  }
});

module.exports = router;
