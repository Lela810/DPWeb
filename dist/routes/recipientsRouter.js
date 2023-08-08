var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import validate from 'validate.js';
import { ObjectID } from 'bson';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express from 'express';
export const recipientsRouter = express.Router();
recipientsRouter.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('recipients', {
            user: req.user,
            page: 'Mail',
            recipients: yield prisma.recipients.findMany(),
        });
    });
});
recipientsRouter.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (Object.keys(req.body).length == 0) {
            yield prisma.recipients.deleteMany();
            res.render('recipients', {
                user: req.user,
                page: 'Mail',
                recipients: [],
            });
            return;
        }
        if (!Array.isArray(req.body.name)) {
            req.body.name = [req.body.name];
        }
        if (!Array.isArray(req.body.mail)) {
            req.body.mail = [req.body.mail];
        }
        if (!Array.isArray(req.body.id)) {
            req.body.id = [req.body.id];
        }
        for (let i = 0; i < req.body.name.length; i++) {
            if (validate({ mail: req.body.mail[i] }, { mail: { email: true } }) !=
                undefined) {
                let recipients = [];
                for (let i = 0; i < req.body.name.length; i++) {
                    recipients.push({
                        name: req.body.name[i],
                        mail: req.body.mail[i],
                    });
                }
                res.render('recipients', {
                    user: req.user,
                    page: 'Mail',
                    recipients: recipients,
                    error: 'Invalid email address',
                });
                return;
            }
        }
        const recipients = yield prisma.recipients.findMany();
        for (let i = 0; i < recipients.length; i++) {
            if (req.body.id.find((id) => id == recipients[i].id) == undefined) {
                yield prisma.recipients.delete({
                    where: {
                        id: recipients[i].id,
                    },
                });
            }
        }
        for (let i = 0; i < req.body.name.length; i++) {
            const recipientEntry = {
                mail: req.body.mail[i],
                name: req.body.name[i],
            };
            yield prisma.recipients.upsert({
                create: recipientEntry,
                update: recipientEntry,
                where: {
                    id: req.body.id[i] || new ObjectID().toString(),
                },
            });
        }
        res.render('recipients', {
            user: req.user,
            page: 'Mail',
            recipients: yield prisma.recipients.findMany(),
        });
    }
    catch (error) {
        next(error);
    }
}));