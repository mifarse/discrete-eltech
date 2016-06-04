var mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:dm4ever@ds028799.mlab.com:28799/discretka');
module.exports = mongoose.connection;