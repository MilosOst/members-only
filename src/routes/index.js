import express from 'express';
import * as usersController from '../controllers/usersController.js';
import passport from 'passport';

const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
  	res.render('index');
});

// GET Sign Up Page
router.get('/sign-up', usersController.signup_get);

// POST Sign Up Page
router.post('/sign-up', usersController.signup_post);

// GET Login Page
router.get('/login', usersController.login_get);

// POST Login Page
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
}));

// GET Logout page
router.get('/log-out', (req, res) => {
	req.logout(function (err) {
		if (err) return next(err);

		res.redirect('/')
	});
});




export default router;
