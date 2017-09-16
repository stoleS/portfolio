var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/', function(req, res, next) {
	var messages = db.get('messages');
	messages.find({}, {}, function(err, messages) {
		if (err) { throw err; }
		else{
			res.render('admin/messages', {
				'title': 'Messages',
				'messages': messages
			});
		}
	});
});

router.post('/', function(req, res, next) {
	var name           = req.body.name;
	var email          = req.body.email;
	var message        = req.body.message;
	var messageDate    = new Date();

	var messages = db.get('messages');

	messages.insert({
		'name': name,
		'email': email,
		'message': message,
		'date': messageDate
	}, function(err, message){
		if(err) {
			res.send('There was an issue showing messages');
		} else {
			res.redirect('back');
		}
	});
});

module.exports = router;