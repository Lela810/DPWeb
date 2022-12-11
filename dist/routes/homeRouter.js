import validate from 'validate.js';
import express from 'express';
export const homeRouter = express.Router();
homeRouter.get('/', function (req, res) {
    res.render('home', {
        user: req.user,
        page: 'Home',
        validate: validate,
    });
});
