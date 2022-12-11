import { detailprogramme, PrismaClient } from '@prisma/client';
import express, { Request } from 'express';
import { detailprogrammEntry } from '../types/prismaEntry';

export const detailprogrammeRouter = express.Router();
const prisma = new PrismaClient();

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
		if (req.query.id != undefined) {
			try {
				detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
					where: {
						id: req.query.id as string,
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
				detailprogramm: await prisma.detailprogramme.findUniqueOrThrow({
					where: {
						id: req.query.id as string,
					},
				}),
			});
		} catch (error) {
			next(error);
		}
	}
);
