var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import express from 'express';
export const detailprogrammeRouter = express.Router();
const prisma = new PrismaClient();
function updateActivity(detailprogrammEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        let activity = yield prisma.activities.findUniqueOrThrow({
            where: {
                id: detailprogrammEntry.activityId,
            },
        });
        activity.detailprogrammId = detailprogrammEntry.id;
        const newActivity = activity;
        delete newActivity.id;
        yield prisma.activities.update({
            data: newActivity,
            where: {
                id: detailprogrammEntry.activityId,
            },
        });
    });
}
detailprogrammeRouter.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('detailprogramme', {
            user: req.user,
            page: 'Detailprogramme',
            detailprogramme: yield prisma.detailprogramme.findMany(),
        });
    });
});
detailprogrammeRouter.get('/edit', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let detailprogramm = {};
        let detailprogrammId = '';
        let activity;
        if (req.query.activityId != undefined) {
            activity = yield prisma.activities.findUniqueOrThrow({
                where: {
                    id: req.query.activityId,
                },
            });
            detailprogrammId = activity.detailprogrammId;
        }
        if (req.query.id != undefined || detailprogrammId != '') {
            try {
                detailprogramm = yield prisma.detailprogramme.findUniqueOrThrow({
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
});
detailprogrammeRouter.post('/create', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEntry = yield prisma.detailprogramme.create({
            data: req.body,
        });
        yield updateActivity(newEntry);
        res.render('editDetailprogramm', {
            user: req.user,
            page: 'Detailprogramme',
            detailprogramm: yield prisma.detailprogramme.findUniqueOrThrow({
                where: {
                    id: newEntry.id,
                },
            }),
        });
    }
    catch (error) {
        next(error);
    }
}));
detailprogrammeRouter.post('/edit', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detailprogrammEntry = req.body;
        yield prisma.detailprogramme.update({
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
}));