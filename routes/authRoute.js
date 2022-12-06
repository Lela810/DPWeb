module.exports = function (app, passport, limiter) {
	app.get(
		'/login',
		limiter,
		passport.authenticate('microsoft', {
			prompt: 'select_account',
		})
	);

	app.get(
		'/auth/microsoft/callback',
		limiter,
		passport.authenticate('microsoft', { failureRedirect: '/login' }),
		function (req, res) {
			res.redirect('/');
		}
	);

	app.post('/logout', limiter, function (req, res, next) {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.redirect('/');
		});
	});
};
