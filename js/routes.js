const {
	loadAllDPs,
	createDetailprogramm,
	loadDetailprogramm,
	editDetailprogramm,
	loadAllRecipients,
	editRecipients,
	createRecipient,
} = require('./db.js');

module.exports = function (app, passport, ensureAuthenticated, limiter) {
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

	app.get(
		'/detailprogramme',
		limiter,
		ensureAuthenticated,
		async function (req, res) {
			res.render('detailprogramme', {
				user: req.user,
				page: 'Detailprogramme',
				detailprogramme: await loadAllDPs(),
			});
		}
	);

	app.get(
		'/detailprogramme/edit',
		limiter,
		ensureAuthenticated,
		async function (req, res) {
			res.render('editDetailprogramm', {
				user: req.user,
				page: 'Detailprogramme',
				detailprogramm: await loadDetailprogramm(req.query.detailprogrammId),
			});
		}
	);
	app.post(
		'/detailprogramme/create',
		ensureAuthenticated,
		limiter,
		(req, res) => {
			try {
				createDetailprogramm(req.body);
				res.sendStatus(200);
			} catch (error) {
				console.log(error);
				res.sendStatus(500);
			}
		}
	);
	app.post(
		'/detailprogramme/edit',
		ensureAuthenticated,
		limiter,
		(req, res) => {
			try {
				editDetailprogramm(req.query.detailprogrammId, req.body);
				res.sendStatus(200);
			} catch (error) {
				console.log(error);
				res.sendStatus(500);
			}
		}
	);

	app.get('/mail', limiter, ensureAuthenticated, async function (req, res) {
		/* 		const { sendMail } = require('./mail.js');
		sendMail(
			req.user.emails.find((e) => e.type == 'work').value,
			'leandro.klaus03@gmail.com',
			'Test'
		); */
		res.render('mail', {
			user: req.user,
			page: 'Mail',
		});
	});

	app.get(
		'/recipients',
		limiter,
		ensureAuthenticated,
		async function (req, res) {
			console.log(await loadAllRecipients());
			res.render('recipients', {
				user: req.user,
				page: 'Mail',
				recipients: await loadAllRecipients(),
			});
		}
	);

	app.post('/recipients', ensureAuthenticated, limiter, (req, res) => {
		try {
			if (req.query.recipientId) {
				editRecipients(req.query.recipientId, req.body);
			} else {
				createRecipient(req.body);
			}
			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	});

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
