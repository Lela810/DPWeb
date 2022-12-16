import { PrismaClient } from '@prisma/client';
import express from 'express';
export const detailprogrammeRouter = express.Router();
const prisma = new PrismaClient();
detailprogrammeRouter.get('/', async function (req, res) {
    res.render('detailprogramme', {
        user: req.user,
        page: 'Detailprogramme',
        detailprogramme: await prisma.detailprogramme.findMany(),
    });
});
detailprogrammeRouter.get('/edit', async function (req, res, next) {
    let detailprogramm = {};
    if (req.query.id != undefined) {
        try {
            detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
                where: {
                    id: req.query.id,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    res.render('editDetailprogramm', {
        user: req.user,
        page: 'Detailprogramme',
        detailprogramm: detailprogramm,
    });
});
detailprogrammeRouter.post('/create', async (req, res, next) => {
    try {
        const newEntry = await prisma.detailprogramme.create({
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
    }
    catch (error) {
        next(error);
    }
});
detailprogrammeRouter.post('/edit', async (req, res, next) => {
    try {
        const detailprogrammEntry = req.body;
        await prisma.detailprogramme.update({
            data: detailprogrammEntry,
            where: {
                id: req.query.id,
            },
        });
        res.render('editDetailprogramm', {
            user: req.user,
            page: 'Detailprogramme',
            detailprogramm: await prisma.detailprogramme.findUniqueOrThrow({
                where: {
                    id: req.query.id,
                },
            }),
        });
    }
    catch (error) {
        next(error);
    }
});
