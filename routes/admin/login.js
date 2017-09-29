var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/', function(req, res, next) {
	res.render('admin/login', {
		'title': 'Login'
	});
});

router.post('/', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	console.log(username);
});

module.exports = router;