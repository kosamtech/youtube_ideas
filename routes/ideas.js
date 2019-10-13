const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', (req, res) => {
  Idea.find({})
  .sort({date: 'desc'})
  .then(ideas => {
    res.render('ideas/index', {
      ideas: ideas
    })
  })
  .catch(err => {
    if(err) throw err;
  });
});

//Add Idea form
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

//Process Add Form
router.post('/', (req, res) => {
  // validate the form
  let errors = [];
  if(!req.body.title){
    errors.push({ text: 'Please enter a title'})
  }
  if(!req.body.details){
    errors.push({ text: 'Please  enter some text'})
  }
  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    // save to Database
    const newIdea = Idea({
      title: req.body.title,
      details: req.body.details
    });
    newIdea.save()
    .then(idea => {
      req.flash('success_msg', 'Video idea saved')
      res.redirect('/ideas');
    })
    .catch(err => {
      if (err) throw err
    });
  }
});

//Edit Idea Form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({ _id: req.params.id})
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    })
  })
  .catch(err => {
    if(err) throw err;
  });
});

//Process Edit Form
router.put('/:id', (req, res) => {
  Idea.findOne({_id: req.params.id})
  .then(idea => {
    //Update the idea
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash('success_msg', 'Video idea updated')
      res.redirect('/ideas');
    })
    .catch(err => {
      if(err) throw err;
    })
  })
  .catch(err => {
    if(err) throw err;
  });
});

//DELETE an Idea
router.delete('/:id', (req, res) => {
  Idea.deleteOne({_id:  req.params.id})
  .then(() => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas');
  })
  .catch(err => {
    if(err) throw err;
  })
});

module.exports  = router;