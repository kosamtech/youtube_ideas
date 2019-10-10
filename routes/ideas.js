const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', (req, res) => {
  res.render('ideas/index');
});

module.exports  = router;