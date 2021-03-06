var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

// official site
var indexRouter = require('./routes/index');
var galleryRouter = require('./routes/intro/gallery');
var companyRouter = require('./routes/intro/company');
var techRouter = require('./routes/intro/tech');
var productRouter = require('./routes/intro/product');
// function
var menuRouter = require('./routes/menu');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var regRouter = require('./routes/register');
var unregRouter = require('./routes/unregister');
var walletRouter = require('./routes/wallet');
var gameRouter = require('./routes/game');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// use cookie / session ??
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  // use session store???
  // mongodb or onedb ??
  // store : new FileStore()
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/gallery', galleryRouter);
app.use('/company', companyRouter);
app.use('/tech', techRouter);
app.use('/product', productRouter);
app.use('/menu', menuRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter)
app.use('/reg', regRouter);
app.use('/unreg', unregRouter);
app.use('/wallet', walletRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
