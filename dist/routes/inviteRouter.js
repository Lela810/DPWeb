import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
import validate from 'validate.js';
export const inviteRouter = express.Router();
inviteRouter.get('/', async function (req, res, next) {
    try {
        const mail = await prisma.mails.findUniqueOrThrow({
            where: {
                id: req.query.id,
            },
        });
        let mailReceivers = mail.receivers;
        const identifier = req.query.identifier;
        const invite = await prisma.invites.findUniqueOrThrow({
            where: {
                mailId: req.query.id,
            },
        });
        const mailOfIdentifier = invite.mails[invite.identifiers.indexOf(identifier)];
        const recipients = mailReceivers.filter((receiver) => receiver.mail === mailOfIdentifier);
        res.render('invite', {
            user: req.user,
            page: 'invite',
            recipients: recipients,
            id: req.query.id,
            validate: validate,
        });
    }
    catch (error) {
        next(error);
    }
});
inviteRouter.post('/', async (req, res, next) => {
    try {
        let responseEntry = await prisma.responses.findUniqueOrThrow({
            where: {
                mailId: req.body.id,
            },
        });
        if (responseEntry.names.indexOf(req.body.name) !=
            responseEntry.mails.indexOf(req.body.mail) ||
            (responseEntry.names.indexOf(req.body.name) == -1 &&
                responseEntry.mails.indexOf(req.body.mail) == -1)) {
            responseEntry.names.push(req.body.name);
            responseEntry.mails.push(req.body.mail);
            await prisma.responses.update({
                where: {
                    mailId: req.body.id,
                },
                data: {
                    names: responseEntry.names,
                    mails: responseEntry.mails,
                },
            });
        }
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});
