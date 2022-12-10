const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const detailprogrammeRouter = express.Router();

detailprogrammeRouter.get('/', async function (req, res) {
	res.render('detailprogramme', {
		user: req.user,
		page: 'Detailprogramme',
		detailprogramme: await prisma.detailprogramme.findMany(),
	});
});

detailprogrammeRouter.get('/edit', async function (req, res) {
	let detailprogramm = {};
	if (req.query.id != undefined) {
		detailprogramm = await prisma.detailprogramme.findUnique({
			where: {
				id: req.query.id,
			},
		});
	}
	res.render('editDetailprogramm', {
		user: req.user,
		page: 'Detailprogramme',
		detailprogramm: detailprogramm,
	});
});
detailprogrammeRouter.post('/create', async (req, res) => {
	try {
		const newEntry = await prisma.detailprogramme.create(
			{
				data: req.body,
			},
			{
				select: {
					id: true,
				},
			}
		);
		res.render('editDetailprogramm', {
			user: req.user,
			page: 'Detailprogramme',
			detailprogramm: await prisma.detailprogramme.findUnique({
				where: {
					id: newEntry.id,
				},
			}),
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			user: req.user,
			page: 500,
			errorcode: 500,
		});
	}
});
detailprogrammeRouter.post('/edit', async (req, res) => {
	try {
		await prisma.detailprogramme.update(
			{
				data: req.body,
			},
			{
				where: {
					id: req.query.id,
				},
			}
		);
		res.render('editDetailprogramm', {
			user: req.user,
			page: 'Detailprogramme',
			detailprogramm: await prisma.detailprogramme.findUnique({
				where: {
					id: req.query.id,
				},
			}),
		});
	} catch (error) {
		console.log(error);
		res.render('error', {
			user: req.user,
			page: 500,
			errorcode: 500,
		});
	}
});

module.exports = detailprogrammeRouter;
