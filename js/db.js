const detailprogramme = require('../models/detailprogramme.js');
const recipients = require('../models/recipients.js');

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
		return recipientsEntry[0];
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
};
