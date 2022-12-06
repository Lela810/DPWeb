const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invitesSchema = new mongoose.Schema(
	{
		inviteId: {
			type: Number,
			unique: true,
			index: true,
		},
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

invitesSchema.plugin(AutoIncrement, { inc_field: 'inviteId' });

module.exports = mongoose.model('Invites', invitesSchema);
