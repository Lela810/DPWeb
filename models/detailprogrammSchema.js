const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const detailprogrammSchema = new mongoose.Schema(
	{
		date: {
			type: String,
			required: true,
		},
		starttime: {
			type: String,
			required: true,
		},
		endtime: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: false,
		},
		responsible: {
			type: String,
			required: true,
		},
		ablauf: {
			type: Array,
			required: false,
		},
		zeit: {
			type: Array,
			required: false,
		},
		material: {
			type: String,
			required: false,
		},
	},
	{ collection: 'detailprogramme' }
);

module.exports = mongoose.model('Detailprogramm', detailprogrammSchema);
