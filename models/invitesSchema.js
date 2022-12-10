const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invitesSchema = new mongoose.Schema(
	{
		mailId: {
			type: Number,
			required: true,
		},
		identifiers: {
			type: Array,
			required: true,
		},
		mails: {
			type: Array,
			required: true,
		},
	},
	{ collection: 'invites' }
);

module.exports = mongoose.model('Invites', invitesSchema);
