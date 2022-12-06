module.exports = function (app, ensureAuthenticated, limiter) {
	app.get('/', limiter, function (req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/home');
		} else {
			res.render('index', {
				user: req.user,
				page: 'Welcome',
			});
		}
	});

	app.get('/home', limiter, ensureAuthenticated, function (req, res) {
		res.render('home', {
			user: req.user,
			page: 'Home',
		});
	});
};
