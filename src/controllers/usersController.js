import User from "../models/user.js";
import {body, validationResult, check, ValidationError} from 'express-validator';
import * as bcrpyt from 'bcryptjs';
import passport from "passport";


// GET Sign-up Page
export function signup_get(req, res, next) {
    if (req.user) {
        res.redirect('/');
    }
    else {
        res.render('sign-up');
    }
}

// GET Login Page
export function login_get(req, res, next) {
    if (req.user) {
        res.redirect('/');
    }
    else {
        res.render('login');
    }
}

// Handle Sign-up page form submission
export const signup_post = [
    // First, validate and sanitize data
    body('first_name', 'First Name must be specified').trim().isLength({min: 1}).escape(),
    body('last_name', 'Last Name must be specified').trim().isLength({min: 1}).escape(),
    body('username', 'Username must be specified').trim().isLength({min: 4, max: 15}).withMessage('Username must be between 4 to 15 characters').escape()
        .isAlphanumeric().withMessage('Username must use alphanumeric characters only'),
    body('password', 'Password must be specified').trim().isLength({min: 5}).withMessage('Password must be at least 5 characters long.').escape(),
    body('passwordConfirm', 'Confirm Password must be specified').trim().isLength({min: 5}).withMessage('Confirm Password must be at least 5 characters long.').escape(),

    // Check that passwords match
    check('passwordConfirm', 'Your passwords do not match.').custom((value, {req}) => {
        return value === req.body.password;
    }),

    // Process request after validation and sanitization
    async (req, res, next) => {
        const errors = validationResult(req);

        const tempUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
        });

        if (!errors.isEmpty()) {
            res.render('sign-up', {errors: errors.array(), user: tempUser});
        }
        else {
            // No Errors, check to see if username is taken
            try {
                const user = await User.findOne({username: req.body.username}).collation({locale: 'en', strength: 2}).exec();

                if (user) {
                    // Username is taken, re render form
                    const err = {param: 'confirmPassword', msg: 'This username is taken. Please choose another.', value: req.body.confirmPassword};
                    res.render('sign-up', {errors: [err], user: tempUser});
                }
                else {
                    // Data is valid, create new user with hashed password
                    bcrpyt.hash(req.body.password, 10, async (err, hashedPassword) => {
                        if (err) return next(err);

                        const newUser = new User({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            username: req.body.username,
                            password: hashedPassword,
                        });

                        await newUser.save();
                        res.redirect('/login');
                    });
                }
            }
            catch (e) {
                return next(e);
            }
        }
    }
];

// Display membership page
export function membership_get(req, res, next) {
    res.render('membership');
}

export const membership_post = [
    body('answer', 'Incorrect answer. Try again.').trim().escape().toLowerCase().isIn(['future', 'the future']),

    // Process request
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('membership', {errors: errors.array()})
        }
        else {
            try {
                // Correct answer, grant user member status
                await User.findByIdAndUpdate(res.locals.currentUser._id, {isMember: true});
                res.redirect('/');
            }
            catch (err) {
                return next(err);
            }
        }   
    }
];