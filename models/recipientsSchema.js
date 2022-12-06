const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const recipientsSchema = new mongoose.Schema(
	{
		recipientId: {
			type: Number,
			unique: true,
			index: true,
		},
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

recipientsSchema.plugin(AutoIncrement, { inc_field: 'recipientId' });

module.exports = mongoose.model('Recipients', recipientsSchema);
