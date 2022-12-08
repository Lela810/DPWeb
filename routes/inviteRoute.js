const validate = require('validate.js');
const {
	loadAllMails,
	loadAllInvites,
	addResponse,
	loadResponses,
} = require('../js/db.js');

module.exports = function (app, limiter) {
	app.get('/invite', limiter, async function (req, res) {
		let mailReceivers = (
			await loadAllMails({
				mailId: req.query.mailId,
			})
		)[0].receivers;

		const identifier = req.query.identifier;
		const invite = (await loadAllInvites({ mailId: req.query.mailId }))[0];
		const mailOfIdentifier =
			invite.mails[invite.identifiers.indexOf(identifier)];
		const recipients = mailReceivers.filter(
			(receiver) => receiver.mail === mailOfIdentifier
		);

		res.render('invite', {
			user: req.user,
			page: 'invite',
			recipients: recipients,
			mailId: req.query.mailId,
			validate: validate,
		});
	});

	app.post('/invite', limiter, async (req, res) => {
		try {
			const responses = await loadResponses(req.body.mailId);

			if (
				responses.names.indexOf(req.body.name) !=
					responses.mails.indexOf(req.body.mail) ||
				(responses.names.indexOf(req.body.name) == -1 &&
					responses.mails.indexOf(req.body.mail) == -1)
			) {
				await addResponse(req.body.mailId, req.body.name, req.body.mail);
			}

			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			res.render('error', {
				user: req.user,
				page: 500,
				errorcode: 500,
			});
		}
	});
};
