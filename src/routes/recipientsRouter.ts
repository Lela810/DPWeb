import validate from 'validate.js';
import { Code, ObjectID } from 'bson';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import { recipientEntry } from '../types/prismaEntry';

export const recipientsRouter = express.Router();

recipientsRouter.get(
	'/',
	async function (req: express.Request, res: express.Response) {
		res.render('recipients', {
			user: req.user,
			page: 'Mail',
			recipients: await prisma.recipients.findMany(),
		});
	}
);

recipientsRouter.post(
	'/',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			if (Object.keys(req.body).length == 0) {
				await prisma.recipients.deleteMany();
				res.render('recipients', {
					user: req.user,
					page: 'Mail',
					recipients: [],
				});
				return;
			}
			if (!Array.isArray(req.body.name)) {
				req.body.name = [req.body.name];
			}
			if (!Array.isArray(req.body.mail)) {
				req.body.mail = [req.body.mail];
			}
			if (!Array.isArray(req.body.id)) {
				req.body.id = [req.body.id];
			}

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

			const recipients = await prisma.recipients.findMany();
			for (let i = 0; i < recipients.length; i++) {
				if (
					req.body.id.find((id: any) => id == recipients[i].id) == undefined
				) {
					await prisma.recipients.delete({
						where: {
							id: recipients[i].id,
						},
					});
				}
			}

			for (let i = 0; i < req.body.name.length; i++) {
				const recipientEntry: recipientEntry = {
					mail: req.body.mail[i],
					name: req.body.name[i],
				};
				await prisma.recipients.upsert({
					create: recipientEntry,
					update: recipientEntry,
					where: {
						id: req.body.id[i] || new ObjectID().toString(),
					},
				});
			}

			res.render('recipients', {
				user: req.user,
				page: 'Mail',
				recipients: await prisma.recipients.findMany(),
			});
		} catch (error) {
			next(error);
		}
	}
);
