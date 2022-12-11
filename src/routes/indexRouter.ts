import express from 'express';

export const indexRouter = express.Router();

indexRouter.get(
	'/',
	function (req: express.Request, res: express.Response, next) {
		res.render('index', {
			user: req.user,
			page: 'Welcome',
		});
	}
);
