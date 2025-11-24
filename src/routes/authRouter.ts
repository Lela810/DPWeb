import passport from 'passport';
import express from 'express';

export const authRouter = express.Router();

authRouter.get(
	'/login',
	passport.authenticate('microsoft', {
		prompt: 'select_account',
	})
);

authRouter.get(
	'/microsoft/callback',
	function (req: express.Request, res: express.Response, next: express.NextFunction) {
		passport.authenticate('microsoft', function (err: any, user: any, info: any) {
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
	}
);

authRouter.post(
	'/logout',
	function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	}
);
