var express = require('express');
var router = express.Router();

var getFirst = require('../models/chatroomProcess.js').getFirst;
var getMessage = require('../models/chatroomProcess.js').getMessage;

router.get('/', function(req, res, next) {
    getFirst(next, function(id) {
        res.redirect('/chatroom/' + id);
    });
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    getMessage(id, next, function(isEmpty, messageObj) {
        console.log(messageObj)
        if (isEmpty) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            res.render('chatroom', {
                'userInfo': messageObj.userInfo,
                'userMessage': messageObj.userMessages,
                'othersMessage': messageObj.otherMessages
            });
        }
    });
});

router.get('/api/:id', function(req, res, next) {
    var id = req.params.id;
    getMessage(id, next, function(isEmpty, messageObj) {
        res.json({
            'isEmpty': isEmpty,
            'userInfo': messageObj.userInfo,
            'userMessage': messageObj.userMessages,
            'othersMessage': messageObj.otherMessages
        });
    });
});

module.exports = router;