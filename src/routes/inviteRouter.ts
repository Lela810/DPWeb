import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import validate from 'validate.js';

export const inviteRouter = express.Router();

inviteRouter.get(
	'/',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			const mailId = req.query.id as string;
			const identifier = req.query.identifier as string;

			const invite = await prisma.invites.findUniqueOrThrow({
				where: {
					mailId: mailId,
				},
			});

			// Get all receivers that match the identifier's email
			let receivers = invite.receivers.filter(
				(receiver: any) => receiver.identifier === identifier
			);

			res.render('invite', {
				user: req.user,
				page: 'invite',
				receivers: receivers,
				id: mailId,
				validate: validate,
			});
		} catch (error) {
			next(error);
		}
	}
);

inviteRouter.post(
	'/',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			let responseEntry = await prisma.responses.findUniqueOrThrow({
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
			next(error);
		}
	}
);
