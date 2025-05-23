const Score = require('../models/Score');

const express = require('express');
const router = express.Router();

router.get('/ping', async (req, res) => {
  res.send({ 'ping': 'routes/score:invoked' })
})

router.post('/', async (req, res) => {
  try {
    const { duration, highestTileScore, moves } = req.body;
    const scoreEntry = new Score({
      userid: req.user.id,
      duration,
      highestTileScore,
      moves,
    });
    await scoreEntry.save();
    res.status(200).send({ scoreEntry });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'error saving score' });
  }
});

router.get('/user', async (req, res) => {
  try {
    const scoresLog = await Score.find({ userid: req.user.id }).sort({ startedAt: -1 })
    res.send(scoresLog);
  } catch (error) {
    res.status(500).send({ message: 'error retrieving scores of user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ highestTileScore: -1, moves: 1 })
      .limit(10)
      .populate('userid', 'username')
      .populate('userid', 'email');

    const leaderboard = topScores.map(score => ({
      username: score.userid.username,
      email: score.userid.email,
      highestTileScore: score.highestTileScore,
      duration: score.duration,
      moves: score.moves,
    }));

    res.status(200).send(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;