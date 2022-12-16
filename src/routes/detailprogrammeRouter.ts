import { activities, detailprogramme, PrismaClient } from '@prisma/client';
import express, { Request } from 'express';
import { activitiesEntry, detailprogrammEntry } from '../types/prismaEntry';

export const detailprogrammeRouter = express.Router();
const prisma = new PrismaClient();

async function updateActivity(detailprogrammEntry: detailprogramme) {
	let activity = await prisma.activities.findUniqueOrThrow({
		where: {
			id: detailprogrammEntry.activityId,
		},
	});
	activity.detailprogrammId = detailprogrammEntry.id as string;
	const newActivity: activitiesEntry = activity;
	delete newActivity.id;
	await prisma.activities.update({
		data: newActivity,
		where: {
			id: detailprogrammEntry.activityId,
		},
	});
}

detailprogrammeRouter.get(
	'/',
	async function (req: express.Request, res: express.Response) {
		res.render('detailprogramme', {
			user: req.user,
			page: 'Detailprogramme',
			detailprogramme: await prisma.detailprogramme.findMany(),
		});
	}
);

detailprogrammeRouter.get(
	'/edit',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		let detailprogramm: detailprogramme = {} as detailprogramme;
		let detailprogrammId = '';
		let activity;
		if (req.query.activityId != undefined) {
			activity = await prisma.activities.findUniqueOrThrow({
				where: {
					id: req.query.activityId as string,
				},
			});
			detailprogrammId = activity.detailprogrammId as string;
		}
		if (req.query.id != undefined || detailprogrammId != '') {
			try {
				detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
					where: {
						id: (req.query.id as string) || (detailprogrammId as string),
					},
				});
			} catch (error) {
				next(error);
			}
		}
		res.render('editDetailprogramm', {
			user: req.user,
			page: 'Detailprogramme',
			detailprogramm: detailprogramm,
			activity: activity,
		});
	}
);
detailprogrammeRouter.post(
	'/create',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			const newEntry: detailprogramme = await prisma.detailprogramme.create({
				data: req.body,
			});
			await updateActivity(newEntry);

			res.render('editDetailprogramm', {
				user: req.user,
				page: 'Detailprogramme',
				detailprogramm: await prisma.detailprogramme.findUniqueOrThrow({
					where: {
						id: newEntry.id,
					},
				}),
			});
		} catch (error) {
			next(error);
		}
	}
);
detailprogrammeRouter.post(
	'/edit',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			const detailprogrammEntry: detailprogrammEntry = req.body;

			await prisma.detailprogramme.update({
				data: detailprogrammEntry,
				where: {
					id: req.query.id as string,
				},
			});

			res.render('editDetailprogramm', {
				user: req.user,
				page: 'Detailprogramme',
				detailprogramm: detailprogrammEntry,
			});
		} catch (error) {
			next(error);
		}
	}
);
