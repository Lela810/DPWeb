const { distributeMail } = require('../js/distributeMail.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const mailRouter = express.Router();

mailRouter.get('/', async function (req, res) {
	res.render('mail', {
		user: req.user,
		page: 'Mail',
		mails: await prisma.mails.findMany(),
	});
});

mailRouter.get('/editor', async function (req, res) {
	let mail = {};
	let responses = {};
	if (req.query.id) {
		mail = await prisma.mails.findUnique({
			where: {
				id: req.query.id,
			},
		});
		responses = await prisma.responses.findUnique({
			where: {
				mailId: req.query.id,
			},
		});
	}
	console.log(responses);
	console.log(mail);
	res.render('editorMail', {
		user: req.user,
		page: 'Mail',
		mail: mail,
		responses: responses,
	});
});

mailRouter.post('/editor', async (req, res) => {
	const mailRaw = {
		invite: req.body.invite === 'on',
		sender: req.user.emails.find((e) => e.type == 'work').value,
		receivers: await prisma.recipients.findMany(),
		subject: req.body.subject,
		message: req.body.message,
	};
	try {
		const mailEntry = await prisma.mails.create({
			data: mailRaw,
		});
		distributeMail(mailEntry);
		res.redirect('/mail');
	} catch (error) {
		console.log(error);
		res.render('error', {
			user: req.user,
			page: 500,
			errorcode: 500,
		});
	}
});

module.exports = mailRouter;
