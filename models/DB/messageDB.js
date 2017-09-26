var mongoose = require('mongoose');

// define the schema for our user model
var schema = mongoose.Schema({
    messageType: { type: String, default: 'GET' },
    event: Object,
    notify: Boolean,
    img: {
        id: Number,
        data: Buffer,
        contentType: String,
        checked: Boolean,
        checkStatus: {
            typeCode: String,
            amount: Number
        }
    },
    read: { type: Boolean, default: false },
    logTime: { type: Date, default: Date.now }
});

schema.index({ "logTime": -1 });

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', schema);