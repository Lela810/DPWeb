const detailprogramme = require('../models/detailprogrammSchema.js');
const recipients = require('../models/recipientsSchema.js');
const mails = require('../models/mailsSchema.js');
const invites = require('../models/invitesSchema.js');
const responses = require('../models/responsesSchema.js');

async function createDetailprogramm(json) {
	const detailprogrammEntry = new detailprogramme(json);

	try {
		await detailprogrammEntry.save();
	} catch (err) {
		throw err;
	}
}

async function createRecipient(json) {
	const recipientEntry = new recipients(json);

	try {
		await recipientEntry.save();
	} catch (err) {
		throw err;
	}
}

async function createMail(json) {
	const mailEntry = new mails(json);

	try {
		await mailEntry.save();
	} catch (err) {
		throw err;
	}
}

async function createInvite(json) {
	const inviteEntry = new invites(json);

	try {
		await inviteEntry.save();
	} catch (err) {
		throw err;
	}
}

async function createResponse(json) {
	const responseEntry = new responses(json);

	try {
		await responseEntry.save();
	} catch (err) {
		throw err;
	}
}

async function addResponse(mailId, name, mail) {
	let responseEntry = (
		await responses.find({
			mailId: mailId,
		})
	)[0];
	console.log(responseEntry);
	responseEntry.names.push(name);
	responseEntry.mails.push(mail);

	try {
		await responseEntry.save();
	} catch (err) {
		throw err;
	}
}

async function editDetailprogramm(detailprogrammId, json) {
	detailprogramme.findOneAndUpdate(
		{ detailprogrammId: detailprogrammId },
		json,
		{ new: true },
		function (err, result) {
			if (err) {
				throw err;
			} else {
				return result;
			}
		}
	);
	return;
}

async function editRecipients(recipientId, json) {
	recipients.findOneAndUpdate(
		{ recipientId: recipientId },
		json,
		{ new: true },
		function (err, result) {
			if (err) {
				throw err;
			} else {
				return result;
			}
		}
	);
	return;
}

async function loadDetailprogramm(detailprogrammId) {
	if (!detailprogrammId) {
		return 0;
	}
	let detailprogrammEntry;
	try {
		detailprogrammEntry = await detailprogramme.find({
			detailprogrammId: detailprogrammId,
		});
		return detailprogrammEntry[0];
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadMail(mailId) {
	if (!mailId) {
		return 0;
	}
	let mailEntry;
	try {
		mailEntry = await mails.find({
			mailId: mailId,
		});
		return mailEntry[0];
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadResponses(mailId) {
	if (!mailId) {
		return 0;
	}
	let responsesEntry;
	try {
		responsesEntry = await responses.find({
			mailId: mailId,
		});
		return responsesEntry[0];
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadAllDPs(find) {
	let detailprogrammeEntry;
	if (!find) {
		find = {};
	}
	try {
		detailprogrammeEntry = await detailprogramme.find(find);
		return detailprogrammeEntry;
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadAllRecipients(find) {
	let recipientsEntry;
	if (!find) {
		find = {};
	}
	try {
		recipientsEntry = await recipients.find(find);
		return recipientsEntry;
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function deleteAllRecipients() {
	try {
		await recipients.deleteMany({});
		return 0;
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadAllMails(find) {
	let mailsEntry;
	if (!find) {
		find = {};
	}
	try {
		mailsEntry = await mails.find(find);
		return mailsEntry;
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadAllInvites(find) {
	let invitesEntry;
	if (!find) {
		find = {};
	}
	try {
		invitesEntry = await invites.find(find);
		return invitesEntry;
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadAllResponses(find) {
	let responsesEntry;
	if (!find) {
		find = {};
	}
	try {
		responsesEntry = await responses.find(find);
		return responsesEntry;
	} catch (err) {
		console.error(err);
		return err;
	}
}

module.exports = {
	createDetailprogramm,
	loadAllDPs,
	editDetailprogramm,
	loadDetailprogramm,
	loadAllRecipients,
	editRecipients,
	createRecipient,
	createMail,
	loadAllMails,
	loadMail,
	deleteAllRecipients,
	createInvite,
	loadAllInvites,
	createResponse,
	addResponse,
	loadAllResponses,
	loadResponses,
};
