const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const recipientsSchema = new mongoose.Schema(
	{
		mail: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	{ collection: 'recipients' }
);

module.exports = mongoose.model('Recipients', recipientsSchema);
