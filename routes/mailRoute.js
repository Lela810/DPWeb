const { distributeMail } = require('../js/distributeMail.js');
const {
	createMail,
	loadAllMails,
	loadMail,
	loadAllRecipients,
	loadResponses,
} = require('../js/db.js');

module.exports = function (app, ensureAuthenticated, limiter) {
	app.get('/mail', limiter, ensureAuthenticated, async function (req, res) {
		res.render('mail', {
			user: req.user,
			page: 'Mail',
			mails: await loadAllMails(),
		});
	});

	app.get(
		'/mail/editor',
		limiter,
		ensureAuthenticated,
		async function (req, res) {
			res.render('editorMail', {
				user: req.user,
				page: 'Mail',
				mail: await loadMail(req.query.mailId),
				responses: await loadResponses(req.query.mailId),
			});
		}
	);

	app.post('/mail/editor', ensureAuthenticated, limiter, async (req, res) => {
		const mailRaw = {
			date: Date.now(),
			invite: req.body.invite === 'on',
			sender: req.user.emails.find((e) => e.type == 'work').value,
			receivers: await loadAllRecipients(),
			subject: req.body.subject,
			message: req.body.message,
		};
		try {
			await createMail(mailRaw);
			const mailEntry = (await loadAllMails(mailRaw))[0];
			distributeMail(mailEntry);
			res.redirect('/mail');
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	});
};
