const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const responsesSchema = new mongoose.Schema(
	{
		responseId: {
			type: Number,
			unique: true,
			index: true,
		},
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

responsesSchema.plugin(AutoIncrement, { inc_field: 'responseId' });

module.exports = mongoose.model('Responses', responsesSchema);
