import express from 'express';
import {
	activities,
	detailprogramme,
	mails,
	PrismaClient,
} from '@prisma/client';
import { activitiesEntry } from '../types/prismaEntry';
import { error } from 'node:console';

export const activitiesRouter = express.Router();
const prisma = new PrismaClient();

async function renderActivities(
	res: express.Response,
	activityId: string,
	req: express.Request
) {
	const activity = await prisma.activities.findUniqueOrThrow({
		where: {
			id: activityId,
		},
	});

	const detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
		where: {
			activityId: activityId,
		},
	});

	const mails = await prisma.mails.findMany({
		where: {
			activityId: activity.id as string,
		},
	});

	res.render('editActivity', {
		user: req.user,
		page: 'Aktivität',
		activity: activity,
		detailprogramm: detailprogramm,
		mails: mails,
	});
}

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
		const activityId = req.query.id as string;
		if (req.query.id != undefined) {
			next(error);
		} else {
			const activity = await prisma.activities.findUniqueOrThrow({
				where: {
					id: activityId,
				},
			});

			const detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
				where: {
					activityId: activityId,
				},
			});

			const mails = await prisma.mails.findMany({
				where: {
					activityId: activity.id as string,
				},
			});

			res.render('editActivity', {
				user: req.user,
				page: 'Aktivität',
				activity: activity,
				detailprogramm: detailprogramm,
				mails: mails,
			});
		}
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
			const activityId = req.query.id as string;
			const activityEntry = req.body as activitiesEntry;

			const activity = await prisma.activities.update({
				data: activityEntry,
				where: {
					id: activityId,
				},
			});

			const detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
				where: {
					activityId: activityId,
				},
			});

			const mails = await prisma.mails.findMany({
				where: {
					activityId: activityId,
				},
			});

			res.render('editActivity', {
				user: req.user,
				page: 'Aktivität',
				activity: activity,
				detailprogramm: detailprogramm,
				mails: mails,
			});
		} catch (error) {
			next(error);
		}
	}
);
