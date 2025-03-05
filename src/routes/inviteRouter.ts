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
			const mailId = req.body.id as string;
			const name = req.body.name as string;
			const mail = req.body.mail as string;

			const invite = await prisma.invites.findUniqueOrThrow({
				where: {
					mailId: mailId,
				},
			});

			// Find the receiver index that matches the name and mail
			let receiverIndex = -1;
			for (let i = 0; i < invite.receivers.length; i++) {
				if (
					invite.receivers[i].mail === mail &&
					invite.receivers[i].name === name
				) {
					receiverIndex = i;
					break;
				}
			}

			if (receiverIndex !== -1) {
				// Create a new array with updated receiver
				const updatedReceivers = [...invite.receivers];
				updatedReceivers[receiverIndex] = {
					...updatedReceivers[receiverIndex],
					rejected: true,
				};

				// Update the invite with the modified receivers array
				await prisma.invites.update({
					where: { mailId: mailId },
					data: { receivers: updatedReceivers },
				});
			}

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}
);
