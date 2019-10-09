const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')

const app = express();

//Load router
const Ideas = require('./routes/ideas');
const Users = require('./routes/users');

// Map Global Promises
mongoose.Promise = global.Promise;

//Connect to Mongoose
mongoose.connect('mongodb://localhost/YoutubeDB', {
  useNewUrlParser: true,
   useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//Express handlebars middleware
app.engine('handlebars', exphbs({ 
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index page
app.get('/', (req, res) => {
  res.render('index');
});

//About
app.get('/about', (req, res) => {
  res.render('about');
});

// app.use('/ideas', Ideas);
// app.use('/users', Users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});