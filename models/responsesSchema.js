const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const responsesSchema = new mongoose.Schema(
	{
		mailId: {
			type: Number,
			required: true,
		},
		names: {
			type: Array,
			required: true,
		},
		mails: {
			type: Array,
			required: true,
		},
	},
	{ collection: 'responses' }
);

module.exports = mongoose.model('Responses', responsesSchema);
