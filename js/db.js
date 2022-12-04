const detailprogramm = require('../models/detailprogramm.js');

async function createDetailprogramm(json) {
	const detailprogrammEntry = new detailprogramm(json);

	try {
		await detailprogrammEntry.save();
	} catch (err) {
		throw err;
	}
}

async function editDetailprogramm(detailprogrammId, json) {
	detailprogramm.findOneAndUpdate(
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

async function loadDetailprogramm(detailprogrammId) {
	if (!detailprogrammId) {
		return 0;
	}
	let detailprogrammEntry;
	try {
		detailprogrammEntry = await detailprogramm.find({
			detailprogrammId: detailprogrammId,
		});
		return detailprogrammEntry[0];
	} catch (err) {
		console.error(err);
		return err;
	}
}

async function loadAllDPs(find) {
	let detailprogramme;
	if (!find) {
		find = {};
	}
	try {
		detailprogramme = await detailprogramm.find(find);
		return detailprogramme;
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
};
