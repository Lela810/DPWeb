import { distributeMail } from '../js/distributeMail.js';
import { mails, PrismaClient, responses } from '@prisma/client';
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
	'/editor',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			let mail: mails = {} as mails;
			let responses: responses = {} as responses;
			if (req.query.id) {
				mail = await prisma.mails.findUniqueOrThrow({
					where: {
						id: req.query.id as string,
					},
				});
				responses = await prisma.responses.findUniqueOrThrow({
					where: {
						mailId: req.query.id as string,
					},
				});
			}

			res.render('editorMail', {
				user: req.user,
				page: 'Mail',
				mail: mail,
				responses: responses,
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
				date: new Date().toString(),
			};

			const mailEntry: mails = await prisma.mails.create({
				data: mailRaw,
			});
			distributeMail(mailEntry);
			res.redirect('/mail');
		} catch (error) {
			next(error);
		}
	}
);
