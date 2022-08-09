import express from 'express';
import * as usersController from '../controllers/usersController.js';
import * as postsController from '../controllers/postsController.js';
import passport from 'passport';

const router = express.Router();

// GET home page
router.get('/', postsController.get_home_page)

// POST home page
router.post('/', postsController.create_post);

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

// GET Post delete page
router.get('/posts/:post_id/delete', postsController.post_delete_get);

// POST method for Post delete page
router.post('/posts/:post_id/delete', postsController.post_delete);

// GET method for membership page
router.get('/membership', usersController.membership_get);

router.post('/membership', usersController.membership_post);



export default router;
