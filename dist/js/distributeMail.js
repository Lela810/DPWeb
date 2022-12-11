import { sendMail } from './mail.js';
import { PrismaClient } from '@prisma/client';
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
export async function distributeMail(mailEntry) {
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
        filteredReceivers.forEach(async (receiver) => {
            inviteEntry.identifiers.push(makeid(20));
            inviteEntry.mails.push(receiver);
        });
        await prisma.invites.create({
            data: inviteEntry,
        });
        await prisma.responses.create({
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
    else {
        filteredReceivers.forEach((receiver) => {
            sendMail(mailEntry.sender, receiver, mailEntry.subject, mailEntry.message);
        });
    }
}
