const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  duration: {
    type: Number,
    required: true
  },
  highestTileScore: {
    type: Number,
    required: true
  },
  moves: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model('score', scoreSchema);