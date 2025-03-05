import { distributeMail } from '../js/distributeMail.js';
import { mails, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import { mailEntry } from '../types/prismaEntry.js';

export const mailRouter = express.Router();

mailRouter.get(
	'/',
	async function (req: express.Request, res: express.Response) {
		res.render('mail', {
			user: req.user,
			page: 'Mail',
			mails: await prisma.mails.findMany(),
		});
	}
);

mailRouter.get(
	'/view',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			const mailId = req.query.id as string;
			let receivers;

			const mail = await prisma.mails.findUniqueOrThrow({
				where: {
					id: mailId,
				},
			});

			const activity = await prisma.activities.findUniqueOrThrow({
				where: {
					id: mail.activityId,
				},
			});

			if (mail.invite) {
				receivers = (
					await prisma.invites.findUniqueOrThrow({
						where: {
							mailId: mailId,
						},
					})
				).receivers;
			} else {
				receivers = mail.receivers;
			}

			res.render('editorMail', {
				user: req.user,
				page: 'Mail',
				mail: mail,
				receivers: receivers,
				activity: activity,
			});
		} catch (error) {
			next(error);
		}
	}
);

mailRouter.get(
	'/editor',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			let mail: mails = {} as mails;
			const activityId = req.query.activityId as string;
			const activity = await prisma.activities.findUniqueOrThrow({
				where: {
					id: activityId,
				},
			});

			res.render('editorMail', {
				user: req.user,
				page: 'Mail',
				mail: mail,
				activity: activity,
				receivers: await prisma.recipients.findMany(),
			});
		} catch (error) {
			next(error);
		}
	}
);

mailRouter.post(
	'/editor',
	async (req: any, res: express.Response, next: express.NextFunction) => {
		try {
			let inviteBool = false;
			if (req.body.invite == 'on') {
				inviteBool = true;
			}
			const mailRaw: mailEntry = {
				invite: inviteBool,
				sender: req.user.emails.find((e: any) => e.type == 'work').value,
				receivers: (await prisma.recipients.findMany()).map(
					({ id, synced, ...rest }) => rest
				),
				subject: req.body.subject,
				message: req.body.message,
				date: new Date(),
				activityId: req.body.activityId,
			};

			const mailEntry: mails = await prisma.mails.create({
				data: mailRaw,
			});
			console.log(mailEntry);

			distributeMail(mailEntry);
			res.redirect('/mail');
		} catch (error) {
			next(error);
		}
	}
);
