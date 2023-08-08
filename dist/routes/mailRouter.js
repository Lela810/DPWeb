var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { distributeMail } from '../js/distributeMail.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
export const mailRouter = express.Router();
mailRouter.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('mail', {
            user: req.user,
            page: 'Mail',
            mails: yield prisma.mails.findMany(),
        });
    });
});
mailRouter.get('/view', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let mail = {};
            let responses = {};
            let mailId = '';
            let activity;
            mail = yield prisma.mails.findUniqueOrThrow({
                where: {
                    id: req.query.id || mailId,
                },
            });
            responses = yield prisma.responses.findUniqueOrThrow({
                where: {
                    mailId: req.query.id || mailId,
                },
            });
            res.render('editorMail', {
                user: req.user,
                page: 'Mail',
                mail: mail,
                responses: responses,
                activity: activity,
            });
        }
        catch (error) {
            next(error);
        }
    });
});
mailRouter.get('/editor', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let mail = {};
            let responses = {};
            let activity;
            activity = yield prisma.activities.findUniqueOrThrow({
                where: {
                    id: req.query.activityId,
                },
            });
            res.render('editorMail', {
                user: req.user,
                page: 'Mail',
                mail: mail,
                responses: responses,
                activity: activity,
            });
        }
        catch (error) {
            next(error);
        }
    });
});
mailRouter.post('/editor', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let inviteBool = false;
        if (req.body.invite == 'on') {
            inviteBool = true;
        }
        const mailRaw = {
            invite: inviteBool,
            sender: req.user.emails.find((e) => e.type == 'work').value,
            receivers: yield prisma.recipients.findMany(),
            subject: req.body.subject,
            message: req.body.message,
            date: new Date(),
            detailprogrammId: null,
            activityId: null,
        };
        if (req.body.activityId) {
            mailRaw.activityId = req.body.activityId;
            const acitivity = yield prisma.activities.findUniqueOrThrow({
                where: {
                    id: req.body.activityId,
                },
            });
            if (acitivity.detailprogrammId) {
                mailRaw.detailprogrammId = acitivity.detailprogrammId;
            }
        }
        const mailEntry = yield prisma.mails.create({
            data: mailRaw,
        });
        console.log(mailEntry);
        distributeMail(mailEntry);
        res.redirect('/mail');
    }
    catch (error) {
        next(error);
    }
}));