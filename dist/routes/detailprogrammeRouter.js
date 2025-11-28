import { PrismaClient } from '@prisma/client';
import express from 'express';
export const detailprogrammeRouter = express.Router();
const prisma = new PrismaClient();
async function updateActivity(detailprogrammEntry) {
    let activity = await prisma.activities.findUniqueOrThrow({
        where: {
            id: detailprogrammEntry.activityId,
        },
    });
    activity.detailprogrammId = detailprogrammEntry.id;
    const newActivity = activity;
    delete newActivity.id;
    await prisma.activities.update({
        data: newActivity,
        where: {
            id: detailprogrammEntry.activityId,
        },
    });
}
detailprogrammeRouter.get('/', async function (req, res) {
    res.render('detailprogramme', {
        user: req.user,
        page: 'Detailprogramme',
        detailprogramme: await prisma.detailprogramme.findMany(),
    });
});
detailprogrammeRouter.get('/edit', async function (req, res, next) {
    let detailprogramm = {};
    let detailprogrammId = '';
    let activity;
    if (req.query.activityId != undefined) {
        activity = await prisma.activities.findUniqueOrThrow({
            where: {
                id: req.query.activityId,
            },
        });
        detailprogrammId = activity.detailprogrammId;
    }
    if (req.query.id != undefined || detailprogrammId != '') {
        try {
            detailprogramm = await prisma.detailprogramme.findUniqueOrThrow({
                where: {
                    id: req.query.id || detailprogrammId,
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
        activity: activity,
    });
});
detailprogrammeRouter.post('/create', async (req, res, next) => {
    try {
        const newEntry = await prisma.detailprogramme.create({
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
            detailprogramm: detailprogrammEntry,
        });
    }
    catch (error) {
        next(error);
    }
});