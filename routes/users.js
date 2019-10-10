const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.send('USERS');
});

module.exports = router;