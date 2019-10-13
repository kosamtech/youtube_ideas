const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

//Load model
require('../models/User');
const User = mongoose.model('users')

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register',(req, res) => {
  res.render('users/register');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/register', (req, res) => {
  // validate password
  let errors = [];

  if(req.body.password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'})
  }
  if(req.body.password !== req.body.password2) {
    errors.push({text: 'Password do not match'})
  }
  if(errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    // No duplicate user
    User.findOne({
      email: req.body.email
    })
    .then(user => {
      if(user) {
        req.flash('error', 'User already exists');
        res.redirect('/users/register')
      }
    })
    .catch(err => {
      if(err) throw err;
    });

    // Instance of new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;

        newUser.password = hash;
        //save to DB
        newUser.save()
        .then(() => {
          req.flash('success_msg', 'You are now registered and can login');
          res.redirect('/users/login');
        })
        .catch(err => {
          if(err) throw err;
        })
      })
    })
  }
});

//Logout 
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login')
})

module.exports = router;