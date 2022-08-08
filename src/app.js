import createError from 'http-errors'
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import dotenv from 'dotenv'
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import * as passportLocal from 'passport-local';
import * as bcrypt from 'bcryptjs';
import User from './models/user.js';

const LocalStrategy = passportLocal.Strategy;

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {useNewURLParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', () => console.log('Connected to Database'));

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({username: username}).collation({locale: 'en', strength: 2});

			if (!user) {
				return done(null, false, {message: 'Incorrect Username'});
			}

			// User found, verify password
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					// Passwords match, log user in
					return done(null, user);
				}
				else {
					// Wrong password
					return done(null, false, {message: 'Incorrect Password'});
				}
			});
		}
		catch (err) {
			return done(err);
		}
	})
);


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

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