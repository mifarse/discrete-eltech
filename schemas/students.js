var mongoose = require('mongoose');

module.exports = mongoose.model('students', {
	first_name: String,
	last_name: String,
	gender: String,
	email: {type: String, unique: true},
	photo: String,
	website: String,
	group: Number,
	registered: { type: Date, default: Date.now }
});