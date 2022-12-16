import { distributeMail } from '../js/distributeMail.js';
import { mails, PrismaClient, responses } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import { activitiesEntry, mailEntry } from '../types/prismaEntry.js';

export const mailRouter = express.Router();

async function updateActivity(mailEntry: mails) {
	let activity = await prisma.activities.findUniqueOrThrow({
		where: {
			id: mailEntry.activityId as string,
		},
	});
	activity.mailId = mailEntry.id as string;
	const newActivity: activitiesEntry = activity;
	delete newActivity.id;
	await prisma.activities.update({
		data: newActivity,
		where: {
			id: mailEntry.activityId as string,
		},
	});
}

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
	'/editor',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			let mail: mails = {} as mails;
			let responses: responses = {} as responses;
			let mailId = '';
			let activity;
			if (req.query.activityId != undefined) {
				activity = await prisma.activities.findUniqueOrThrow({
					where: {
						id: req.query.activityId as string,
					},
				});
				mailId = activity.mailId as string;
			}
			if (req.query.id != undefined || mailId != '') {
				mail = await prisma.mails.findUniqueOrThrow({
					where: {
						id: (req.query.id as string) || (mailId as string),
					},
				});
				responses = await prisma.responses.findUniqueOrThrow({
					where: {
						mailId: (req.query.id as string) || (mailId as string),
					},
				});
			}

			res.render('editorMail', {
				user: req.user,
				page: 'Mail',
				mail: mail,
				responses: responses,
				activity: activity,
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
				receivers: await prisma.recipients.findMany(),
				subject: req.body.subject,
				message: req.body.message,
				date: new Date(),
				detailprogrammId: null,
			};
			if (req.body.activityId) {
				mailRaw.activityId = req.body.activityId;
			}

			const mailEntry: mails = await prisma.mails.create({
				data: mailRaw,
			});
			console.log(mailEntry);

			if (typeof mailEntry.activityId != 'undefined') {
				await updateActivity(mailEntry);
			}

			distributeMail(mailEntry);
			res.redirect('/mail');
		} catch (error) {
			next(error);
		}
	}
);
