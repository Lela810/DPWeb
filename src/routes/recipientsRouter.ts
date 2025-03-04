import validate from 'validate.js';
import { ObjectID } from 'bson';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import { recipientEntry } from '../types/prismaEntry';
import {
	downloadMidataRecipients,
	filterPeopleWithoutRoles,
} from '../js/syncMidata.js';

export const recipientsRouter = express.Router();

async function renderRecipients(
	res: express.Response,
	recipients: any,
	req: express.Request,
	error?: any
) {
	res.render('recipients', {
		user: req.user,
		page: 'Mail',
		recipients: recipients,
		syncedRecipients: await prisma.recipients.findMany({
			where: { synced: true },
		}),
		error: error,
	});
}

recipientsRouter.get(
	'/',
	async function (req: express.Request, res: express.Response) {
		await renderRecipients(
			res,
			await prisma.recipients.findMany({ where: { synced: !true } }),
			req
		);
	}
);

recipientsRouter.post(
	'/sync',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			console.log('Syncing recipients');

			const MiDataData = await downloadMidataRecipients();
			const Teilnehmer = await filterPeopleWithoutRoles(MiDataData);

			const dbRecipients = await prisma.recipients.findMany({
				where: { synced: true },
			});

			// Create a map with combined key (name+email) for faster lookup
			const dbRecipientsMap = new Map(
				dbRecipients.map((recipient) => [
					`${recipient.name}|${recipient.mail}`,
					recipient,
				])
			);

			// Process each person from MiData
			for (const person of Teilnehmer) {
				if (!person.email) continue;

				const fullName = person.first_name + ' ' + person.last_name;
				const compositeKey = `${fullName}|${person.email}`;

				const existingRecipient = dbRecipientsMap.get(compositeKey);

				if (existingRecipient) {
					// Person exists in DB, remove from map to mark as processed
					dbRecipientsMap.delete(compositeKey);
				} else {
					// New person, create recipient
					console.log(`Created recipient: ${fullName} (${person.email})`);
					await prisma.recipients.create({
						data: {
							name: fullName,
							mail: person.email,
							synced: true,
						},
					});
				}
			}

			// Delete recipients that aren't in MiData anymore
			for (const [_, remainingRecipient] of dbRecipientsMap.entries()) {
				console.log(
					`Deleting recipient: ${remainingRecipient.name} (${remainingRecipient.mail})`
				);
				await prisma.recipients.delete({
					where: { id: remainingRecipient.id },
				});
			}

			await renderRecipients(
				res,
				await prisma.recipients.findMany({ where: { synced: !true } }),
				req
			);
		} catch (error) {
			next(error);
		}
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
				await prisma.recipients.deleteMany({ where: { synced: false } });
				await renderRecipients(
					res,
					await prisma.recipients.findMany({ where: { synced: false } }),
					req
				);
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

			let entryError = false;
			for (let i = 0; i < req.body.name.length; i++) {
				if (
					validate({ mail: req.body.mail[i] }, { mail: { email: true } }) !=
					undefined
				) {
					entryError = true;
					break;
				}
			}
			if (entryError) {
				let recipients = [];
				for (let i = 0; i < req.body.name.length; i++) {
					recipients.push({
						id: req.body.id[i] || new ObjectID().toString(),
						name: req.body.name[i],
						mail: req.body.mail[i],
					});
				}
				await renderRecipients(res, recipients, req, 'Invalid email address');
			} else {
				const recipients = await prisma.recipients.findMany({
					where: { synced: false },
				});
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
						synced: false,
					};
					await prisma.recipients.upsert({
						create: recipientEntry,
						update: recipientEntry,
						where: {
							id: req.body.id[i] || new ObjectID().toString(),
						},
					});
				}

				await renderRecipients(
					res,
					await prisma.recipients.findMany({ where: { synced: false } }),
					req
				);
			}
		} catch (error) {
			next(error);
		}
	}
);
