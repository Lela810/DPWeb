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
			type: Array,
			required: true,
		},
		name: {
			type: Array,
			required: true,
		},
	},
	{ collection: 'recipients' }
);

recipientsSchema.plugin(AutoIncrement, { inc_field: 'recipientId' });

module.exports = mongoose.model('Recipients', recipientsSchema);
