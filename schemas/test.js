var mongoose = require('mongoose');

module.exports = mongoose.model('test', {
	_student: { type: String, ref: 'students' },
	testName: String,
	object: {type: Object, default: {}},
	started: { type: Date, default: Date.now },
	finished: { type: Date}
});