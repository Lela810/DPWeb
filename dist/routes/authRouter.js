import passport from 'passport';
import express from 'express';
export const authRouter = express.Router();
authRouter.get('/login', passport.authenticate('microsoft', {
    prompt: 'select_account',
}));
authRouter.get('/microsoft/callback', passport.authenticate('microsoft', {
    failureRedirect: '/',
}), function (req, res) {
    res.redirect('/home');
});
authRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});