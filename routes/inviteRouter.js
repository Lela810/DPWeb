const validate = require('validate.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const inviteRouter = express.Router();

inviteRouter.get('/', async function (req, res) {
	let mailReceivers = (
		await prisma.mails.findUnique({
			where: {
				id: req.query.id,
			},
		})
	).receivers;

	const identifier = req.query.identifier;
	const invite = await prisma.invites.findUnique({
		where: {
			mailId: req.query.id,
		},
	});
	const mailOfIdentifier = invite.mails[invite.identifiers.indexOf(identifier)];
	const recipients = mailReceivers.filter(
		(receiver) => receiver.mail === mailOfIdentifier
	);

	res.render('invite', {
		user: req.user,
		page: 'invite',
		recipients: recipients,
		id: req.query.id,
		validate: validate,
	});
});

inviteRouter.post('/', async (req, res) => {
	try {
		let responseEntry = await prisma.responses.findUnique({
			where: {
				mailId: req.body.id,
			},
		});
		if (
			responseEntry.names.indexOf(req.body.name) !=
				responseEntry.mails.indexOf(req.body.mail) ||
			(responseEntry.names.indexOf(req.body.name) == -1 &&
				responseEntry.mails.indexOf(req.body.mail) == -1)
		) {
			responseEntry.names.push(req.body.name);
			responseEntry.mails.push(req.body.mail);

			await prisma.responses.update({
				where: {
					mailId: req.body.id,
				},
				data: {
					names: responseEntry.names,
					mails: responseEntry.mails,
				},
			});
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

module.exports = inviteRouter;
