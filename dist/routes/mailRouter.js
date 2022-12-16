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
mailRouter.get('/editor', async function (req, res, next) {
    try {
        let mail = {};
        let responses = {};
        if (req.query.id) {
            mail = await prisma.mails.findUniqueOrThrow({
                where: {
                    id: req.query.id,
                },
            });
            responses = await prisma.responses.findUniqueOrThrow({
                where: {
                    mailId: req.query.id,
                },
            });
        }
        res.render('editorMail', {
            user: req.user,
            page: 'Mail',
            mail: mail,
            responses: responses,
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
            receivers: await prisma.recipients.findMany(),
            subject: req.body.subject,
            message: req.body.message,
            date: new Date(),
        };
        const mailEntry = await prisma.mails.create({
            data: mailRaw,
        });
        distributeMail(mailEntry);
        res.redirect('/mail');
    }
    catch (error) {
        next(error);
    }
});
