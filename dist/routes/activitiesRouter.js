var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { PrismaClient, } from '@prisma/client';
export const activitiesRouter = express.Router();
const prisma = new PrismaClient();
activitiesRouter.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('activities', {
            user: req.user,
            page: 'Aktivität',
            activities: yield prisma.activities.findMany(),
        });
    });
});
activitiesRouter.get('/edit', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let activity = {};
        let detailprogramm = {};
        let mails;
        if (req.query.id != undefined) {
            try {
                activity = yield prisma.activities.findUniqueOrThrow({
                    where: {
                        id: req.query.id,
                    },
                });
            }
            catch (error) {
                next(error);
            }
            if (activity.detailprogrammId.length) {
                detailprogramm = yield prisma.detailprogramme.findUniqueOrThrow({
                    where: {
                        id: activity.detailprogrammId,
                    },
                });
            }
            mails = yield prisma.mails.findMany({
                where: {
                    activityId: activity.id,
                },
            });
        }
        res.render('editActivity', {
            user: req.user,
            page: 'Aktivität',
            activity: activity,
            detailprogramm: detailprogramm,
            mails: mails,
        });
    });
});
activitiesRouter.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEntry = yield prisma.activities.create({
            data: req.body,
        });
        res.render('editActivity', {
            user: req.user,
            page: 'Aktivität',
            activity: newEntry,
        });
    }
    catch (error) {
        next(error);
    }
}));
activitiesRouter.post('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let detailprogramm = {};
        let mails;
        const activityEntry = req.body;
        yield prisma.activities.update({
            data: activityEntry,
            where: {
                id: req.query.id,
            },
        });
        if (activityEntry.detailprogrammId.length) {
            detailprogramm = yield prisma.detailprogramme.findUniqueOrThrow({
                where: {
                    id: activityEntry.detailprogrammId,
                },
            });
        }
        mails = yield prisma.mails.findMany({
            where: {
                activityId: req.query.id,
            },
        });
        res.render('editActivity', {
            user: req.user,
            page: 'Aktivität',
            activity: yield prisma.activities.findUniqueOrThrow({
                where: {
                    id: req.query.id,
                },
            }),
            detailprogramm: detailprogramm,
            mails: mails,
        });
    }
    catch (error) {
        next(error);
    }
}));