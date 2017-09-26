var Message = require('./DB/messageDB.js');

function getListObj(ori) {
    return {
        indexId: ori.img.id,
        userId: ori.event.source.userId,
        userName: ori.event.source.displayName,
        uploadTime: ori.event.timestamp,
        messageId: ori.event.message.id,
        imgType: ori.img.contentType,
        imgBinary: ori.img.data.toString('base64'),
        checked: ori.img.checked
    };
}

module.exports = {
    getInitList: function(next, callback) {
        Message.findOne({ 'event.message.type': 'image', 'img.checked': false }, {}, { sort: { 'img.id': 1 } }, function(err, message) {
            if (err) next(err);
            callback(message.img.id);
        });
    },
    getImageList: function(index, next, callback) {
        index = parseInt(index);
        if (index <= 0) callback([]);
        Message.find({ 'event.message.type': 'image' }, function(err, messages) {
            if (err) next(err);
            if (!messages || messages.length === 0) return callback([]);
            messages.sort(function(a, b) { return a.img.id - b.img.id });
            var list = [];
            var listLength = 20;
            if (index > messages.length) return callback([]);
            else if (index > (messages.length - 20)) listLength = (messages.length - index);
            for (var i = 0; i < listLength; i++, index++) {
                if (index < messages.length) {
                    list.push(getListObj(messages[index]));
                }
            }
            callback(list);
        });
    },
    getImageListBackward: function(index, next, callback) {
        index = parseInt(index);
        if (index <= 0) callback([]);
        Message.find({ 'event.message.type': 'image' }, function(err, messages) {
            if (err) next(err);
            if (!messages || messages.length === 0) return callback([]);
            messages.sort(function(a, b) { return a.img.id - b.img.id });
            var list = [];
            var listLength = 20;
            if (index > messages.length) return callback([]);
            else if ((index - 20) < 0) {
                listLength = index + 1;
                index = 0;
            } else {
                index = index - 20;
            }
            for (var i = 0; i < listLength; i++, index++) {
                if (index < messages.length) {
                    list.push(getListObj(messages[index]));
                }
            }
            callback(list);
        });
    }
}