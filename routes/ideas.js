const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/login', (req, res) => {
  res.send('IDEAS');
});

module.exports  = router;