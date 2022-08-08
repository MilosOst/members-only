import User from "../models/user.js";

export function sign_up_get(req, res, next) {
    res.render('sign-up');
}

export function login_get(req, res, next) {
    res.render('login');
}