var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/', function(req, res, next) {
	res.render('admin', {
		'title': 'This is admin page'
	});
});

module.exports = router;