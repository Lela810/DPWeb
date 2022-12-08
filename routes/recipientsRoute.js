const validate = require('validate.js');
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
			for (let i = 0; i < req.body.name.length; i++) {
				if (
					validate({ mail: req.body.mail[i] }, { mail: { email: true } }) !=
					undefined
				) {
					let recipients = [];
					for (let i = 0; i < req.body.name.length; i++) {
						recipients.push({
							name: req.body.name[i],
							mail: req.body.mail[i],
						});
					}
					res.render('recipients', {
						user: req.user,
						page: 'Mail',
						recipients: recipients,
						error: 'Invalid email address',
					});
					return;
				}
			}

			await deleteAllRecipients();
			for (let i = 0; i < req.body.name.length; i++) {
				try {
					await createRecipient({
						mail: req.body.mail[i],
						name: req.body.name[i],
					});
				} catch (error) {
					console.log(error);
					res.render('error', {
						user: req.user,
						page: 500,
						errorcode: 500,
					});
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
				res.render('error', {
					user: req.user,
					page: 500,
					errorcode: 500,
				});
			}
		}
		res.render('recipients', {
			user: req.user,
			page: 'Mail',
			recipients: await loadAllRecipients(),
		});
	});
};
