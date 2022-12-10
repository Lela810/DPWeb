const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const mailsSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true,
		},
		invite: {
			type: Boolean,
			required: true,
		},
		sender: {
			type: String,
			required: true,
		},
		receivers: {
			type: Array,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
	},
	{ collection: 'mails' }
);

module.exports = mongoose.model('Mails', mailsSchema);
