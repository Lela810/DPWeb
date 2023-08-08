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
const prisma = new PrismaClient();
import express from 'express';
import validate from 'validate.js';
export const inviteRouter = express.Router();
inviteRouter.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mail = yield prisma.mails.findUniqueOrThrow({
                where: {
                    id: req.query.id,
                },
            });
            let mailReceivers = mail.receivers;
            const identifier = req.query.identifier;
            const invite = yield prisma.invites.findUniqueOrThrow({
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
});
inviteRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let responseEntry = yield prisma.responses.findUniqueOrThrow({
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
            yield prisma.responses.update({
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
}));