import { distributeMail } from '../js/distributeMail.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
export const mailRouter = express.Router();
mailRouter.get('/', async function (req, res) {
    res.render('mail', {
        user: req.user,
        page: 'Mail',
        mails: await prisma.mails.findMany(),
    });
});
mailRouter.get('/view', async function (req, res, next) {
    try {
        const mailId = req.query.id;
        let receivers;
        const mail = await prisma.mails.findUniqueOrThrow({
            where: {
                id: mailId,
            },
        });
        const activity = await prisma.activities.findUniqueOrThrow({
            where: {
                id: mail.activityId,
            },
        });
        if (mail.invite) {
            receivers = (await prisma.invites.findUniqueOrThrow({
                where: {
                    mailId: mailId,
                },
            })).receivers;
        }
        else {
            receivers = mail.receivers;
        }
        res.render('editorMail', {
            user: req.user,
            page: 'Mail',
            mail: mail,
            receivers: receivers,
            activity: activity,
        });
    }
    catch (error) {
        next(error);
    }
});
mailRouter.get('/editor', async function (req, res, next) {
    try {
        let mail = {};
        const activityId = req.query.activityId;
        const activity = await prisma.activities.findUniqueOrThrow({
            where: {
                id: activityId,
            },
        });
        res.render('editorMail', {
            user: req.user,
            page: 'Mail',
            mail: mail,
            activity: activity,
            receivers: await prisma.recipients.findMany(),
        });
    }
    catch (error) {
        next(error);
    }
});
mailRouter.post('/editor', async (req, res, next) => {
    try {
        let inviteBool = false;
        if (req.body.invite == 'on') {
            inviteBool = true;
        }
        const mailRaw = {
            invite: inviteBool,
            sender: req.user.emails.find((e) => e.type == 'work').value,
            receivers: (await prisma.recipients.findMany()).map(({ id, synced, ...rest }) => rest),
            subject: req.body.subject,
            message: req.body.message,
            date: new Date(),
            activityId: req.body.activityId,
        };
        const mailEntry = await prisma.mails.create({
            data: mailRaw,
        });
        console.log(mailEntry);
        distributeMail(mailEntry);
        res.redirect('/mail');
    }
    catch (error) {
        next(error);
    }
});