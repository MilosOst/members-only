import express from 'express';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
  	res.render('index', { title: 'Express' });
});

// GET Sign Up Page
router.get('/sign-up', usersController.sign_up_get);

// GET Login Page
router.get('/login', usersController.login_get);

export default router;
