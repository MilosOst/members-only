import {body, validationResult, check, ValidationError} from 'express-validator';
import User from '../models/user.js';
import Post from '../models/post.js';


export async function get_home_page(req, res, next) {

}

export const create_post = [
    // Validate and sanitize data
    body('title', 'Title must be specified and between 1 and 60 characters.').trim().isLength({min: 1, max: 20}).escape(),
    body('content', 'Content must be specified and between 1 and 400 characters.').trim().isLength({min: 1, max: 400}).escape(),

    // Process request after validation
    async(req, res, next) => {
        const errors = validationResult(req);

        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            user: req.user._id,
        });

        if (!errors.isEmpty()) {
            // Error, re render page
            res.render('/', {post: newPost})
        }
        else {
            try {
                await newPost.save();
                res.redirect('/');
            }
            catch (e) {
                return next(e);
            }
        }
    }
];