import { sendMail } from './mail.js';
import { mails, PrismaClient } from '@prisma/client';
import { inviteEntry } from '../types/prismaEntry.js';
import { generatePdf } from './pdf.js';
const prisma = new PrismaClient();

function onlyUnique(value: any, index: any, self: any) {
	return self.indexOf(value) === index;
}

function makeid(length: any) {
	var result = '';
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export async function distributeMail(mailEntry: mails) {
	let unfilteredReceivers: string[] = [];
	mailEntry.receivers.forEach((receiver: any) => {
		unfilteredReceivers.push(receiver.mail);
	});
	const filteredReceivers = unfilteredReceivers.filter(onlyUnique);

	if (mailEntry.invite) {
		let inviteEntry: inviteEntry = {
			mailId: mailEntry.id,
			identifiers: [],
			mails: [],
		};
		filteredReceivers.forEach(async (receiver) => {
			inviteEntry.identifiers.push(makeid(20));
			inviteEntry.mails.push(receiver);
		});
		try {
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
				const inviteLink = `http://localhost:3000/invite?id=${
					mailEntry.id
				}&identifier=${
					inviteEntry.identifiers[inviteEntry.mails.indexOf(receiver)]
				}`;
				sendMail(
					mailEntry.sender,
					receiver,
					mailEntry.subject,
					mailEntry.message + inviteLink
				);
			});
		} catch (error) {
			console.log(error);
			return;
		}
	} else {
		try {
			await generatePdf();
			filteredReceivers.forEach((receiver) => {
				sendMail(
					mailEntry.sender,
					receiver,
					mailEntry.subject,
					mailEntry.message
				);
			});
		} catch (error) {
			console.log(error);
			return;
		}
	}
}
