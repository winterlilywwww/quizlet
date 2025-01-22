var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
var he = require('he');
const mongoose = require('mongoose');

const express = require('express');
const session = require('express-session'); // Import session module
const app = express();

// Initialize session middleware
app.use(session({
    secret: 'your_secret_key', // A secret key to sign the session ID cookie
    resave: false, // Don't save session if it wasn't modified
    saveUninitialized: true, // Save the session even if it's not modified
    cookie: { secure: false } // Make sure it's false for development (use true for HTTPS)
}));

// Other middleware (body parsers, etc.)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your route handlers go here


var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var quizRouter = require('./routes/quiz');
var api = require('./routes/api');
var user = require('./routes/user');

// Serve static files from the "public" directory
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb+srv://express_user:express123@cluster0.umnxq.mongodb.net/quizDB?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Define routes
app.use('/', indexRouter); // Root route
app.use('/quiz', quizRouter);
app.use('/about', aboutRouter);
app.use('/home', homeRouter);
app.use('/api', api); 
app.use('/user', user); 

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(`Route not found: ${req.originalUrl}`);
  next(createError(404));
});

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Change to true if using HTTPS
}));

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
