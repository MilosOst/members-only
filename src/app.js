import createError from 'http-errors'
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import dotenv from 'dotenv'
import passport from 'passport';
import session from 'express-session';
import * as passportLocal from 'passport-local';

const LocalStrategy = passportLocal.Strategy;

const app = express();
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// view engine setup
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', indexRouter);


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

export default app;