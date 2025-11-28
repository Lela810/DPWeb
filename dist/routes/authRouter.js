import passport from 'passport';
import express from 'express';
export const authRouter = express.Router();
authRouter.get('/login', passport.authenticate('microsoft', {
    prompt: 'select_account',
}));
authRouter.get('/microsoft/callback', function (req, res, next) {
    passport.authenticate('microsoft', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/home');
        });
    })(req, res, next);
});
authRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});