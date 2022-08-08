import {body, validationResult, check, ValidationError} from 'express-validator';
import User from '../models/user.js';
import Post from '../models/post.js';


// Render home page with all posts
export async function get_home_page(req, res, next) {
    try {
        // Fetch all posts, sorted by date
        const posts = await Post.find().populate('user').sort({date_posted: -1});
        res.render('index', {posts: posts})
    }
    catch (err) {
        return next(err);
    }
}

// Handle post creation
export const create_post = [
    // Validate and sanitize data
    body('title', 'Title must be specified and between 1 and 60 characters.').trim().isLength({min: 1, max: 60}).escape(),
    body('content', 'Content must be specified and between 1 and 400 characters.').trim().isLength({min: 1, max: 400}).escape(),

    // Process request after validation
    async(req, res, next) => {
        const errors = validationResult(req);

        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            user: res.locals.currentUser._id,
        });

        if (!errors.isEmpty()) {
            // Error, re render page
            res.render('index', {post: newPost, errors: errors.array()})
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

// Render delete page for a given Post
export async function post_delete_get(req, res, next) {
    // Do not allow access if user is not an admin
    if (!res.locals?.currentUser?.isAdmin) {
        res.redirect('/');
    }

    try {
        // Verify that post with given id exists,
        const post = await Post.findById(req.params.post_id);

        if (post) {
            res.render('post_delete', {post: post})
        }
        else {
            res.render('post_delete');
        }
    }
    catch (err) {
        return next(err);
    }
}

export async function post_delete(req, res, next) {
    try {
        await Post.findByIdAndRemove(req.params.post_id);
        res.redirect('/');
    }
    catch (err) {
        return next(err);
    }
}