import express from 'express';
export const indexRouter = express.Router();
indexRouter.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    }
    else {
        res.render('index', {
            user: req.user,
            page: 'Welcome',
        });
    }
});
