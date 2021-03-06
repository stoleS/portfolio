var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local'), Strategy;
var bodyParser = require('body-parser');
var async = require("async");
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads' })
var flash = require('connect-flash');

var index = require('./routes/index');
var blog = require('./routes/blog');
var login = require('./routes/admin/login');
var admin = require('./routes/admin/admin');
var posts = require('./routes/admin/posts');
var categories = require('./routes/admin/categories');
var projects = require('./routes/admin/projects');
var testimonials = require('./routes/admin/testimonials');
var userMessages = require('./routes/admin/messages');

var app = express();

app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// express session
app.use(session({
	secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

// connect-flash
app.use(flash());
app.use(function(req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
	next();
});

// make db accessible to router
app.use(function(req, res, next) {
	req.db = db;
	next();
})

app.use('/', index);
app.use('/blog', blog);
app.use('/admin/login', login);
app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/projects', projects);
app.use('/admin/testimonials', testimonials);
app.use('/admin/messages', userMessages)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
