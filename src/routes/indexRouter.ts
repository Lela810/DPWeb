import express from 'express';

export const indexRouter = express.Router();

indexRouter.get(
	'/',
	function (req: express.Request, res: express.Response, next) {
		if (req.isAuthenticated()) {
			res.redirect('/home');
		} else {
			res.render('index', {
				user: req.user,
				page: 'Welcome',
			});
		}
	}
);
