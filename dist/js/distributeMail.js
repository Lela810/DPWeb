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
    let filteredReceivers = unfilteredReceivers.filter(onlyUnique);
    if (mailEntry.invite) {
        let receiversWithIdentifiers = filteredReceivers.map((mail) => ({
            mail,
            identifier: makeid(20),
        }));
        let inviteEntry = {
            mailId: mailEntry.id,
            receivers: [],
        };
        mailEntry.receivers.forEach((receiver) => {
            const matchingReceiver = receiversWithIdentifiers.find((r) => r.mail === receiver.mail);
            if (matchingReceiver) {
                inviteEntry.receivers.push({
                    mail: receiver.mail,
                    name: receiver.name,
                    identifier: matchingReceiver.identifier,
                    rejected: false,
                });
            }
        });
        try {
            await prisma.invites.create({
                data: inviteEntry,
            });
            receiversWithIdentifiers.forEach((receiver) => {
                const inviteLink = `http://localhost:3000/invite?id=${mailEntry.id}&identifier=${receiver.identifier}`;
                sendMail(mailEntry.sender, receiver.mail, mailEntry.subject, mailEntry.message + inviteLink);
            });
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    else {
        try {
            filteredReceivers.forEach((receiver) => {
                sendMail(mailEntry.sender, receiver, mailEntry.subject, mailEntry.message);
            });
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
}