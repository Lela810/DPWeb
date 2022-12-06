const {
	loadAllRecipients,
	editRecipients,
	createRecipient,
	deleteAllRecipients,
} = require('../js/db.js');

module.exports = function (app, ensureAuthenticated, limiter) {
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

	app.post('/recipients', ensureAuthenticated, limiter, async (req, res) => {
		if (Array.isArray(req.body.name) && Array.isArray(req.body.mail)) {
			await deleteAllRecipients();
			for (let i = 0; i < req.body.name.length; i++) {
				try {
					await createRecipient({
						mail: req.body.mail[i],
						name: req.body.name[i],
					});
				} catch (error) {
					console.log(error);
					res.sendStatus(500);
				}
			}
		} else {
			try {
				await deleteAllRecipients();
				await createRecipient({
					name: req.body.name,
					mail: req.body.mail,
				});
			} catch (error) {
				console.log(error);
				res.sendStatus(500);
			}
		}
		res.sendStatus(200);
	});
};
