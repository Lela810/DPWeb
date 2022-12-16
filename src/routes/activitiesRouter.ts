import express from 'express';
import {
	activities,
	detailprogramme,
	mails,
	PrismaClient,
} from '@prisma/client';
import { activitiesEntry } from '../types/prismaEntry';

export const activitiesRouter = express.Router();
const prisma = new PrismaClient();

activitiesRouter.get(
	'/',
	async function (req: express.Request, res: express.Response) {
		res.render('activities', {
			user: req.user,
			page: 'Aktivität',
			activities: await prisma.activities.findMany(),
		});
	}
);
activitiesRouter.get(
	'/edit',
	async function (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		let activity: activities = {} as activities;
		let detailprogramm: detailprogramme = {} as detailprogramme;
		let mail: mails = {} as mails;
		if (req.query.id != undefined) {
			try {
				activity = await prisma.activities.findUniqueOrThrow({
					where: {
						id: req.query.id as string,
					},
				});
			} catch (error) {
				next(error);
			}
			if (activity.detailprogrammId.length) {
				detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
					where: {
						id: activity.detailprogrammId as string,
					},
				});
			}
			if (activity.mailId.length) {
				mail = await prisma.mails.findUniqueOrThrow({
					where: {
						id: activity.mailId as string,
					},
				});
			}
		}

		console.log(detailprogramm);
		res.render('editActivity', {
			user: req.user,
			page: 'Aktivität',
			activity: activity,
			detailprogramm: detailprogramm,
			mail: mail,
		});
	}
);
activitiesRouter.post(
	'/create',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			const newEntry: activitiesEntry = await prisma.activities.create({
				data: req.body,
			});
			res.render('editActivity', {
				user: req.user,
				page: 'Aktivität',
				activity: newEntry,
			});
		} catch (error) {
			next(error);
		}
	}
);
activitiesRouter.post(
	'/edit',
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		try {
			let detailprogramm: detailprogramme = {} as detailprogramme;
			let mail: mails = {} as mails;
			const activityEntry: activitiesEntry = req.body;
			await prisma.activities.update({
				data: activityEntry,
				where: {
					id: req.query.id as string,
				},
			});
			if (activityEntry.detailprogrammId.length) {
				detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
					where: {
						id: activityEntry.detailprogrammId as string,
					},
				});
			}
			if (activityEntry.mailId.length) {
				mail = await prisma.mails.findUniqueOrThrow({
					where: {
						id: activityEntry.mailId as string,
					},
				});
			}
			res.render('editActivity', {
				user: req.user,
				page: 'Aktivität',
				activity: await prisma.activities.findUniqueOrThrow({
					where: {
						id: req.query.id as string,
					},
				}),
				detailprogramm: detailprogramm,
				mail: mail,
			});
		} catch (error) {
			next(error);
		}
	}
);
