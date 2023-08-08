var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendMail } from './mail.js';
import { PrismaClient } from '@prisma/client';
import { generatePdf } from './pdf.js';
const prisma = new PrismaClient();
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
export function distributeMail(mailEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        let unfilteredReceivers = [];
        mailEntry.receivers.forEach((receiver) => {
            unfilteredReceivers.push(receiver.mail);
        });
        const filteredReceivers = unfilteredReceivers.filter(onlyUnique);
        if (mailEntry.invite) {
            let inviteEntry = {
                mailId: mailEntry.id,
                identifiers: [],
                mails: [],
            };
            filteredReceivers.forEach((receiver) => __awaiter(this, void 0, void 0, function* () {
                inviteEntry.identifiers.push(makeid(20));
                inviteEntry.mails.push(receiver);
            }));
            try {
                yield prisma.invites.create({
                    data: inviteEntry,
                });
                yield prisma.responses.create({
                    data: {
                        mailId: mailEntry.id,
                        names: [],
                        mails: [],
                    },
                });
                filteredReceivers.forEach((receiver) => {
                    const inviteLink = `http://localhost:3000/invite?id=${mailEntry.id}&identifier=${inviteEntry.identifiers[inviteEntry.mails.indexOf(receiver)]}`;
                    sendMail(mailEntry.sender, receiver, mailEntry.subject, mailEntry.message + inviteLink);
                });
            }
            catch (error) {
                console.log(error);
                return;
            }
        }
        else {
            try {
                yield generatePdf();
                filteredReceivers.forEach((receiver) => {
                    sendMail(mailEntry.sender, receiver, mailEntry.subject, mailEntry.message);
                });
            }
            catch (error) {
                console.log(error);
                return;
            }
        }
    });
}