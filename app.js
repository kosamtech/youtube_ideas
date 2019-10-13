const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Load router
const Ideas = require('./routes/ideas');
const Users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

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

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride('_method'))

//Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Static public file
app.use(express.static(path.join(__dirname, 'public')));

// Index page
app.get('/', (req, res) => {
  res.render('index');
});

//About
app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/ideas', Ideas);
app.use('/users', Users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});